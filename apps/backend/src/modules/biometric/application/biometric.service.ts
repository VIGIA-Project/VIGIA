import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EntityAlreadyExistsException, EntityNotFoundException } from '@core/exceptions/domain-exception';
import { PERFIL_BIOMETRICO_REPOSITORY } from '@shared/constants/injection-tokens';
import { REGISTRY_PORT } from '../../registry/application/ports/registry.port';
import type { IRegistryPort } from '../../registry/application/ports/registry.port';
import { IPerfilBiometricoRepository } from '../domain/repositories/perfil-biometrico.repository';
import { PerfilBiometrico } from '../domain/entities/perfil-biometrico.entity';
import { PerfilBiometricoResponseDto } from './dto/perfil-biometrico-response.dto';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Biometric.
 * El servicio de IA (captura de embeddings) aún no está conectado: aquí
 * solo se administra el estado de disponibilidad del perfil.
 */
@Injectable()
export class BiometricService {
  private readonly logger = new Logger(BiometricService.name);

  constructor(
    @Inject(PERFIL_BIOMETRICO_REPOSITORY)
    private readonly perfilBiometricoRepository: IPerfilBiometricoRepository,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
    private readonly dataSource: DataSource,
  ) {}

  async crearPerfil(personaId: string): Promise<PerfilBiometrico> {
    const persona = await this.registryPort.findPersonaById(personaId);
    if (!persona) {
      throw new EntityNotFoundException('Persona', personaId);
    }

    const existente = await this.perfilBiometricoRepository.buscarPorPersonaId(personaId);
    if (existente) {
      throw new EntityAlreadyExistsException('PerfilBiometrico', personaId);
    }

    const perfil = PerfilBiometrico.crear({
      id: uuidv4(),
      personaId,
    });
    return this.perfilBiometricoRepository.guardar(perfil);
  }

  async buscarPorPersonaId(personaId: string): Promise<PerfilBiometrico | null> {
    return this.perfilBiometricoRepository.buscarPorPersonaId(personaId);
  }

  async contarDisponibles(): Promise<number> {
    return this.perfilBiometricoRepository.contarDisponibles();
  }

  async listarConNombrePersona(): Promise<PerfilBiometricoResponseDto[]> {
    const perfiles = await this.perfilBiometricoRepository.listarTodos();
    return Promise.all(
      perfiles.map(async (perfil) => {
        const persona = await this.registryPort.findPersonaById(perfil.personaId);
        return {
          ...perfil.toJSON(),
          personaNombre: persona?.nombreCompleto,
        };
      }),
    );
  }

  async enrolarBiometria(personaId: string, imagenes: Buffer[]): Promise<{ success: boolean; message: string }> {
    let perfil = await this.perfilBiometricoRepository.buscarPorPersonaId(personaId);
    
    // Si no existe perfil, crearlo
    if (!perfil) {
      perfil = await this.crearPerfil(personaId);
    }

    const fastApiUrl = process.env.BIO_SERVICE_URL || 'http://127.0.0.1:8002';
    const tipos = ['FRONTAL', 'IZQUIERDO', 'DERECHO'];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < 3; i++) {
        const formData = new FormData();
        formData.append('image', new Blob([imagenes[i] as any]), `${tipos[i].toLowerCase()}.jpg`);
        formData.append('tipo_captura', tipos[i]);

        const embedRes = await fetch(`${fastApiUrl}/api/bio/generate-embedding`, {
          method: 'POST',
          body: formData as any,
        });

        if (!embedRes.ok) {
          throw new Error(`Error en API IA para imagen ${tipos[i]}: ${embedRes.statusText}`);
        }

        const embedData = await embedRes.json();
        if (!embedData.embedding) {
          throw new Error(`No se detectó un rostro válido en la imagen ${tipos[i]}`);
        }

        // Insertar en la tabla raw representaciones_biometricas
        const embeddingArray = embedData.embedding;
        await queryRunner.query(
          `INSERT INTO biometric.representaciones_biometricas 
            (perfil_biometrico_id, tipo_captura, embedding_vector, activa)
           VALUES ($1, $2, $3, $4)`,
          [perfil.id, tipos[i], `[${embeddingArray.join(',')}]`, true]
        );
      }

      // Actualizar estado del perfil a DISPONIBLE
      await queryRunner.query(
        `UPDATE biometric.perfiles_biometricos 
         SET estado_disponibilidad = 'DISPONIBLE', 
             ultima_actualizacion_biometrica = NOW(), 
             updated_at = NOW() 
         WHERE perfil_biometrico_id = $1`,
        [perfil.id]
      );

      // Actualizar el estado biometric_registered del usuario
      await queryRunner.query(
        `UPDATE auth.users
         SET biometric_registered = true
         WHERE persona_id = $1`,
        [perfil.personaId]
      );

      await queryRunner.commitTransaction();
      return { success: true, message: 'Perfil biométrico enrolado con éxito' };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error al enrolar biometría: ${error.message}`);
      throw new Error(`Fallo el enrolamiento biométrico: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async verificarIdentidad(fotoRostro: Buffer, candidatosIds: string[]): Promise<{ match: boolean; personaId?: string; message?: string }> {
    if (!candidatosIds || candidatosIds.length === 0) {
      return { match: false, message: 'No hay candidatos para comparar' };
    }

    try {
      // 1. Obtener embedding de la cara capturada
      const formData = new FormData();
      formData.append('image', new Blob([fotoRostro as any]), 'rostro.jpg');
      formData.append('tipo_captura', 'FRONTAL');
      
      const fastApiUrl = process.env.BIO_SERVICE_URL || 'http://127.0.0.1:8002';
      const embedRes = await fetch(`${fastApiUrl}/api/bio/generate-embedding`, {
        method: 'POST',
        body: formData as any,
      });

      if (!embedRes.ok) {
        throw new Error(`Error en API IA: ${embedRes.statusText}`);
      }

      const embedData = await embedRes.json();
      if (!embedData.embedding) {
         return { match: false, message: 'No se detectó un rostro válido en la imagen' };
      }
      const embeddingArray = embedData.embedding;

      // 2. Extraer embeddings de los candidatos
      const candidatosStr = candidatosIds.map(id => `'${id}'`).join(',');
      const rawQuery = `
        SELECT r.representacion_biometrica_id, r.perfil_biometrico_id, r.embedding_vector::text as embedding, p.persona_id
        FROM biometric.representaciones_biometricas r
        JOIN biometric.perfiles_biometricos p ON r.perfil_biometrico_id = p.perfil_biometrico_id
        WHERE p.persona_id IN (${candidatosStr}) AND r.activa = true
      `;
      const representaciones = await this.dataSource.query(rawQuery);

      if (!representaciones || representaciones.length === 0) {
         return { match: false, message: 'Candidatos no tienen biometría enrolada' };
      }

      // 3. Agrupar embeddings por persona_id y perfil_biometrico_id
      const referenceEmbeddingsMap = new Map<string, any>();
      representaciones.forEach((r: any) => {
        if (!referenceEmbeddingsMap.has(r.persona_id)) {
          referenceEmbeddingsMap.set(r.persona_id, {
            persona_id: r.persona_id,
            perfil_biometrico_id: r.perfil_biometrico_id,
            embeddings: []
          });
        }
        referenceEmbeddingsMap.get(r.persona_id).embeddings.push(JSON.parse(r.embedding));
      });

      const compareBody = {
        capture_embedding: embeddingArray,
        reference_embeddings: Array.from(referenceEmbeddingsMap.values()),
        threshold: 0.45
      };

      const compareRes = await fetch(`${fastApiUrl}/api/bio/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compareBody)
      });

      if (!compareRes.ok) {
        throw new Error(`Error en API IA al comparar: ${compareRes.statusText}`);
      }

      const compareData = await compareRes.json();

      if (compareData.resultado === 'COINCIDENCIA_SUFICIENTE') {
        return { match: true, personaId: compareData.persona_id };
      }

      return { match: false, message: 'Rostro no coincide con ningún candidato' };

    } catch (error: any) {
      this.logger.error(`Error en verificarIdentidad: ${error.message}`);
      return { match: false, message: 'Error interno de biometría' };
    }
  }
}
