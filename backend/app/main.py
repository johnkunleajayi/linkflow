from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import models so Alembic and SQLAlchemy know about them
from app.auth.models import User
from app.workspaces.models import Workspace
from app.social_accounts.models import SocialAccount
from app.automations.models import Automation
from app.automation_triggers.models import AutomationTrigger
from app.automation_actions.models import AutomationAction
from app.execution_logs.models import ExecutionLog
from app.connections.models import Connection


# Import routers
from app.linkedin.router import router as linkedin_router
from app.auth.router import router as auth_router
from app.workspaces.router import router as workspace_router
from app.social_accounts.router import router as social_account_router
from app.automations.router import router as automation_router
from app.automation_triggers.router import (
    router as automation_trigger_router
)
from app.automation_actions.router import (
    router as automation_action_router
)
from app.events.router import (
    router as events_router
)
from app.execution_logs.router import (
    router as execution_log_router
)
from app.connections.router import (
    router as connection_router
)
from app.oauth.router import (
    router as oauth_router
)
from app.workflows.router import (
    router as workflow_router
)


app = FastAPI(
    title="LinkFlow API",
    version="1.0.0"
)


#
# CORS
#

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register routers
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(social_account_router)
app.include_router(automation_router)
app.include_router(automation_trigger_router)
app.include_router(automation_action_router)
app.include_router(events_router)
app.include_router(execution_log_router)
app.include_router(connection_router)
app.include_router(oauth_router)
app.include_router(workflow_router)
app.include_router(linkedin_router)


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