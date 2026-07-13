"""
VIGIA - Servicio OCR
Punto de entrada de la API FastAPI para el microservicio de OCR.

Estructura pensada para ser rellenada (mismo patrón que services/bio):
- models/    -> modelos de datos / carga de modelos OCR
- routers/   -> endpoints FastAPI agrupados por recurso
- schemas/   -> esquemas Pydantic de entrada/salida
- services/  -> lógica de negocio / integración con el motor OCR
- utils/     -> utilidades compartidas (preprocesamiento de imágenes, etc.)
"""

from fastapi import FastAPI

app = FastAPI(
    title="VIGIA - OCR Service",
    description="Microservicio de reconocimiento óptico de caracteres (placas vehiculares) para VIGIA.",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    """Endpoint de salud básico para verificar que el servicio está arriba."""
    return {"status": "ok", "service": "ocr"}


# TODO: registrar routers reales una vez definidos, por ejemplo:
# from routers import ocr_router
# app.include_router(ocr_router.router, prefix="/ocr", tags=["ocr"])
