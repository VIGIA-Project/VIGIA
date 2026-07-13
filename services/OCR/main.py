"""
VIGIA - Servicio OCR
Punto de entrada de la API FastAPI para el microservicio de OCR.

Arquitectura (Opción C): detector + OCR local (fast-alpr) con fallback a
Gemini Flash cuando la confianza local es baja. Ver README.md.

Estructura:
- models/    -> (fast-alpr descarga/gestiona sus propios modelos ONNX)
- routers/   -> endpoints FastAPI agrupados por recurso
- schemas/   -> esquemas Pydantic de entrada/salida
- services/  -> lógica de negocio (pipeline ALPR local + fallback Gemini)
- utils/     -> utilidades compartidas (validación de formato de placa, etc.)
"""

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

from routers import ocr  # noqa: E402  (después de load_dotenv a propósito)

app = FastAPI(
    title="VIGIA - OCR Service",
    description="Microservicio de reconocimiento óptico de caracteres (placas vehiculares) para VIGIA.",
    version="0.1.0",
)

app.include_router(ocr.router, prefix="/ocr", tags=["ocr"])


@app.get("/health")
async def health_check():
    """Endpoint de salud básico para verificar que el servicio está arriba."""
    return {"status": "ok", "service": "ocr"}
