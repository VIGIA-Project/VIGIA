export interface FaceEmbeddingResult {
  embedding: number[];
  calidad: number;
  rostroDetectado: boolean;
  modelo?: string;
}

export interface FaceComparisonResult {
  similitud: number;
  match: boolean;
  threshold: number;
  modelo?: string;
}

export interface IBiometricProvider {
  generarEmbedding(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    personaId?: string;
  }): Promise<FaceEmbeddingResult>;

  compararEmbeddings(params: {
    embeddingA: number[];
    embeddingB: number[];
    threshold?: number;
  }): Promise<FaceComparisonResult>;

  detectarRostro(params: {
    imageBuffer: Buffer;
    mimeType?: string;
  }): Promise<{ rostroDetectado: boolean; calidad: number }>;
}
