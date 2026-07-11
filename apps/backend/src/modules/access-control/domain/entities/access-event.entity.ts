// domain/entities/access-event.entity.ts

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA  = 'SALIDA',
}

export enum DecisionOperativa {
  SUCCESSFUL    = 'SUCCESSFUL',
  PENDING_VERIFY = 'PENDING_VERIFY',
  DENIED        = 'DENIED',
}

export enum OrigenResolucion {
  AUTOMATICA   = 'AUTOMATICA',
  MANUAL       = 'MANUAL',
  CONTINGENCIA = 'CONTINGENCIA',
  INVITADO     = 'INVITADO',
  PASE_RAPIDO  = 'PASE_RAPIDO',
}

export enum CausaContingencia {
  BIOMETRIA_NO_DISPONIBLE = 'BIOMETRIA_NO_DISPONIBLE',
  CAMARA_NO_DISPONIBLE    = 'CAMARA_NO_DISPONIBLE',
  OCR_NO_DISPONIBLE       = 'OCR_NO_DISPONIBLE',
  CAIDA_RED               = 'CAIDA_RED',
  OPERACION_MANUAL        = 'OPERACION_MANUAL',
}

export enum MotivoInvitado {
  VISITA_ACADEMICA        = 'VISITA_ACADEMICA',
  TRAMITE_ADMINISTRATIVO  = 'TRAMITE_ADMINISTRATIVO',
  ENTREGA_PROVEEDOR       = 'ENTREGA_PROVEEDOR',
  EMERGENCIA              = 'EMERGENCIA',
  OTRO                    = 'OTRO',
}

export class EventoAcceso {
  constructor(
    public readonly eventoAccesoId: string,
    public readonly placaObservada: string,
    public readonly tipoMovimiento: TipoMovimiento,
    public decisionOperativa: DecisionOperativa,
    public motivoCodigo: string | null,
    public motivoDetalle: string | null,
    public origenResolucion: OrigenResolucion | null,
    public readonly vehiculoId: string | null,
    public readonly personaDetectadaId: string | null,
    public readonly puntoControlId: string | null,
    public readonly carril: string | null,
    public readonly scoreBiometrico: number | null,
    public readonly umbralAplicado: number,
    public evidenciaResumen: string | null,
    public readonly capturadoEn: Date,
    public resueltoEn: Date | null,
  ) {}

  static crear(params: {
    placaObservada: string;
    tipoMovimiento: TipoMovimiento;
    vehiculoId?: string;
    personaDetectadaId?: string;
    puntoControlId?: string;
    carril?: string;
    scoreBiometrico?: number;
    umbralAplicado?: number;
    motivoCodigo?: string;
    evidenciaResumen?: string;
  }): EventoAcceso {
    return new EventoAcceso(
      crypto.randomUUID(),
      params.placaObservada,
      params.tipoMovimiento,
      DecisionOperativa.PENDING_VERIFY,
      params.motivoCodigo ?? null,
      null,
      null,
      params.vehiculoId ?? null,
      params.personaDetectadaId ?? null,
      params.puntoControlId ?? null,
      params.carril ?? null,
      params.scoreBiometrico ?? null,
      params.umbralAplicado ?? 0.75,
      params.evidenciaResumen ?? null,
      new Date(),
      null,
    );
  }

  resolver(decision: DecisionOperativa, motivo: string, origen: OrigenResolucion): void {
    this.decisionOperativa = decision;
    this.motivoDetalle = motivo;
    this.origenResolucion = origen;
    this.resueltoEn = new Date();
  }
}
