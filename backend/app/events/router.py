from pydantic import BaseModel

from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution.engine import (
    AutomationEngine
)


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


class LinkedInEvent(BaseModel):
    event: str
    automation_id: int


@router.post("/linkedin")
def linkedin_event(
    payload: LinkedInEvent,
    db: Session = Depends(get_db)
):
    """
    Simulates a LinkedIn event.

    MVP:
    Execute the requested automation.
    """

    result = AutomationEngine.execute_automation(
        db=db,
        automation_id=payload.automation_id
    )

    return {
        "message": "Event processed successfully.",
        "event": payload.event,
        "execution": result
    }