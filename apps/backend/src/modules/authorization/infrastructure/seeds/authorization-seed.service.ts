import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { AutorizacionPermanenteOrmEntity } from '../entities/autorizacion-permanente.orm-entity';
import { PermisoTemporalOrmEntity } from '../entities/permiso-temporal.orm-entity';
import { PaseAccesoRapidoOrmEntity } from '../entities/pase-acceso-rapido.orm-entity';
import { UserOrmEntity } from '@core/auth/infrastructure/user.orm-entity';
import { PersonaOrmEntity } from '../../../registry/infrastructure/repositories/persona.orm-entity';
import { VehiculoOrmEntity } from '../../../registry/infrastructure/repositories/vehiculo.orm-entity';

const PROPIETARIO_PRUEBA_EMAIL = 'propietario@uce.edu.ec';
const PLACA_PRUEBA = 'PBW1234';
const CODIGO_PASE_PRUEBA = 'A7K3M2';

interface PersonaSeed {
  nombres: string;
  apellidos: string;
  identificacionNumero: string;
  relacion: string;
}

const PERSONAS_AUTORIZADAS_SEED: PersonaSeed[] = [
  { nombres: 'Andrea', apellidos: 'Torres', identificacionNumero: '1799999902', relacion: 'CONYUGE' },
  { nombres: 'Luis', apellidos: 'Pérez', identificacionNumero: '1799999903', relacion: 'HIJO' },
];

const PERSONA_PERMISO_TEMPORAL_SEED: PersonaSeed = {
  nombres: 'Carlos',
  apellidos: 'Ruiz',
  identificacionNumero: '1799999904',
  relacion: 'CHOFER',
};

@Injectable()
export class AuthorizationSeedService implements OnModuleInit {
  private readonly logger = new Logger(AuthorizationSeedService.name);

  constructor(
    @InjectRepository(AutorizacionPermanenteOrmEntity)
    private readonly autorizacionPermanenteRepo: Repository<AutorizacionPermanenteOrmEntity>,
    @InjectRepository(PermisoTemporalOrmEntity)
    private readonly permisoTemporalRepo: Repository<PermisoTemporalOrmEntity>,
    @InjectRepository(PaseAccesoRapidoOrmEntity)
    private readonly paseAccesoRapidoRepo: Repository<PaseAccesoRapidoOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(PersonaOrmEntity)
    private readonly personaRepo: Repository<PersonaOrmEntity>,
    @InjectRepository(VehiculoOrmEntity)
    private readonly vehiculoRepo: Repository<VehiculoOrmEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      return;
    }

    const existentes = await this.autorizacionPermanenteRepo.count();
    if (existentes > 0) {
      return;
    }

    const propietarioUser = await this.userRepo.findOne({
      where: { email: PROPIETARIO_PRUEBA_EMAIL },
    });
    if (!propietarioUser) {
      // El SeedService de auth aún no ha corrido (orden de módulos) — se omite.
      return;
    }

    const propietarioPersona = await this.asegurarPersonaPropietario(propietarioUser);
    const vehiculo = await this.asegurarVehiculo(propietarioPersona.personaId);

    // 2 autorizaciones permanentes
    for (const seed of PERSONAS_AUTORIZADAS_SEED) {
      const persona = await this.asegurarPersona(seed);
      const autorizacion = this.autorizacionPermanenteRepo.create({
        id: uuidv4(),
        personaId: persona.personaId,
        vehiculoId: vehiculo.vehiculoId,
        propietarioId: propietarioPersona.personaId,
        tipo: 'PERMANENTE',
        estado: 'ACTIVA',
        relacion: seed.relacion,
      });
      await this.autorizacionPermanenteRepo.save(autorizacion);
    }

    // 1 permiso temporal vigente (hoy → +7 días)
    const personaTemporal = await this.asegurarPersona(PERSONA_PERMISO_TEMPORAL_SEED);
    const ahora = new Date();
    const enSieteDias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const permiso = this.permisoTemporalRepo.create({
      id: uuidv4(),
      personaId: personaTemporal.personaId,
      vehiculoId: vehiculo.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      tipo: 'TEMPORAL',
      estado: 'ACTIVA',
      vigenciaInicio: ahora,
      vigenciaFin: enSieteDias,
      motivo: 'Préstamo temporal de vehículo — seed de desarrollo',
    });
    await this.permisoTemporalRepo.save(permiso);

    // 1 pase activo con código conocido A7K3M2 (fijo, no aleatorio, para que
    // el flujo de validación manual — curl/tests — sea reproducible), vigente 24h
    const codigoHash = await this.hashCodigoConocido();
    const enVeinticuatroHoras = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    const pase = this.paseAccesoRapidoRepo.create({
      id: uuidv4(),
      vehiculoId: vehiculo.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      placa: vehiculo.placa,
      codigoHash,
      estado: 'ACTIVO',
      vigenciaInicio: ahora,
      vigenciaFin: enVeinticuatroHoras,
      nombreVisitante: 'Juan Pérez',
      cedulaVisitante: '1712345678',
      motivo: 'Visita de prueba — seed de desarrollo',
    });
    await this.paseAccesoRapidoRepo.save(pase);

    this.logger.log(
      `🌱 Datos de authorization insertados (development). Pase de prueba: ${CODIGO_PASE_PRUEBA} · placa ${vehiculo.placa}`,
    );
  }

  private async hashCodigoConocido(): Promise<string> {
    return bcrypt.hash(CODIGO_PASE_PRUEBA, 10);
  }

  private async asegurarPersonaPropietario(user: UserOrmEntity): Promise<PersonaOrmEntity> {
    if (user.personaId) {
      const existente = await this.personaRepo.findOne({ where: { personaId: user.personaId } });
      if (existente) return existente;
    }

    let persona = await this.personaRepo.findOne({
      where: { correoInstitucional: PROPIETARIO_PRUEBA_EMAIL },
    });

    if (!persona) {
      persona = this.personaRepo.create({
        personaId: uuidv4(),
        identificacionTipo: 'CEDULA',
        identificacionNumero: '1799999901',
        nombres: 'Propietario',
        apellidos: 'Prueba',
        correoInstitucional: PROPIETARIO_PRUEBA_EMAIL,
        estadoRegistro: 'ACTIVO',
      });
      persona = await this.personaRepo.save(persona);
    }

    await this.userRepo.update({ id: user.id }, { personaId: persona.personaId });

    return persona;
  }

  private async asegurarPersona(seed: PersonaSeed): Promise<PersonaOrmEntity> {
    let persona = await this.personaRepo.findOne({
      where: { identificacionNumero: seed.identificacionNumero },
    });
    if (!persona) {
      persona = this.personaRepo.create({
        personaId: uuidv4(),
        identificacionTipo: 'CEDULA',
        identificacionNumero: seed.identificacionNumero,
        nombres: seed.nombres,
        apellidos: seed.apellidos,
        estadoRegistro: 'ACTIVO',
      });
      persona = await this.personaRepo.save(persona);
    }
    return persona;
  }

  private async asegurarVehiculo(propietarioPersonaId: string): Promise<VehiculoOrmEntity> {
    let vehiculo = await this.vehiculoRepo.findOne({ where: { placa: PLACA_PRUEBA } });
    if (!vehiculo) {
      vehiculo = this.vehiculoRepo.create({
        vehiculoId: uuidv4(),
        propietarioPersonaId,
        placa: PLACA_PRUEBA,
        marca: 'Chevrolet',
        modelo: 'Sail',
        color: 'Blanco',
        anio: 2022,
        estadoRegistro: 'ACTIVO',
      });
      vehiculo = await this.vehiculoRepo.save(vehiculo);
    }
    return vehiculo;
  }
}
