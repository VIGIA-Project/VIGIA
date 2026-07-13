from pydantic import BaseModel, Field
from typing import List, Optional

class EmbeddingResponse(BaseModel):
    success: bool
    embedding: Optional[List[float]] = None
    quality_score: Optional[float] = None
    face_detected: Optional[bool] = None
    face_count: Optional[int] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error_code: str
    message: str
    recommendation: str
