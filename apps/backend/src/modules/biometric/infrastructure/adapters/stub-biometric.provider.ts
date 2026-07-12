import { Injectable } from '@nestjs/common';
import {
  IBiometricProvider,
  FaceEmbeddingResult,
  FaceComparisonResult,
} from '@shared/interfaces/contracts/biometric-provider.contract';

const STUB_EMBEDDING_SIZE = 128;
const STUB_MODEL = 'stub-v1';

/**
 * Adaptador stub para biometría facial.
 * Genera embeddings determinísticos para desarrollo; no depende de servicios externos.
 * Activado cuando USE_AI_STUBS=true.
 */
@Injectable()
export class StubBiometricProvider implements IBiometricProvider {
  async generarEmbedding(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    personaId?: string;
  }): Promise<FaceEmbeddingResult> {
    // Embedding determinístico basado en los primeros bytes del buffer + personaId
    const seed = params.personaId
      ? Buffer.from(params.personaId).readUInt8(0)
      : params.imageBuffer.length % 256;

    const embedding = Array.from({ length: STUB_EMBEDDING_SIZE }, (_, i) =>
      Math.sin((i + seed) * 0.1),
    );

    return {
      embedding,
      calidad: 0.92,
      rostroDetectado: true,
      modelo: STUB_MODEL,
    };
  }

  async compararEmbeddings(params: {
    embeddingA: number[];
    embeddingB: number[];
    threshold?: number;
  }): Promise<FaceComparisonResult> {
    const threshold = params.threshold ?? 0.6;

    // Similitud coseno simplificada entre los dos embeddings
    const dotProduct = params.embeddingA.reduce(
      (acc, a, i) => acc + a * (params.embeddingB[i] ?? 0),
      0,
    );
    const magnA = Math.sqrt(params.embeddingA.reduce((acc, a) => acc + a * a, 0));
    const magnB = Math.sqrt(params.embeddingB.reduce((acc, b) => acc + b * b, 0));
    const similitud = magnA > 0 && magnB > 0 ? dotProduct / (magnA * magnB) : 0;

    return {
      similitud: Math.max(0, Math.min(1, (similitud + 1) / 2)), // normalizar a [0, 1]
      match: similitud >= threshold,
      threshold,
      modelo: STUB_MODEL,
    };
  }

  async detectarRostro(params: {
    imageBuffer: Buffer;
    mimeType?: string;
  }): Promise<{ rostroDetectado: boolean; calidad: number }> {
    // Stub: siempre detecta rostro si el buffer tiene contenido
    return {
      rostroDetectado: params.imageBuffer.length > 0,
      calidad: 0.9,
    };
  }
}
