from fastapi import FastAPI

# Import models so Alembic knows about them
from app.auth.models import User
from app.workspaces.models import Workspace
from app.social_accounts.models import SocialAccount

# Import routers
from app.auth.router import router as auth_router
from app.workspaces.router import router as workspace_router
from app.social_accounts.router import router as social_account_router

app = FastAPI(
    title="LinkFlow API",
    version="1.0.0"
)

# Register routers
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(social_account_router)


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