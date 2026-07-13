from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/compare-face")
def compare_face():
    return {
        "match": True,
        "score": 0.92,
    }
