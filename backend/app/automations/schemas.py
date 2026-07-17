from datetime import datetime

from pydantic import BaseModel


class AutomationCreate(BaseModel):
    name: str
    trigger_type: str
    action_type: str


class AutomationUpdate(BaseModel):
    name: str | None = None
    trigger_type: str | None = None
    action_type: str | None = None
    status: str | None = None


class AutomationResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    trigger_type: str
    action_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True