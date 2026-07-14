from fastapi import APIRouter
from schemas.comparison_schemas import ComparisonRequest, ComparisonResponse
from services.comparison_service import compare_embeddings

router = APIRouter(prefix="/api/bio", tags=["bio"])

@router.post("/compare", response_model=ComparisonResponse)
async def compare_face(request: ComparisonRequest):
    """
    Compara un embedding capturado contra un conjunto de embeddings de referencia.
    Retorna el mejor match si supera el umbral, o NO_MATCH / INCONCLUSIVE en caso contrario.
    """
    return compare_embeddings(request)
