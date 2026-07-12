import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IBiometricProvider,
  FaceEmbeddingResult,
  FaceComparisonResult,
} from '@shared/interfaces/contracts/biometric-provider.contract';

/**
 * Adaptador HTTP para el servicio externo de biometría facial.
 * Llama al servicio configurado en BIOMETRIC_SERVICE_URL.
 * Activado cuando USE_AI_STUBS=false.
 */
@Injectable()
export class HttpBiometricProvider implements IBiometricProvider {
  private readonly logger = new Logger(HttpBiometricProvider.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'BIOMETRIC_SERVICE_URL',
      'http://localhost:8002',
    );
    this.timeoutMs = this.configService.get<number>('AI_HTTP_TIMEOUT_MS', 5000);
  }

  async generarEmbedding(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    personaId?: string;
  }): Promise<FaceEmbeddingResult> {
    return this.postImage<FaceEmbeddingResult>('/biometric/embedding', params.imageBuffer, {
      mimeType: params.mimeType,
      personaId: params.personaId,
    });
  }

  async compararEmbeddings(params: {
    embeddingA: number[];
    embeddingB: number[];
    threshold?: number;
  }): Promise<FaceComparisonResult> {
    const url = `${this.baseUrl}/biometric/compare`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeddingA: params.embeddingA,
          embeddingB: params.embeddingB,
          threshold: params.threshold,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Biometric service returned ${response.status}`);
      }

      return response.json() as Promise<FaceComparisonResult>;
    } catch (error) {
      this.logger.error(`Error calling biometric/compare: ${(error as Error).message}`);
      throw new Error(`Biometric service unavailable: ${(error as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
  }

  async detectarRostro(params: {
    imageBuffer: Buffer;
    mimeType?: string;
  }): Promise<{ rostroDetectado: boolean; calidad: number }> {
    return this.postImage('/biometric/detect-face', params.imageBuffer, {
      mimeType: params.mimeType,
    });
  }

  private async postImage<T>(
    path: string,
    imageBuffer: Buffer,
    extra: Record<string, string | undefined>,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: extra['mimeType'] ?? 'image/jpeg' });
      formData.append('image', blob, 'face.jpg');
      if (extra['personaId']) formData.append('personaId', extra['personaId']);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Biometric service returned ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      this.logger.error(`Error calling ${url}: ${(error as Error).message}`);
      throw new Error(`Biometric service unavailable: ${(error as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
