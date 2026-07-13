"""Validación de formato de placas vehiculares de Ecuador."""

import re

# Ver referencia de formatos en el README del servicio:
#   Nuevo:        PPP0000  (desde 2012)
#   Antiguo:      PPP000   (pre-2012)
#   Diplomático:  XX0000
_PATTERNS = [
    re.compile(r"^[A-Z]{3}\d{4}$"),  # Nuevo
    re.compile(r"^[A-Z]{3}\d{3}$"),  # Antiguo
    re.compile(r"^[A-Z]{2}\d{4}$"),  # Diplomático
]


def normalizar_placa(texto: str) -> str:
    """Deja solo letras/dígitos en mayúsculas, sin guiones ni espacios."""
    return re.sub(r"[^A-Z0-9]", "", texto.upper())


def es_placa_ecuador(texto: str) -> bool:
    """True si el texto (ya normalizado o no) coincide con un formato válido de placa de Ecuador."""
    limpio = normalizar_placa(texto)
    return any(patron.match(limpio) for patron in _PATTERNS)
