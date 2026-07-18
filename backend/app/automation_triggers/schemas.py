from datetime import datetime

from pydantic import BaseModel


class AutomationTriggerCreate(BaseModel):
    trigger_type: str
    configuration: dict | None = None


class AutomationTriggerUpdate(BaseModel):
    trigger_type: str | None = None
    configuration: dict | None = None
    is_enabled: bool | None = None


class AutomationTriggerResponse(BaseModel):
    id: int
    automation_id: int
    trigger_type: str
    configuration: dict | None = None
    is_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True