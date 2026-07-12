import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOcrProvider, OcrPlateResult } from '@shared/interfaces/contracts/ocr.contract';

/**
 * Adaptador HTTP para OCR de placas.
 * Llama al servicio externo configurado en OCR_SERVICE_URL.
 * Activado cuando USE_AI_STUBS=false.
 */
@Injectable()
export class HttpOcrProvider implements IOcrProvider {
  private readonly logger = new Logger(HttpOcrProvider.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OCR_SERVICE_URL', 'http://localhost:8001');
    this.timeoutMs = this.configService.get<number>('AI_HTTP_TIMEOUT_MS', 5000);
  }

  async reconocerPlaca(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    filename?: string;
  }): Promise<OcrPlateResult> {
    const url = `${this.baseUrl}/ocr/plate`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(params.imageBuffer)], { type: params.mimeType ?? 'image/jpeg' });
      formData.append('image', blob, params.filename ?? 'plate.jpg');

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OCR service returned ${response.status}`);
      }

      const data = await response.json() as OcrPlateResult;
      return data;
    } catch (error) {
      this.logger.error(`Error calling OCR service at ${url}: ${(error as Error).message}`);
      throw new Error(`OCR service unavailable: ${(error as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
