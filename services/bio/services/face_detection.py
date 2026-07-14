from typing import List, Tuple
from schemas.embedding_schemas import ErrorResponse
from utils.constants import (
    NO_FACE_DETECTED,
    MULTIPLE_FACES,
    FACE_OBSTRUCTED,
    LOW_QUALITY,
    MIN_FACE_SCORE
)

def validate_faces(faces: List[any]) -> Tuple[bool, ErrorResponse | None, any]:
    """
    Validates the detected faces based on business rules.
    Returns (is_valid, error_response, best_face)
    """
    if len(faces) == 0:
        return False, ErrorResponse(
            error_code=NO_FACE_DETECTED,
            message="No se detectó ningún rostro en la imagen.",
            recommendation="Asegúrese de que su rostro sea visible y esté bien iluminado."
        ), None
        
    if len(faces) > 1:
        return False, ErrorResponse(
            error_code=MULTIPLE_FACES,
            message="Se detectaron múltiples rostros.",
            recommendation="Asegúrese de ser la única persona en la imagen."
        ), None
        
    face = faces[0]
    
    if face.det_score < MIN_FACE_SCORE:
        return False, ErrorResponse(
            error_code=LOW_QUALITY,
            message="La calidad de la imagen es insuficiente.",
            recommendation="Intente nuevamente con mejor iluminación."
        ), None
        
    # Check landmarks for obstruction
    # Ensure all 5 core landmarks are within a relaxed bounding box
    bbox = face.bbox
    margin_x = (bbox[2] - bbox[0]) * 0.2
    margin_y = (bbox[3] - bbox[1]) * 0.2
    
    for x, y in face.kps:
        if not (bbox[0] - margin_x <= x <= bbox[2] + margin_x and 
                bbox[1] - margin_y <= y <= bbox[3] + margin_y):
            return False, ErrorResponse(
                error_code=FACE_OBSTRUCTED,
                message="El rostro parece estar parcialmente obstruido o fuera de foco.",
                recommendation="Quítese gafas de sol, gorras o mascarillas, y centre su rostro."
            ), None

    return True, None, face
