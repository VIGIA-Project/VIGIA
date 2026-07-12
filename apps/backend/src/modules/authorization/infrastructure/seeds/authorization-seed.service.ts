import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MiembroGrupoFamiliarOrmEntity } from '../entities/miembro-grupo-familiar.orm-entity';
import { PermisoTemporalOrmEntity } from '../entities/permiso-temporal.orm-entity';
import { PaseAccesoRapidoOrmEntity } from '../entities/pase-acceso-rapido.orm-entity';
import { UserOrmEntity } from '@core/auth/infrastructure/user.orm-entity';
import { PersonaOrmEntity } from '../../../registry/infrastructure/repositories/persona.orm-entity';
import { VehiculoOrmEntity } from '../../../registry/infrastructure/repositories/vehiculo.orm-entity';

// ── Códigos de pase de prueba — documentados aquí, nunca en columna de BD ──
const CODIGO_PASE_ACTIVO = 'VIGIA1';    // pase activo para propietario principal
const CODIGO_PASE_DEMO   = 'A7K3M2';   // alias legacy — mismo hash

const PLACA_PROPIETARIO    = 'PBW1234';
const PLACA_PROPIETARIO_2  = 'PCH0001';
const PLACA_PROPIETARIO2_1 = 'PCY5678';
const PLACA_CONTINGENCIA   = 'ABC0912'; // vehículo de contingencia sin salida posterior

const EMAIL_PROPIETARIO  = 'propietario@uce.edu.ec';
const EMAIL_PROPIETARIO2 = 'propietario2@uce.edu.ec';

interface PersonaSeed {
  nombres: string;
  apellidos: string;
  identificacionNumero: string;
  relacion?: string;
  correo?: string;
}

const PERSONAS_FAMILIARES: PersonaSeed[] = [
  { nombres: 'Andrea',   apellidos: 'Torres',   identificacionNumero: '1799999902', relacion: 'CONYUGE' },
  { nombres: 'Luis',     apellidos: 'Pérez',    identificacionNumero: '1799999903', relacion: 'HIJO' },
  { nombres: 'Marta',    apellidos: 'Vega',     identificacionNumero: '1799999905', relacion: 'MADRE' },
];

const PERSONA_CONDUCTOR_TEMPORAL: PersonaSeed = {
  nombres: 'Carlos', apellidos: 'Ruiz', identificacionNumero: '1799999904', relacion: 'CHOFER',
};

const PERSONA_SIN_BIOMETRIA: PersonaSeed = {
  nombres: 'Elena', apellidos: 'Castro', identificacionNumero: '1799999906',
};

@Injectable()
export class AuthorizationSeedService implements OnModuleInit {
  private readonly logger = new Logger(AuthorizationSeedService.name);

  constructor(
    @InjectRepository(MiembroGrupoFamiliarOrmEntity)
    private readonly miembroRepo: Repository<MiembroGrupoFamiliarOrmEntity>,
    @InjectRepository(PermisoTemporalOrmEntity)
    private readonly permisoRepo: Repository<PermisoTemporalOrmEntity>,
    @InjectRepository(PaseAccesoRapidoOrmEntity)
    private readonly paseRepo: Repository<PaseAccesoRapidoOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(PersonaOrmEntity)
    private readonly personaRepo: Repository<PersonaOrmEntity>,
    @InjectRepository(VehiculoOrmEntity)
    private readonly vehiculoRepo: Repository<VehiculoOrmEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (
      this.configService.get<string>('NODE_ENV') !== 'development' &&
      this.configService.get<string>('VIGIA_SEED_DEMO') !== 'true'
    ) {
      return;
    }

    const propietarioUser = await this.userRepo.findOne({ where: { email: EMAIL_PROPIETARIO } });
    if (!propietarioUser) return; // SeedService aún no corrió

    // ─── Propietario principal ────────────────────────────────────────
    const propietarioPersona = await this.asegurarPersonaPropietario(propietarioUser, EMAIL_PROPIETARIO, '1799999901', 'Propietario', 'Prueba');
    const vehiculo1 = await this.asegurarVehiculo(propietarioPersona.personaId, PLACA_PROPIETARIO, 'Chevrolet', 'Sail', 'Blanco', 2022);
    const vehiculo2 = await this.asegurarVehiculo(propietarioPersona.personaId, PLACA_PROPIETARIO_2, 'Toyota', 'Corolla', 'Gris', 2019);

    // ─── Propietario 2 ────────────────────────────────────────────────
    const propietario2User = await this.userRepo.findOne({ where: { email: EMAIL_PROPIETARIO2 } });
    let propietario2Persona: PersonaOrmEntity | null = null;
    let vehiculo2Prop: VehiculoOrmEntity | null = null;
    if (propietario2User) {
      propietario2Persona = await this.asegurarPersonaPropietario(propietario2User, EMAIL_PROPIETARIO2, '1799999910', 'Propietario2', 'Demo');
      vehiculo2Prop = await this.asegurarVehiculo(propietario2Persona.personaId, PLACA_PROPIETARIO2_1, 'Hyundai', 'Tucson', 'Negro', 2021);
    }

    // ─── Familiares del propietario principal ─────────────────────────
    for (const seed of PERSONAS_FAMILIARES) {
      const persona = await this.asegurarPersona(seed);
      await this.asegurarMiembroFamiliar(persona.personaId, propietarioPersona.personaId, seed.relacion ?? 'FAMILIAR');
    }

    // ─── Persona sin biometría (para probar estado PENDIENTE) ─────────
    await this.asegurarPersona(PERSONA_SIN_BIOMETRIA);

    // ─── Permisos temporales ──────────────────────────────────────────
    const conductorTemporal = await this.asegurarPersona(PERSONA_CONDUCTOR_TEMPORAL);
    const ahora = new Date();

    // 1. Vigente (hoy → +7 días)
    await this.asegurarPermisoTemporal({
      personaId: conductorTemporal.personaId,
      vehiculoId: vehiculo1.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      inicio: ahora,
      fin: new Date(ahora.getTime() + 7 * 86400000),
      motivo: 'Préstamo temporal — seed de desarrollo',
      estado: 'ACTIVA',
    });

    // 2. Próximo a expirar (hoy → +2 días)
    await this.asegurarPermisoTemporal({
      personaId: conductorTemporal.personaId,
      vehiculoId: vehiculo2.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      inicio: new Date(ahora.getTime() - 5 * 86400000),
      fin: new Date(ahora.getTime() + 2 * 86400000),
      motivo: 'Permiso próximo a vencer — seed',
      estado: 'ACTIVA',
    });

    // 3. Revocado
    const permisoRevocado = await this.asegurarPermisoTemporal({
      personaId: conductorTemporal.personaId,
      vehiculoId: vehiculo1.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      inicio: new Date(ahora.getTime() - 30 * 86400000),
      fin: new Date(ahora.getTime() - 20 * 86400000),
      motivo: 'Permiso ya revocado — seed',
      estado: 'REVOCADA',
    });
    if (permisoRevocado && !permisoRevocado.fechaRevocacion) {
      // Usar Date.now() + 1000 para evitar que revocado_en sea menor a created_at (violación de ck_perm_temp_revocado)
      await this.permisoRepo.update(permisoRevocado.id, { fechaRevocacion: new Date(Date.now() + 1000) });
    }

    // ─── Pases de acceso rápido ───────────────────────────────────────
    // Pase activo con código conocido VIGIA1 (y alias A7K3M2 — mismo hash)
    const hashActivo = await bcrypt.hash(CODIGO_PASE_ACTIVO, 10);
    await this.asegurarPase({
      vehiculoId: vehiculo1.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      placa: PLACA_PROPIETARIO,
      codigoHash: hashActivo,
      estado: 'ACTIVO',
      inicio: ahora,
      fin: new Date(ahora.getTime() + 24 * 3600000),
      nombre: 'Juan Pérez',
      cedula: '1712345678',
      motivo: 'Visita de prueba — seed de desarrollo',
    });

    // Pase consumido (para histórico)
    const hashConsumed = await bcrypt.hash('TEST00', 10);
    await this.asegurarPase({
      vehiculoId: vehiculo1.vehiculoId,
      propietarioId: propietarioPersona.personaId,
      placa: PLACA_PROPIETARIO,
      codigoHash: hashConsumed,
      estado: 'CONSUMIDO',
      inicio: new Date(ahora.getTime() - 48 * 3600000),
      fin: new Date(ahora.getTime() - 24 * 3600000),
      nombre: 'María Gómez',
      cedula: '1712345679',
      motivo: 'Visita consumida — seed histórico',
    });

    // ─── Eventos de acceso ────────────────────────────────────────────
    await this.asegurarEventosAcceso(vehiculo1.vehiculoId, vehiculo2.vehiculoId, propietarioPersona.personaId);

    // ─── Alertas ──────────────────────────────────────────────────────
    await this.asegurarAlertas();

    // ─── Notificaciones para el propietario ───────────────────────────
    await this.asegurarNotificaciones(propietarioPersona.personaId);

    // ─── Perfiles biométricos placeholder ────────────────────────────
    await this.asegurarPerfilesBiometricos(
      propietarioPersona.personaId,
      PERSONAS_FAMILIARES[0],
      PERSONA_SIN_BIOMETRIA,
    );

    this.logger.log(
      `🌱 Demo data completa. Pase activo: código=${CODIGO_PASE_ACTIVO} / placa=${PLACA_PROPIETARIO}`,
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private async asegurarPersonaPropietario(
    user: UserOrmEntity,
    email: string,
    cedula: string,
    nombres: string,
    apellidos: string,
  ): Promise<PersonaOrmEntity> {
    if (user.personaId) {
      const existente = await this.personaRepo.findOne({ where: { personaId: user.personaId } });
      if (existente) return existente;
    }

    let persona = await this.personaRepo.findOne({ where: { correoInstitucional: email } });
    if (!persona) {
      persona = await this.personaRepo.findOne({ where: { identificacionNumero: cedula } });
    }
    if (!persona) {
      persona = this.personaRepo.create({
        personaId: uuidv4(),
        identificacionTipo: 'CEDULA',
        identificacionNumero: cedula,
        nombres,
        apellidos,
        correoInstitucional: email,
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
        ...(seed.correo ? { correoInstitucional: seed.correo } : {}),
        estadoRegistro: 'ACTIVO',
      });
      persona = await this.personaRepo.save(persona);
    }
    return persona;
  }

  private async asegurarVehiculo(
    propietarioPersonaId: string,
    placa: string,
    marca: string,
    modelo: string,
    color: string,
    anio: number,
  ): Promise<VehiculoOrmEntity> {
    let v = await this.vehiculoRepo.findOne({ where: { placa } });
    if (!v) {
      v = this.vehiculoRepo.create({
        vehiculoId: uuidv4(),
        propietarioPersonaId,
        placa,
        marca,
        modelo,
        color,
        anio,
        estadoRegistro: 'ACTIVO',
      });
      v = await this.vehiculoRepo.save(v);
    }
    return v;
  }

  private async asegurarMiembroFamiliar(
    personaId: string,
    propietarioId: string,
    relacion: string,
  ): Promise<void> {
    const existe = await this.miembroRepo.findOne({ where: { personaId, propietarioId } });
    if (!existe) {
      const miembro = this.miembroRepo.create({
        id: uuidv4(),
        personaId,
        propietarioId,
        estado: 'ACTIVA',
        relacion,
      });
      await this.miembroRepo.save(miembro);
    }
  }

  private async asegurarPermisoTemporal(data: {
    personaId: string;
    vehiculoId: string;
    propietarioId: string;
    inicio: Date;
    fin: Date;
    motivo: string;
    estado: string;
  }): Promise<PermisoTemporalOrmEntity | null> {
    const existe = await this.permisoRepo.findOne({
      where: {
        personaId: data.personaId,
        vehiculoId: data.vehiculoId,
        propietarioId: data.propietarioId,
        motivo: data.motivo,
      },
    });
    if (existe) return existe;

    const permiso = this.permisoRepo.create({
      id: uuidv4(),
      personaId: data.personaId,
      vehiculoId: data.vehiculoId,
      propietarioId: data.propietarioId,
      tipo: 'TEMPORAL',
      estado: data.estado,
      vigenciaInicio: data.inicio,
      vigenciaFin: data.fin,
      motivo: data.motivo,
    });
    return this.permisoRepo.save(permiso);
  }

  private async asegurarPase(data: {
    vehiculoId: string;
    propietarioId: string;
    placa: string;
    codigoHash: string;
    estado: string;
    inicio: Date;
    fin: Date;
    nombre: string;
    cedula: string;
    motivo: string;
  }): Promise<void> {
    const existe = await this.paseRepo.findOne({
      where: {
        vehiculoId: data.vehiculoId,
        propietarioId: data.propietarioId,
        motivo: data.motivo,
      },
    });
    if (existe) return;

    const pase = this.paseRepo.create({
      id: uuidv4(),
      vehiculoId: data.vehiculoId,
      propietarioId: data.propietarioId,
      placa: data.placa,
      codigoHash: data.codigoHash,
      estado: data.estado,
      vigenciaInicio: data.inicio,
      vigenciaFin: data.fin,
      nombreVisitante: data.nombre,
      cedulaVisitante: data.cedula,
      motivo: data.motivo,
    });
    await this.paseRepo.save(pase);
  }

  private async asegurarEventosAcceso(
    vehiculo1Id: string,
    vehiculo2Id: string,
    propietarioPersonaId: string,
  ): Promise<void> {
    const mgr = this.vehiculoRepo.manager;
    const ahora = new Date();

    const eventos = [
      // Entradas exitosas propietario vehículo 1
      { id: '00000000-0000-4000-a000-000000000001', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'CONDUCTOR_AUTORIZADO',    detalle: 'Acceso por propietario',          origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 3 * 3600000) },
      { id: '00000000-0000-4000-a000-000000000002', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'SALIDA',  dec: 'SUCCESSFUL', motivo: 'CONDUCTOR_AUTORIZADO',    detalle: 'Salida normal',                   origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 2 * 3600000) },
      // Entrada familiar
      { id: '00000000-0000-4000-a000-000000000003', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'CONDUCTOR_AUTORIZADO',    detalle: 'Acceso familiar autorizado',      origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 1 * 3600000) },
      // Vehículo 2 propietario
      { id: '00000000-0000-4000-a000-000000000004', vidId: vehiculo2Id, placa: PLACA_PROPIETARIO_2, tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'CONDUCTOR_AUTORIZADO',    detalle: 'Acceso por propietario vehículo 2', origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 6 * 3600000) },
      { id: '00000000-0000-4000-a000-000000000005', vidId: vehiculo2Id, placa: PLACA_PROPIETARIO_2, tipo: 'SALIDA',  dec: 'SUCCESSFUL', motivo: 'CONDUCTOR_AUTORIZADO',    detalle: 'Salida vehículo 2',                origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 5 * 3600000) },
      // Pase de acceso rápido usado
      { id: '00000000-0000-4000-a000-000000000006', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'PASE_VALIDADO',           detalle: 'Acceso con pase rápido',          origen: 'MANUAL',     ts: new Date(ahora.getTime() - 26 * 3600000) },
      // Denegados
      { id: '00000000-0000-4000-a000-000000000007', vidId: null,        placa: PLACA_CONTINGENCIA,  tipo: 'ENTRADA', dec: 'DENIED',     motivo: 'VEHICULO_NO_REGISTRADO',  detalle: 'Vehículo no registrado en el sistema', origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 4 * 3600000) },
      { id: '00000000-0000-4000-a000-000000000008', vidId: null,        placa: 'XYZ9999',           tipo: 'ENTRADA', dec: 'DENIED',     motivo: 'VEHICULO_NO_REGISTRADO',  detalle: 'Placa desconocida',               origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 7 * 3600000) },
      // Contingencia activa (ENTRADA sin SALIDA posterior) — ABC0912
      { id: '00000000-0000-4000-a000-000000000009', vidId: null,        placa: PLACA_CONTINGENCIA,  tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'CONTINGENCIA',            detalle: 'Acceso por contingencia manual', origen: 'MANUAL',     ts: new Date(ahora.getTime() - 90 * 60000), dur: 60 },
      // Permiso temporal vigente
      { id: '00000000-0000-4000-a000-000000000010', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'ENTRADA', dec: 'SUCCESSFUL', motivo: 'PERMISO_TEMPORAL_VIGENTE', detalle: 'Acceso con permiso temporal',    origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 8 * 3600000) },
      { id: '00000000-0000-4000-a000-000000000011', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'SALIDA',  dec: 'SUCCESSFUL', motivo: 'PERMISO_TEMPORAL_VIGENTE', detalle: 'Salida con permiso temporal',    origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 7 * 3600000) },
      // Verificación pendiente
      { id: '00000000-0000-4000-a000-000000000012', vidId: vehiculo1Id, placa: PLACA_PROPIETARIO,   tipo: 'ENTRADA', dec: 'PENDING_VERIFY', motivo: 'DOCUMENTO_INVALIDO', detalle: 'Documento no pudo ser verificado', origen: 'AUTOMATICA', ts: new Date(ahora.getTime() - 10 * 3600000) },
    ];

    for (const ev of eventos) {
      const existe = await mgr.query(
        `SELECT 1 FROM access_control.eventos_acceso WHERE evento_acceso_id = $1`,
        [ev.id],
      );
      if (existe.length > 0) continue;

      await mgr.query(
        `INSERT INTO access_control.eventos_acceso
          (evento_acceso_id, vehiculo_id, persona_detectada_id, placa_observada,
           tipo_movimiento, decision_operativa, motivo_codigo, motivo_detalle,
           origen_resolucion, capturado_en, resuelto_en, duracion_autorizada_min)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (evento_acceso_id) DO NOTHING`,
        [
          ev.id,
          ev.vidId ?? null,
          propietarioPersonaId,
          ev.placa,
          ev.tipo,
          ev.dec,
          ev.motivo,
          ev.detalle,
          ev.origen,
          ev.ts,
          ev.ts,
          (ev as any).dur ?? null,
        ],
      );
    }
  }

  private async asegurarAlertas(): Promise<void> {
    const mgr = this.vehiculoRepo.manager;
    const ahora = new Date();

    const alertas = [
      { id: '11111111-0000-4000-a000-000000000001', causa: 'ACCESO_DENEGADO',       ref: '00000000-0000-4000-a000-000000000007', sev: 'ALTA',       msg: 'Acceso denegado para placa ABC0912: VEHICULO_NO_REGISTRADO' },
      { id: '11111111-0000-4000-a000-000000000002', causa: 'ACCESO_DENEGADO',       ref: '00000000-0000-4000-a000-000000000008', sev: 'ALTA',       msg: 'Acceso denegado para placa XYZ9999: VEHICULO_NO_REGISTRADO' },
      { id: '11111111-0000-4000-a000-000000000003', causa: 'PERMISO_POR_EXPIRAR',   ref: '33333333-0000-4000-a000-000000000002', sev: 'MEDIA',      msg: 'Permiso temporal próximo a expirar en 2 día(s)' },
      { id: '11111111-0000-4000-a000-000000000004', causa: 'INVITADO_EXCEDIO_TIEMPO', ref: '00000000-0000-4000-a000-000000000009', sev: 'MEDIA',    msg: 'Invitado con placa ABC0912 excedió el tiempo autorizado por 30 minuto(s)' },
      { id: '11111111-0000-4000-a000-000000000005', causa: 'ACCESO_DENEGADO',       ref: '00000000-0000-4000-a000-000000000012', sev: 'ALTA',       msg: 'Acceso denegado para placa PBW1234: DOCUMENTO_INVALIDO' },
    ];

    for (const al of alertas) {
      const existe = await mgr.query(
        `SELECT 1 FROM alerting.alertas WHERE alerta_id = $1`,
        [al.id],
      );
      if (existe.length > 0) continue;

      await mgr.query(
        `INSERT INTO alerting.alertas
          (alerta_id, causa_origen, referencia_origen_id, severidad, estado_atencion, mensaje_resumen, generada_en)
         VALUES ($1,$2,$3,$4,'GENERADA',$5,$6)
         ON CONFLICT (alerta_id) DO NOTHING`,
        [al.id, al.causa, al.ref, al.sev, al.msg, new Date(ahora.getTime() - Math.random() * 3600000)],
      );
    }
  }

  private async asegurarNotificaciones(propietarioPersonaId: string): Promise<void> {
    const mgr = this.vehiculoRepo.manager;

    const notificaciones = [
      { id: '22222222-0000-4000-a000-000000000001', alertaId: '11111111-0000-4000-a000-000000000001', titulo: 'Acceso denegado', contenido: 'Se denegó el acceso al vehículo ABC0912', leida: false },
      { id: '22222222-0000-4000-a000-000000000002', alertaId: '11111111-0000-4000-a000-000000000003', titulo: 'Permiso por expirar', contenido: 'Un permiso temporal vence en 2 días', leida: false },
      { id: '22222222-0000-4000-a000-000000000003', alertaId: '11111111-0000-4000-a000-000000000004', titulo: 'Invitado excedió tiempo', contenido: 'El invitado ABC0912 superó la duración autorizada', leida: true },
      { id: '22222222-0000-4000-a000-000000000004', alertaId: '11111111-0000-4000-a000-000000000002', titulo: 'Acceso denegado', contenido: 'Placa desconocida XYZ9999 intentó acceder', leida: true },
      { id: '22222222-0000-4000-a000-000000000005', alertaId: '11111111-0000-4000-a000-000000000005', titulo: 'Documento inválido', contenido: 'Documento no pudo ser verificado para PBW1234', leida: false },
    ];

    for (const not of notificaciones) {
      const existe = await mgr.query(
        `SELECT 1 FROM alerting.notificaciones WHERE notificacion_id = $1`,
        [not.id],
      );
      if (existe.length > 0) continue;

      await mgr.query(
        `INSERT INTO alerting.notificaciones
          (notificacion_id, alerta_id, destinatario_persona_id, canal, titulo, contenido_resumen, estado_entrega, leida, leida_en, enviada_en)
         VALUES ($1,$2,$3,'DASHBOARD',$4,$5,'ENVIADA',$6,$7,NOW())
         ON CONFLICT (notificacion_id) DO NOTHING`,
        [
          not.id,
          not.alertaId,
          propietarioPersonaId,
          not.titulo,
          not.contenido,
          not.leida,
          not.leida ? new Date() : null,
        ],
      );
    }
  }

  private async asegurarPerfilesBiometricos(
    propietarioPersonaId: string,
    personaFamiliar: PersonaSeed,
    personaSinBiometria: PersonaSeed,
  ): Promise<void> {
    const mgr = this.vehiculoRepo.manager;

    // Perfil completo para propietario
    const prop = await mgr.query(
      `SELECT 1 FROM biometric.perfiles_biometricos WHERE persona_id = $1`,
      [propietarioPersonaId],
    );
    if (prop.length === 0) {
      await mgr.query(
        `INSERT INTO biometric.perfiles_biometricos
          (perfil_biometrico_id, persona_id, estado_disponibilidad)
         VALUES ($1,$2,'DISPONIBLE')
         ON CONFLICT DO NOTHING`,
        [uuidv4(), propietarioPersonaId],
      );
    }

    // Perfil placeholder para el primer familiar
    const familiar = await this.personaRepo.findOne({ where: { identificacionNumero: personaFamiliar.identificacionNumero } });
    if (familiar) {
      const famPerfil = await mgr.query(
        `SELECT 1 FROM biometric.perfiles_biometricos WHERE persona_id = $1`,
        [familiar.personaId],
      );
      if (famPerfil.length === 0) {
        await mgr.query(
          `INSERT INTO biometric.perfiles_biometricos
            (perfil_biometrico_id, persona_id, estado_disponibilidad)
           VALUES ($1,$2,'DISPONIBLE')
           ON CONFLICT DO NOTHING`,
          [uuidv4(), familiar.personaId],
        );
      }
    }

    // Persona sin biometría — NO creamos perfil, queda como PENDIENTE_CAPTURA en la UI
    void personaSinBiometria; // solo existe en personas, no en biometría
  }
}
