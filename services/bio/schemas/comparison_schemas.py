from pydantic import BaseModel
from typing import List, Optional

class ReferenceEmbedding(BaseModel):
    persona_id: str
    perfil_biometrico_id: str
    embeddings: List[List[float]]

class ComparisonRequest(BaseModel):
    capture_embedding: List[float]
    reference_embeddings: List[ReferenceEmbedding]
    threshold: float = 0.45

class ComparisonResponse(BaseModel):
    resultado: str
    persona_id: Optional[str]
    perfil_biometrico_id: Optional[str] = None
    score: Optional[float]
    threshold_applied: float
    vectors_evaluated: int
    detail: Optional[str] = None
