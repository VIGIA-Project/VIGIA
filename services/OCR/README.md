# VIGIA - Servicio OCR

Microservicio en Python/FastAPI para el reconocimiento óptico de caracteres (OCR) de placas
vehiculares dentro del ecosistema VIGIA. Sigue la misma estructura que `services/bio`.

Estado: en pruebas — rama `feature/ocr`, sin conectar aún al backend principal.

## Arquitectura (Opción C)

```
Cámara → Frame → [fast-alpr: detector YOLO + OCR local] → texto + confianza
                                                              ↓
                                          confianza < OCR_CONFIDENCE_THRESHOLD?
                                                  ↓ sí                ↓ no
                                        [Gemini Flash fallback]   devolver ya
                                                  ↓
                                    [regex de formato Ecuador] → es_formato_valido
                                                  ↓
                    Return: { "placa": "PBW1234", "confianza": 0.94, "fuente": "local" }
```

Si ni el pipeline local ni Gemini logran leer la placa con confianza suficiente,
el backend debe enrutar el caso al flujo de **Revisión Manual** del guardia (ya
existente en el frontend), en vez de bloquear el acceso.

## Estructura

```
services/OCR/
├── main.py            # Entrypoint FastAPI, registra el router /ocr
├── requirements.txt
├── Dockerfile
├── .env.example
├── models/            # (fast-alpr gestiona sus propios modelos ONNX)
├── routers/
│   └── ocr.py          # POST /ocr/leer-placa
├── schemas/
│   └── placa.py        # LecturaPlacaResponse
├── services/
│   ├── ocr_pipeline.py     # Orquesta detector local + fallback Gemini
│   └── gemini_fallback.py  # Llamada a Gemini con timeout duro
└── utils/
    └── validacion.py    # Regex de formatos de placa de Ecuador
```

## Endpoint

`POST /ocr/leer-placa` — recibe `imagen` (multipart/form-data) y devuelve:

```json
{
  "placa": "PBW1234",
  "confianza": 0.94,
  "fuente": "local",
  "es_formato_valido": true
}
```

`fuente` puede ser `"local"`, `"gemini"` o `"ninguna"` (este último caso el backend
debe tratarlo como "enviar a Revisión Manual").

## Desarrollo local

```bash
cd services/OCR
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # y completar GEMINI_API_KEY
uvicorn main:app --reload
```

El servicio expone `GET /health` para verificar que está arriba.

**Nota:** `fast-alpr` es una librería relativamente nueva; los nombres de atributos
que devuelve `alpr.predict(...)` pueden variar según la versión instalada. Si al
probar el endpoint `/ocr/leer-placa` no llega `placa`/`confianza`, revisar
`services/ocr_pipeline.py::_extraer_texto_y_confianza` contra la documentación
del paquete ya instalado (`pip show fast-alpr`) y ajustar los nombres de campo.

## Docker

```bash
cd services/OCR
docker build -t vigia-ocr .
docker run -p 8000:8000 vigia-ocr
```
