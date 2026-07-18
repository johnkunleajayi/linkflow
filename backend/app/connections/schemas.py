from datetime import datetime

from pydantic import BaseModel


class ConnectionBase(BaseModel):

    provider: str

    name: str

    credentials: dict | None = None



class ConnectionCreate(ConnectionBase):
    pass



class ConnectionUpdate(BaseModel):

    name: str | None = None

    credentials: dict | None = None

    is_active: str | None = None



class ConnectionResponse(ConnectionBase):

    id: int

    workspace_id: int

    is_active: str

    created_at: datetime


    class Config:
        from_attributes = True