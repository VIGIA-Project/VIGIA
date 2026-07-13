# VIGIA - Servicio OCR

Microservicio en Python/FastAPI para el reconocimiento óptico de caracteres (OCR) de placas
vehiculares dentro del ecosistema VIGIA. Sigue la misma estructura que `services/bio`.

Estado: en pruebas — rama `feature/ocr`, sin conectar aún al backend principal.

## Estructura

```
services/OCR/
├── main.py            # Entrypoint FastAPI
├── requirements.txt
├── Dockerfile
├── .env.example
├── models/            # Carga/definición de modelos OCR
├── routers/           # Endpoints agrupados por recurso
├── schemas/           # Esquemas Pydantic de entrada/salida
├── services/          # Lógica de negocio / integración con el motor OCR
└── utils/             # Utilidades compartidas (preprocesamiento, etc.)
```

## Desarrollo local

```bash
cd services/OCR
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

El servicio expone `GET /health` para verificar que está arriba.

## Docker

```bash
cd services/OCR
docker build -t vigia-ocr .
docker run -p 8000:8000 vigia-ocr
```
