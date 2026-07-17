from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SocialAccountCreate(BaseModel):
    workspace_id: int
    platform: str
    account_name: str
    account_identifier: str


class SocialAccountUpdate(BaseModel):
    account_name: str


class SocialAccountResponse(BaseModel):
    id: int
    workspace_id: int
    platform: str
    account_name: str
    account_identifier: str
    is_connected: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )