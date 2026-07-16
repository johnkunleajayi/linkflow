from fastapi import FastAPI

app = FastAPI(
    title="LinkFlow API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to LinkFlow 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }