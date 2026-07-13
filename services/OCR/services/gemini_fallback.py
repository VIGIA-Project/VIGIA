"""
Fallback en la nube usando Gemini Flash para lectura de placas cuando el
pipeline local (fast-alpr) devuelve baja confianza.

Importante: esta llamada tiene un timeout duro (GEMINI_TIMEOUT_SECONDS) para
no bloquear la garita si Gemini o la conexión a internet están lentos/caídos.
Si falla o se agota el tiempo, el caller debe tratarlo como "sin lectura" y
dejar que el flujo de Revisión Manual del guardia resuelva el caso.
"""

import asyncio
import io
import logging
import os

import cv2
import google.generativeai as genai
from PIL import Image

from utils.validacion import normalizar_placa

logger = logging.getLogger(__name__)

_PROMPT = (
    "Extract ONLY the license plate text from this cropped plate image. "
    "Return ONLY the alphanumeric characters, no spaces, no dashes, no explanation. "
    "Valid Ecuador formats: 3 letters + 3 or 4 digits (e.g. PBW1234), "
    "or 2 letters + 4 digits for diplomatic plates (e.g. CD0012)."
)

_configurado = False


def _asegurar_configuracion() -> None:
    global _configurado
    if _configurado:
        return
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY no está configurado (ver .env.example).")
    genai.configure(api_key=api_key)
    _configurado = True


def _llamar_gemini_sync(plate_crop_bgr) -> str:
    _asegurar_configuracion()
    modelo = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    pil_image = Image.fromarray(cv2.cvtColor(plate_crop_bgr, cv2.COLOR_BGR2RGB))
    buffer = io.BytesIO()
    pil_image.save(buffer, format="JPEG")
    image_part = {"mime_type": "image/jpeg", "data": buffer.getvalue()}

    response = genai.GenerativeModel(modelo).generate_content([_PROMPT, image_part])
    return (response.text or "").strip()


async def leer_placa_gemini(plate_crop_bgr) -> str | None:
    """
    Envía el crop de la placa a Gemini con un timeout duro.
    Devuelve el texto normalizado, o None si falla/se agota el tiempo.
    """
    timeout = float(os.getenv("GEMINI_TIMEOUT_SECONDS", "1.5"))
    loop = asyncio.get_event_loop()
    try:
        texto = await asyncio.wait_for(
            loop.run_in_executor(None, _llamar_gemini_sync, plate_crop_bgr),
            timeout=timeout,
        )
        return normalizar_placa(texto)
    except asyncio.TimeoutError:
        logger.warning("Gemini fallback: timeout de %.1fs excedido.", timeout)
        return None
    except Exception:
        logger.exception("Gemini fallback: error al leer la placa.")
        return None
