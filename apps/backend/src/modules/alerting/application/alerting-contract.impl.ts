import { Injectable } from '@nestjs/common';
import { IAlertingContract, EmitAlertRequest, EmitAlertResult } from '@shared/interfaces/contracts/alerting.contract';
import { AlertingService } from './alerting.service';
import { AlertChannel, AlertSeverity } from '@shared/enums';
import { SeveridadAlerta } from '../domain/value-objects/severidad-alerta.vo';

function mapSeveridad(severity: AlertSeverity | string): SeveridadAlerta {
  switch (severity) {
    case AlertSeverity.HIGH:
    case AlertSeverity.CRITICAL:
      return SeveridadAlerta.ALTA;
    case AlertSeverity.MEDIUM:
      return SeveridadAlerta.MEDIA;
    default:
      return SeveridadAlerta.INFORMATIVA;
  }
}

@Injectable()
export class AlertingContractImpl implements IAlertingContract {
  constructor(private readonly alertingService: AlertingService) {}

  async emitAlert(request: EmitAlertRequest): Promise<EmitAlertResult> {
    const alerta = await this.alertingService.crearAlertaIdempotente({
      causaOrigen: request.title,
      referenciaOrigenId: request.sourceEntityId ?? 'SYSTEM',
      severidad: mapSeveridad(request.severity),
      mensajeResumen: request.message,
    });

    return {
      alertId: alerta.id,
      emittedAt: alerta.generadaEn,
      channels: [AlertChannel.IN_APP],
    };
  }
}
