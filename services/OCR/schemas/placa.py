"""Esquemas Pydantic de entrada/salida para el endpoint de lectura de placas."""

from typing import Literal, Optional
from pydantic import BaseModel, Field


class LecturaPlacaResponse(BaseModel):
    placa: Optional[str] = Field(
        default=None, description="Texto de la placa detectada, normalizado (solo A-Z0-9)."
    )
    confianza: float = Field(description="Confianza del resultado final, entre 0 y 1.")
    fuente: Literal["local", "gemini", "ninguna"] = Field(
        description=(
            "'local' si el pipeline ALPR local fue suficiente, "
            "'gemini' si se usó el fallback en la nube, "
            "'ninguna' si no se pudo leer la placa en absoluto."
        )
    )
    es_formato_valido: bool = Field(
        description="Si el texto obtenido coincide con alguno de los formatos válidos de placa de Ecuador."
    )
