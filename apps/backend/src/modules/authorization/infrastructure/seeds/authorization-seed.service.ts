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
import { EventoAccesoOrmEntity } from '../../../access-control/infrastructure/entities/evento-acceso.orm-entity';
import { AlertaOrmEntity } from '../../../alerting/infrastructure/entities/alerta.orm-entity';
import { NotificacionOrmEntity } from '../../../alerting/infrastructure/entities/notificacion.orm-entity';
import { PerfilBiometricoOrmEntity } from '../../../biometric/infrastructure/entities/perfil-biometrico.orm-entity';

const OWNER_EMAIL = 'propietario@uce.edu.ec';
const ADMIN_EMAIL = 'admin@uce.edu.ec';
const GUARD_EMAIL = 'guardia@uce.edu.ec';

const PLACA_CARLOS = 'PBW1234';
const PLACA_MARIA = 'PBA5678';
const CODIGO_PASE_ACTIVO = 'A7K3M2';
const CODIGO_PASE_CONSUMIDO = 'X9P2Q7';

interface PersonaSeed {
  nombres: string;
  apellidos: string;
  identificacionNumero: string;
  correoInstitucional?: string;
}

/**
 * Seeder de desarrollo — puebla datos realistas para los 3 dashboards
 * (ADMIN, GUARD, OWNER). Alcance ampliado deliberadamente más allá de
 * `authorization` (también toca access-control, alerting y biometric)
 * porque es fixture data de solo-desarrollo, no lógica de negocio en el
 * camino de ejecución real — de ahí que inyecte los ORM entities de esos
 * BCs directamente en vez de pasar por sus contratos/servicios.
 */
@Injectable()
export class AuthorizationSeedService implements OnModuleInit {
  private readonly logger = new Logger(AuthorizationSeedService.name);

  constructor(
    @InjectRepository(MiembroGrupoFamiliarOrmEntity)
    private readonly miembroGrupoFamiliarRepo: Repository<MiembroGrupoFamiliarOrmEntity>,
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
    @InjectRepository(EventoAccesoOrmEntity)
    private readonly eventoAccesoRepo: Repository<EventoAccesoOrmEntity>,
    @InjectRepository(AlertaOrmEntity)
    private readonly alertaRepo: Repository<AlertaOrmEntity>,
    @InjectRepository(NotificacionOrmEntity)
    private readonly notificacionRepo: Repository<NotificacionOrmEntity>,
    @InjectRepository(PerfilBiometricoOrmEntity)
    private readonly perfilBiometricoRepo: Repository<PerfilBiometricoOrmEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      return;
    }

    // Puerta única de idempotencia: si el grupo familiar ya tiene datos,
    // se asume que todo este seeder ya corrió completo — no se duplica nada.
    const existentes = await this.miembroGrupoFamiliarRepo.count();
    if (existentes > 0) {
      return;
    }

    const propietarioUser = await this.userRepo.findOne({ where: { email: OWNER_EMAIL } });
    if (!propietarioUser) {
      // El SeedService de auth aún no ha corrido (orden de módulos) — se omite.
      return;
    }

    const ahora = new Date();
    const horas = (n: number) => new Date(ahora.getTime() + n * 60 * 60 * 1000);
    const dias = (n: number) => new Date(ahora.getTime() + n * 24 * 60 * 60 * 1000);

    // ─── Registry: propietarios y vehículos ──────────────────────────────
    const carlos = await this.asegurarPersonaParaUsuario(propietarioUser, {
      nombres: 'Carlos',
      apellidos: 'Mendoza',
      identificacionNumero: '1712345601',
      correoInstitucional: OWNER_EMAIL,
    });
    const vehiculoCarlos = await this.asegurarVehiculo(carlos.personaId, {
      placa: PLACA_CARLOS,
      marca: 'Chevrolet',
      modelo: 'Aveo',
      color: 'Blanco',
      anio: 2018,
    });

    const maria = await this.asegurarPersona({
      nombres: 'María',
      apellidos: 'López',
      identificacionNumero: '1712345602',
      correoInstitucional: 'mlopez@uce.edu.ec',
    });
    const vehiculoMaria = await this.asegurarVehiculo(maria.personaId, {
      placa: PLACA_MARIA,
      marca: 'Kia',
      modelo: 'Rio',
      color: 'Gris',
      anio: 2020,
    });

    // Personas de admin/guardia — necesarias para que sus notificaciones
    // (filtradas por personaId del JWT) tengan un destinatario resoluble.
    const adminPersona = await this.asegurarPersonaParaUsuarioPorEmail(ADMIN_EMAIL, {
      nombres: 'Administrador',
      apellidos: 'Sistema',
      identificacionNumero: '1712345698',
      correoInstitucional: ADMIN_EMAIL,
    });
    const guardiaPersona = await this.asegurarPersonaParaUsuarioPorEmail(GUARD_EMAIL, {
      nombres: 'Guardia',
      apellidos: 'Turno',
      identificacionNumero: '1712345697',
      correoInstitucional: GUARD_EMAIL,
    });

    // ─── Authorization: grupo familiar ───────────────────────────────────
    const andrea = await this.asegurarPersona({
      nombres: 'Andrea',
      apellidos: 'Torres',
      identificacionNumero: '1712345603',
    });
    const luis = await this.asegurarPersona({
      nombres: 'Luis',
      apellidos: 'Pérez',
      identificacionNumero: '1712345604',
    });
    const roberto = await this.asegurarPersona({
      nombres: 'Roberto',
      apellidos: 'Sánchez',
      identificacionNumero: '1712345605',
    });

    await this.crearMiembroGrupoFamiliar(andrea.personaId, carlos.personaId, 'CONYUGE');
    await this.crearMiembroGrupoFamiliar(luis.personaId, carlos.personaId, 'HIJO');
    await this.crearMiembroGrupoFamiliar(roberto.personaId, maria.personaId, 'HERMANO');

    // ─── Authorization: permisos temporales ───────────────────────────────
    const juanParedes = await this.asegurarPersona({
      nombres: 'Juan',
      apellidos: 'Paredes',
      identificacionNumero: '1712345610',
    });
    const pedroGomez = await this.asegurarPersona({
      nombres: 'Pedro',
      apellidos: 'Gómez',
      identificacionNumero: '1712345611',
    });

    const permisoActivo = this.permisoTemporalRepo.create({
      id: uuidv4(),
      personaId: juanParedes.personaId,
      vehiculoId: vehiculoCarlos.vehiculoId,
      propietarioId: carlos.personaId,
      tipo: 'TEMPORAL',
      estado: 'ACTIVA',
      vigenciaInicio: dias(-7),
      vigenciaFin: dias(7),
      motivo: 'Encargo de conducir el vehículo por motivo laboral',
    });
    await this.permisoTemporalRepo.save(permisoActivo);

    const permisoExpirado = this.permisoTemporalRepo.create({
      id: uuidv4(),
      personaId: pedroGomez.personaId,
      vehiculoId: vehiculoMaria.vehiculoId,
      propietarioId: maria.personaId,
      tipo: 'TEMPORAL',
      estado: 'EXPIRADA',
      vigenciaInicio: dias(-30),
      vigenciaFin: dias(-1),
      motivo: 'Préstamo temporal de vehículo — permiso ya vencido',
    });
    await this.permisoTemporalRepo.save(permisoExpirado);

    // ─── Authorization: pases de acceso rápido ────────────────────────────
    const paseActivo = this.paseAccesoRapidoRepo.create({
      id: uuidv4(),
      vehiculoId: vehiculoCarlos.vehiculoId,
      propietarioId: carlos.personaId,
      placa: vehiculoCarlos.placa,
      codigoHash: await bcrypt.hash(CODIGO_PASE_ACTIVO, 10),
      estado: 'ACTIVO',
      vigenciaInicio: ahora,
      vigenciaFin: horas(24),
      nombreVisitante: 'Ana Ruiz',
      cedulaVisitante: '1712345612',
      motivo: 'Visita autorizada por el propietario',
    });
    await this.paseAccesoRapidoRepo.save(paseActivo);

    // ─── Access Control: eventos ──────────────────────────────────────────
    const eventoManualId = uuidv4();

    await this.eventoAccesoRepo.save(
      this.eventoAccesoRepo.create({
        eventoAccesoId: uuidv4(),
        vehiculoId: vehiculoCarlos.vehiculoId,
        placaObservada: PLACA_CARLOS,
        tipoMovimiento: 'ENTRADA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'PERMISO_TEMPORAL',
        motivoDetalle: 'Ingreso autorizado por permiso temporal vigente',
        origenResolucion: 'AUTOMATICA',
        capturadoEn: horas(-2),
        resueltoEn: horas(-2),
      }),
    );
    await this.eventoAccesoRepo.save(
      this.eventoAccesoRepo.create({
        eventoAccesoId: uuidv4(),
        vehiculoId: vehiculoCarlos.vehiculoId,
        placaObservada: PLACA_CARLOS,
        tipoMovimiento: 'SALIDA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'PERMISO_TEMPORAL',
        motivoDetalle: 'Salida registrada',
        origenResolucion: 'AUTOMATICA',
        capturadoEn: horas(-1),
        resueltoEn: horas(-1),
      }),
    );
    await this.eventoAccesoRepo.save(
      this.eventoAccesoRepo.create({
        eventoAccesoId: uuidv4(),
        vehiculoId: vehiculoMaria.vehiculoId,
        placaObservada: PLACA_MARIA,
        tipoMovimiento: 'ENTRADA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'GRUPO_FAMILIAR',
        motivoDetalle: 'Ingreso autorizado por grupo familiar',
        origenResolucion: 'AUTOMATICA',
        capturadoEn: horas(-4),
        resueltoEn: horas(-4),
      }),
    );
    await this.eventoAccesoRepo.save(
      this.eventoAccesoRepo.create({
        eventoAccesoId: uuidv4(),
        vehiculoId: vehiculoMaria.vehiculoId,
        placaObservada: PLACA_MARIA,
        tipoMovimiento: 'ENTRADA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'PASE_RAPIDO',
        motivoDetalle: 'Ingreso mediante pase de acceso rápido',
        origenResolucion: 'INVITADO',
        capturadoEn: dias(-1),
        resueltoEn: dias(-1),
      }),
    );
    await this.eventoAccesoRepo.save(
      this.eventoAccesoRepo.create({
        eventoAccesoId: eventoManualId,
        vehiculoId: vehiculoCarlos.vehiculoId,
        placaObservada: PLACA_CARLOS,
        tipoMovimiento: 'ENTRADA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'MANUAL',
        motivoDetalle: 'Registro manual por guardia en garita',
        origenResolucion: 'MANUAL',
        capturadoEn: dias(-1),
        resueltoEn: dias(-1),
      }),
    );

    // Segundo pase — consumido, vinculado al evento manual anterior.
    const paseConsumido = this.paseAccesoRapidoRepo.create({
      id: uuidv4(),
      vehiculoId: vehiculoCarlos.vehiculoId,
      propietarioId: carlos.personaId,
      placa: vehiculoCarlos.placa,
      codigoHash: await bcrypt.hash(CODIGO_PASE_CONSUMIDO, 10),
      estado: 'CONSUMIDO',
      vigenciaInicio: dias(-2),
      vigenciaFin: dias(-1),
      nombreVisitante: 'Diego Mora',
      cedulaVisitante: '1712345613',
      motivo: 'Entrega de encomienda',
      fechaConsumo: dias(-1),
      eventoConsumoId: eventoManualId,
    });
    await this.paseAccesoRapidoRepo.save(paseConsumido);

    // ─── Alerting: alertas y notificaciones ────────────────────────────────
    const alertaAccesoDenegado = this.alertaRepo.create({
      alertaId: uuidv4(),
      causaOrigen: 'ACCESO_DENEGADO',
      referenciaOrigenId: uuidv4(),
      severidad: 'ALTA',
      estadoAtencion: 'GENERADA',
      mensajeResumen: 'Vehículo no registrado intentó ingresar',
      generadaEn: horas(-3),
    });
    await this.alertaRepo.save(alertaAccesoDenegado);

    const alertaInvitadoExcedido = this.alertaRepo.create({
      alertaId: uuidv4(),
      causaOrigen: 'INVITADO_EXCEDIO_TIEMPO',
      referenciaOrigenId: permisoActivo.id,
      vehiculoId: vehiculoCarlos.vehiculoId,
      severidad: 'MEDIA',
      estadoAtencion: 'GENERADA',
      mensajeResumen: 'Conductor Juan Paredes excedió 8 horas',
      generadaEn: horas(-1),
    });
    await this.alertaRepo.save(alertaInvitadoExcedido);

    const alertaPermisoPorExpirar = this.alertaRepo.create({
      alertaId: uuidv4(),
      causaOrigen: 'PERMISO_POR_EXPIRAR',
      referenciaOrigenId: permisoActivo.id,
      vehiculoId: vehiculoCarlos.vehiculoId,
      severidad: 'INFORMATIVA',
      estadoAtencion: 'ATENDIDA',
      mensajeResumen: 'Permiso de Carlos expira en 7 días',
      generadaEn: dias(-1),
      atendidaEn: horas(-2),
    });
    await this.alertaRepo.save(alertaPermisoPorExpirar);

    await this.notificacionRepo.save(
      this.notificacionRepo.create({
        notificacionId: uuidv4(),
        alertaId: alertaAccesoDenegado.alertaId,
        destinatarioPersonaId: adminPersona.personaId,
        canal: 'DASHBOARD',
        titulo: 'Acceso denegado detectado',
        estadoEntrega: 'ENVIADA',
        contenidoResumen: alertaAccesoDenegado.mensajeResumen,
        leida: false,
        enviadaEn: horas(-3),
      }),
    );
    await this.notificacionRepo.save(
      this.notificacionRepo.create({
        notificacionId: uuidv4(),
        alertaId: alertaInvitadoExcedido.alertaId,
        destinatarioPersonaId: adminPersona.personaId,
        canal: 'DASHBOARD',
        titulo: 'Invitado excedió tiempo autorizado',
        estadoEntrega: 'ENVIADA',
        contenidoResumen: alertaInvitadoExcedido.mensajeResumen,
        leida: false,
        enviadaEn: horas(-1),
      }),
    );
    await this.notificacionRepo.save(
      this.notificacionRepo.create({
        notificacionId: uuidv4(),
        alertaId: alertaAccesoDenegado.alertaId,
        destinatarioPersonaId: guardiaPersona.personaId,
        canal: 'DASHBOARD',
        titulo: 'Acceso denegado detectado',
        estadoEntrega: 'ENVIADA',
        contenidoResumen: alertaAccesoDenegado.mensajeResumen,
        leida: false,
        enviadaEn: horas(-3),
      }),
    );
    await this.notificacionRepo.save(
      this.notificacionRepo.create({
        notificacionId: uuidv4(),
        alertaId: alertaPermisoPorExpirar.alertaId,
        destinatarioPersonaId: carlos.personaId,
        canal: 'DASHBOARD',
        titulo: 'Permiso próximo a expirar',
        estadoEntrega: 'ENVIADA',
        contenidoResumen: alertaPermisoPorExpirar.mensajeResumen,
        leida: true,
        leidaEn: horas(-1),
        enviadaEn: dias(-1),
      }),
    );

    // ─── Biometric: perfiles ───────────────────────────────────────────────
    await this.perfilBiometricoRepo.save(
      this.perfilBiometricoRepo.create({
        perfilBiometricoId: uuidv4(),
        personaId: carlos.personaId,
        estadoDisponibilidad: 'DISPONIBLE',
        ultimaActualizacionBiometrica: dias(-5),
      }),
    );
    await this.perfilBiometricoRepo.save(
      this.perfilBiometricoRepo.create({
        perfilBiometricoId: uuidv4(),
        personaId: andrea.personaId,
        estadoDisponibilidad: 'PENDIENTE_CAPTURA',
      }),
    );
    await this.perfilBiometricoRepo.save(
      this.perfilBiometricoRepo.create({
        perfilBiometricoId: uuidv4(),
        personaId: luis.personaId,
        estadoDisponibilidad: 'PENDIENTE_CAPTURA',
      }),
    );

    this.logger.log(
      `🌱 Datos de dashboards insertados (development). Pase activo: ${CODIGO_PASE_ACTIVO} · placa ${PLACA_CARLOS}`,
    );
  }

  private async crearMiembroGrupoFamiliar(
    personaId: string,
    propietarioId: string,
    relacion: string,
  ): Promise<void> {
    const miembro = this.miembroGrupoFamiliarRepo.create({
      id: uuidv4(),
      personaId,
      propietarioId,
      estado: 'ACTIVA',
      relacion,
    });
    await this.miembroGrupoFamiliarRepo.save(miembro);
  }

  private async asegurarPersonaParaUsuario(
    user: UserOrmEntity,
    datos: PersonaSeed,
  ): Promise<PersonaOrmEntity> {
    if (user.personaId) {
      const existente = await this.personaRepo.findOne({ where: { personaId: user.personaId } });
      if (existente) return existente;
    }

    const persona = await this.asegurarPersona(datos);
    await this.userRepo.update({ id: user.id }, { personaId: persona.personaId });
    return persona;
  }

  private async asegurarPersonaParaUsuarioPorEmail(
    email: string,
    datos: PersonaSeed,
  ): Promise<PersonaOrmEntity> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      // El usuario aún no existe (orden de módulos) — se crea la persona
      // igual para no bloquear el resto del seeder, pero sin vincular.
      return this.asegurarPersona(datos);
    }
    return this.asegurarPersonaParaUsuario(user, datos);
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
        correoInstitucional: seed.correoInstitucional,
        estadoRegistro: 'ACTIVO',
      });
      persona = await this.personaRepo.save(persona);
    }
    return persona;
  }

  private async asegurarVehiculo(
    propietarioPersonaId: string,
    datos: { placa: string; marca: string; modelo: string; color: string; anio: number },
  ): Promise<VehiculoOrmEntity> {
    let vehiculo = await this.vehiculoRepo.findOne({ where: { placa: datos.placa } });
    if (!vehiculo) {
      vehiculo = this.vehiculoRepo.create({
        vehiculoId: uuidv4(),
        propietarioPersonaId,
        placa: datos.placa,
        marca: datos.marca,
        modelo: datos.modelo,
        color: datos.color,
        anio: datos.anio,
        estadoRegistro: 'ACTIVO',
      });
      vehiculo = await this.vehiculoRepo.save(vehiculo);
    }
    return vehiculo;
  }
}
