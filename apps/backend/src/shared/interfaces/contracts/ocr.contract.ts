export interface OcrPlateResult {
  placa: string;
  confianza: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rawText?: string;
}

export interface IOcrProvider {
  reconocerPlaca(params: {
    imageBuffer: Buffer;
    mimeType?: string;
    filename?: string;
  }): Promise<OcrPlateResult>;
}
