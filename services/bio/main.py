from fastapi import FastAPI
from contextlib import asynccontextmanager
from models.face_model import FaceModelSingleton
from routers import embedding, comparison

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the InsightFace model on startup
    print("Loading InsightFace model...")
    FaceModelSingleton.get_instance()
    print("InsightFace model loaded.")
    yield
    # Clean up if needed
    print("Shutting down BIO service...")

app = FastAPI(
    title="VIGIA BIO Service",
    description="Microservicio de validación biométrica facial (Face Embeddings)",
    version="1.0.0",
    lifespan=lifespan
)

# Registramos los routers
app.include_router(embedding.router)
app.include_router(comparison.router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "bio"}
