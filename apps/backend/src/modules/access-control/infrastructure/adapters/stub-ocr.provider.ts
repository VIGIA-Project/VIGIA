import { Injectable } from '@nestjs/common';
import { IOcrProvider, OcrPlateResult } from '@shared/interfaces/contracts/ocr.contract';

/**
 * Adaptador stub para OCR de placas.
 * Retorna una placa determinística para desarrollo; no depende de servicios externos.
 * Activado cuando USE_AI_STUBS=true.
 */
@Injectable()
export class StubOcrProvider implements IOcrProvider {
  async reconocerPlaca(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    filename?: string;
  }): Promise<OcrPlateResult> {
    // Intenta extraer la placa del nombre del archivo si se incluye un patrón conocido
    const placaDesdeNombre = params.filename
      ? this.extraerPlacaDeNombre(params.filename)
      : null;

    return {
      placa: placaDesdeNombre ?? 'PBW1234',
      confianza: 0.95,
      rawText: placaDesdeNombre ?? 'PBW1234',
    };
  }

  private extraerPlacaDeNombre(filename: string): string | null {
    const match = filename.toUpperCase().match(/[A-Z]{2,3}[0-9]{3,4}/);
    return match ? match[0] : null;
  }
}
