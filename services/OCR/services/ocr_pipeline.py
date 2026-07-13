"""
Pipeline principal de lectura de placas (Opción C).

Flujo:
  frame -> [fast-alpr: detector YOLO + OCR local] -> texto + confianza
        -> si confianza < OCR_CONFIDENCE_THRESHOLD -> [Gemini fallback]
        -> validar formato Ecuador (regex)
        -> devolver { placa, confianza, fuente, es_formato_valido }

El detector+OCR local se carga UNA sola vez (singleton) al arrancar el
proceso, no en cada request, para controlar memoria/latencia en instancias
sin GPU (ver README).

NOTA: fast-alpr es una librería externa relativamente nueva; los nombres de
atributos del resultado (`predict(...)`) pueden variar entre versiones.
Verificar con `pip show fast-alpr` / la documentación del paquete instalado
y ajustar `_extraer_texto_y_confianza` si difiere.
"""

import logging
import os
from functools import lru_cache

import numpy as np

from schemas.placa import LecturaPlacaResponse
from services.gemini_fallback import leer_placa_gemini
from utils.validacion import es_placa_ecuador, normalizar_placa

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _get_alpr():
    """Instancia única (singleton) del pipeline ALPR local."""
    from fast_alpr import ALPR  # import perezoso: evita cargar el modelo si no se usa

    return ALPR(
        detector_model=os.getenv("ALPR_DETECTOR_MODEL", "yolo-v9-t-384-license-plate-end2end"),
        ocr_model=os.getenv("ALPR_OCR_MODEL", "cct-xs-v1-global-model"),
    )


def _a_confianza_escalar(valor) -> float:
    """
    fast-alpr (>=0.4.0) devuelve `ocr.confidence` como una LISTA de
    confianzas, una por cada carácter reconocido de la placa (no un único
    float). Aquí la reducimos a un solo número usando el promedio; si algún
    carácter individual sale muy bajo, considerar usar min(valores) en su
    lugar para ser más estrictos.
    """
    if valor is None:
        return 0.0
    if isinstance(valor, (list, tuple)):
        valores = [float(v) for v in valor if v is not None]
        return sum(valores) / len(valores) if valores else 0.0
    return float(valor)


def _extraer_texto_y_confianza(alpr_results) -> tuple[str | None, float, np.ndarray | None]:
    """
    Toma el primer resultado (mayor confianza de detección) del pipeline local
    y devuelve (texto_placa, confianza, crop_bgr). Ajustar si la versión
    instalada de fast-alpr expone otros nombres de campo.
    """
    if not alpr_results:
        return None, 0.0, None

    mejor = alpr_results[0]
    ocr = getattr(mejor, "ocr", None)
    texto = getattr(ocr, "text", None) if ocr else None
    confianza = _a_confianza_escalar(getattr(ocr, "confidence", None)) if ocr else 0.0
    crop = getattr(mejor, "crop", None) or getattr(mejor, "cropped_image", None)

    return (normalizar_placa(texto) if texto else None), confianza, crop


async def leer_placa(frame_bgr: np.ndarray) -> LecturaPlacaResponse:
    umbral = float(os.getenv("OCR_CONFIDENCE_THRESHOLD", "0.7"))

    alpr = _get_alpr()
    try:
        resultados = alpr.predict(frame_bgr)
    except Exception:
        logger.exception("Fallo el pipeline ALPR local.")
        resultados = []

    texto, confianza, crop = _extraer_texto_y_confianza(resultados)

    if texto and confianza >= umbral:
        return LecturaPlacaResponse(
            placa=texto,
            confianza=confianza,
            fuente="local",
            es_formato_valido=es_placa_ecuador(texto),
        )

    # Confianza local insuficiente (o no se detectó nada) -> intentar Gemini,
    # siempre que tengamos al menos el crop de la placa para enviarle.
    if crop is not None:
        texto_gemini = await leer_placa_gemini(crop)
        if texto_gemini:
            return LecturaPlacaResponse(
                placa=texto_gemini,
                confianza=max(confianza, 0.75),
                fuente="gemini",
                es_formato_valido=es_placa_ecuador(texto_gemini),
            )

    # Ni el pipeline local ni Gemini pudieron leer la placa con confianza
    # suficiente -> el backend debe enrutar esto a Revisión Manual.
    return LecturaPlacaResponse(
        placa=texto,
        confianza=confianza,
        fuente="ninguna" if not texto else "local",
        es_formato_valido=es_placa_ecuador(texto) if texto else False,
    )
