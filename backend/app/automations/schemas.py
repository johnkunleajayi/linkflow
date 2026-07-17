from datetime import datetime

from pydantic import BaseModel


class AutomationCreate(BaseModel):
    name: str
    description: str | None = None


class AutomationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: str | None = None


class AutomationResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    description: str | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True