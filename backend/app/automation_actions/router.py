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

from app.automation_actions.schemas import (
    AutomationActionCreate,
    AutomationActionUpdate,
    AutomationActionResponse
)

from app.automation_actions.service import (
    AutomationActionService
)


router = APIRouter(
    prefix="/automation-actions",
    tags=["Automation Actions"]
)


@router.post(
    "/automation/{automation_id}",
    response_model=AutomationActionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_action(
    automation_id: int,
    action: AutomationActionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationActionService.create_action(
            db=db,
            automation_id=automation_id,
            action=action,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get(
    "/automation/{automation_id}",
    response_model=list[AutomationActionResponse]
)
def get_actions(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationActionService.get_actions(
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
    "/{action_id}",
    response_model=AutomationActionResponse
)
def update_action(
    action_id: int,
    action: AutomationActionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationActionService.update_action(
            db=db,
            action_id=action_id,
            action=action,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{action_id}"
)
def delete_action(
    action_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        AutomationActionService.delete_action(
            db=db,
            action_id=action_id,
            owner=current_user
        )

        return {
            "message": "Action deleted successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )