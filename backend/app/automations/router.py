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

from app.automations.schemas import (
    AutomationCreate,
    AutomationUpdate,
    AutomationResponse
)

from app.automations.service import AutomationService


router = APIRouter(
    prefix="/automations",
    tags=["Automations"]
)


@router.post(
    "/workspace/{workspace_id}",
    response_model=AutomationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_automation(
    workspace_id: int,
    automation: AutomationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationService.create_automation(
            db=db,
            workspace_id=workspace_id,
            automation=automation,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get(
    "/workspace/{workspace_id}",
    response_model=list[AutomationResponse]
)
def get_automations(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationService.get_automations(
            db=db,
            workspace_id=workspace_id,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put(
    "/{automation_id}",
    response_model=AutomationResponse
)
def update_automation(
    automation_id: int,
    automation: AutomationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return AutomationService.update_automation(
            db=db,
            automation_id=automation_id,
            automation=automation,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{automation_id}"
)
def delete_automation(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        AutomationService.delete_automation(
            db=db,
            automation_id=automation_id,
            owner=current_user
        )

        return {
            "message": "Automation deleted successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )