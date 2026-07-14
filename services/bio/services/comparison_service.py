import numpy as np
from typing import List
from schemas.comparison_schemas import ComparisonRequest, ComparisonResponse
from utils.constants import MATCH_RESULT, NO_MATCH_RESULT

def cosine_similarity(a: List[float], b: List[float]) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def compare_embeddings(request: ComparisonRequest) -> ComparisonResponse:
    if not request.reference_embeddings:
        return ComparisonResponse(
            resultado=NO_MATCH_RESULT,
            persona_id=None,
            score=None,
            threshold_applied=request.threshold,
            vectors_evaluated=0,
            detail="Sin soporte biométrico suficiente para comparar"
        )

    best_score = -1.0
    best_persona_id = None
    best_perfil_id = None
    vectors_evaluated = 0

    capture_np = np.array(request.capture_embedding)

    for ref in request.reference_embeddings:
        for ref_emb in ref.embeddings:
            vectors_evaluated += 1
            ref_np = np.array(ref_emb)
            score = cosine_similarity(capture_np, ref_np)
            if score > best_score:
                best_score = score
                best_persona_id = ref.persona_id
                best_perfil_id = ref.perfil_biometrico_id

    if best_score >= request.threshold:
        return ComparisonResponse(
            resultado=MATCH_RESULT,
            persona_id=best_persona_id,
            perfil_biometrico_id=best_perfil_id,
            score=best_score,
            threshold_applied=request.threshold,
            vectors_evaluated=vectors_evaluated
        )
    else:
        return ComparisonResponse(
            resultado=NO_MATCH_RESULT,
            persona_id=None,
            score=best_score,
            threshold_applied=request.threshold,
            vectors_evaluated=vectors_evaluated,
            detail="Ningún embedding superó el umbral de confianza"
        )
