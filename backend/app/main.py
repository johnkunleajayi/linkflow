from fastapi import FastAPI

from app.database.database import Base, engine
from app.auth.models import User

# Create database tables
Base.metadata.create_all(bind=engine)

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