"""Endpoint HTTP para lectura de placas — contrato que consume el backend NestJS."""

import numpy as np
import cv2
from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas.placa import LecturaPlacaResponse
from services.ocr_pipeline import leer_placa

router = APIRouter()


@router.post("/leer-placa", response_model=LecturaPlacaResponse)
async def leer_placa_endpoint(imagen: UploadFile = File(...)) -> LecturaPlacaResponse:
    """
    Recibe una imagen (frame de la garita) y devuelve la placa detectada.

    fuente="local"   -> resuelto por el pipeline local (rápido, sin costo)
    fuente="gemini"  -> resuelto por el fallback en la nube (baja confianza local)
    fuente="ninguna" -> no se pudo leer; el backend debe enrutar a Revisión Manual
    """
    contenido = await imagen.read()
    if not contenido:
        raise HTTPException(status_code=400, detail="Archivo de imagen vacío.")

    arreglo = np.frombuffer(contenido, dtype=np.uint8)
    frame_bgr = cv2.imdecode(arreglo, cv2.IMREAD_COLOR)
    if frame_bgr is None:
        raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen.")

    return await leer_placa(frame_bgr)
