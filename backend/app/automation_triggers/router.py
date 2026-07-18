from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.auth.dependencies import get_current_user
from app.auth.models import User

from app.automation_triggers.schemas import (
    AutomationTriggerCreate,
    AutomationTriggerUpdate,
    AutomationTriggerResponse
)

from app.automation_triggers.service import (
    AutomationTriggerService
)


router = APIRouter(
    prefix="/automation-triggers",
    tags=["Automation Triggers"]
)


@router.post(
    "/automation/{automation_id}",
    response_model=AutomationTriggerResponse,
    status_code=status.HTTP_201_CREATED
)
def create_trigger(
    automation_id: int,
    trigger: AutomationTriggerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationTriggerService.create_trigger(
            db=db,
            automation_id=automation_id,
            trigger=trigger,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get(
    "/automation/{automation_id}",
    response_model=list[AutomationTriggerResponse]
)
def get_triggers(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationTriggerService.get_triggers(
            db=db,
            automation_id=automation_id,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put(
    "/{trigger_id}",
    response_model=AutomationTriggerResponse
)
def update_trigger(
    trigger_id: int,
    trigger: AutomationTriggerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationTriggerService.update_trigger(
            db=db,
            trigger_id=trigger_id,
            trigger=trigger,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{trigger_id}"
)
def delete_trigger(
    trigger_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        AutomationTriggerService.delete_trigger(
            db=db,
            trigger_id=trigger_id,
            owner=current_user
        )

        return {
            "message": "Trigger deleted successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )