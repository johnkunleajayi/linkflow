from pydantic import BaseModel

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution.engine import (
    AutomationEngine
)

from app.automation_triggers.service import (
    AutomationTriggerService
)


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


class LinkedInEvent(BaseModel):
    event: str


@router.post("/linkedin")
def linkedin_event(
    payload: LinkedInEvent,
    db: Session = Depends(get_db)
):
    """
    Simulates a LinkedIn event.

    Finds all matching triggers and
    executes their automations.
    """

    triggers = AutomationTriggerService.find_triggers_by_type(
        db=db,
        trigger_type=payload.event
    )

    if not triggers:

        raise HTTPException(
            status_code=404,
            detail="No automation trigger found for this event."
        )


    executions = []


    for trigger in triggers:

        result = AutomationEngine.execute_automation(
            db=db,
            automation_id=trigger.automation_id,
            event_type=payload.event
        )

        executions.append(
            {
                "trigger_id": trigger.id,
                "automation_id": trigger.automation_id,
                "execution": result
            }
        )


    return {
        "message": "Event processed successfully.",
        "event": payload.event,
        "triggers_processed": len(triggers),
        "executions": executions
    }