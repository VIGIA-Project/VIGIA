from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect-plate")
def detect_plate():
    return {
        "placa": "ABC-1234",
        "confianza": 0.95,
    }
