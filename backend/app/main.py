from fastapi import FastAPI

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


app = FastAPI(
    title="LinkFlow API",
    version="1.0.0"
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