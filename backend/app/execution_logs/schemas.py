from datetime import datetime

from pydantic import BaseModel


class ExecutionLogResponse(BaseModel):
    id: int
    automation_id: int
    event_type: str
    status: str
    result: dict | None
    executed_at: datetime

    class Config:
        from_attributes = True