import numpy as np
from fastapi import UploadFile
from utils.image_utils import read_image_file
from models.face_model import FaceModelSingleton
from services.face_detection import validate_faces
from schemas.embedding_schemas import EmbeddingResponse
from typing import Union
from fastapi.responses import JSONResponse

async def process_embedding(image: UploadFile, tipo_captura: str) -> Union[EmbeddingResponse, JSONResponse]:
    # 1. Read and validate image
    try:
        img_array = await read_image_file(image)
    except Exception as e:
        # Re-raise HTTPExceptions directly, or wrap others
        raise e

    # 2. Get InsightFace model instance
    app_face = FaceModelSingleton.get_instance()
    
    # 3. Detect faces
    faces = app_face.get(img_array)
    
    # 4. Validate business rules
    is_valid, error_response, best_face = validate_faces(faces)
    
    if not is_valid:
        return JSONResponse(status_code=400, content=error_response.model_dump())
        
    # 5. Extract and normalize embedding
    # InsightFace embedding is already normalized, but we can ensure it's a list of floats
    embedding_list = [float(x) for x in best_face.embedding]
    quality_score = float(best_face.det_score)
    
    return EmbeddingResponse(
        success=True,
        embedding=embedding_list,
        quality_score=quality_score,
        face_detected=True,
        face_count=len(faces)
    )
