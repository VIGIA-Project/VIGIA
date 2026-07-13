from fastapi import APIRouter, File, Form, UploadFile
from services.embedding_service import process_embedding

router = APIRouter(prefix="/api/bio", tags=["bio"])

@router.post("/generate-embedding")
async def generate_embedding(
    image: UploadFile = File(...),
    tipo_captura: str = Form(...)
):
    """
    Genera un embedding a partir de una imagen facial.
    Realiza validaciones biométricas de unicidad, obstrucción y calidad.
    """
    return await process_embedding(image, tipo_captura)
