from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AutomationActionCreate(BaseModel):
    action_type: str
    configuration: dict[str, Any] | None = None


class AutomationActionUpdate(BaseModel):
    action_type: str | None = None
    configuration: dict[str, Any] | None = None
    is_enabled: bool | None = None


class AutomationActionResponse(BaseModel):
    id: int
    automation_id: int
    action_type: str
    configuration: dict[str, Any] | None
    is_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True