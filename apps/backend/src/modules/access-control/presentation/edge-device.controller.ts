import { Controller, Post, UseInterceptors, UploadedFiles, Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AccessControlService } from '../application/access-control.service';
import { TipoMovimiento } from '../domain/value-objects/tipo-movimiento.vo';

@Controller('v1/access-control/edge')
export class EdgeDeviceController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('reconocimiento')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fotoPlaca', maxCount: 1 },
      { name: 'fotoRostro', maxCount: 1 },
    ]),
  )
  async reconocimiento(
    @UploadedFiles() files: { fotoPlaca?: any[]; fotoRostro?: any[] },
    @Body('tipoMovimiento') tipoMovimiento: string,
    @Body('placaManual') placaManual?: string,
  ) {
    const fotoRostroBuffer = files.fotoRostro?.[0]?.buffer;
    const fotoPlacaBuffer = files.fotoPlaca?.[0]?.buffer;

    if (!fotoRostroBuffer) {
      return { success: false, message: 'La foto del rostro es obligatoria para la biometría' };
    }

    const tMov = tipoMovimiento === 'ENTRADA' ? TipoMovimiento.ENTRADA : TipoMovimiento.SALIDA;

    const evento = await this.accessControlService.procesarAccesoEdge(
      fotoRostroBuffer,
      tMov,
      fotoPlacaBuffer,
      placaManual,
    );

    return {
      success: true,
      data: {
        eventoId: evento.id,
        decision: evento.decisionOperativa,
        motivo: evento.motivoDetalle,
        placa: evento.placaObservada,
      },
    };
  }
}
