from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.workflows.schemas import WorkflowCreate
from app.workflows.service import WorkflowService

from app.auth.dependencies import get_current_user
from app.auth.models import User


router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"]
)


@router.post("/workspace/{workspace_id}")
def create_workflow(
    workspace_id: int,
    payload: WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return WorkflowService.create_workflow(
        db=db,
        workspace_id=workspace_id,
        owner=current_user,
        name=payload.name,
        trigger=payload.trigger,
        action=payload.action,
        trigger_configuration=payload.trigger_configuration,
        action_configuration=payload.action_configuration
    )


@router.get("/workspace/{workspace_id}")
def get_workflows(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return WorkflowService.get_workflows(
        db=db,
        workspace_id=workspace_id,
        owner=current_user
    )


@router.put("/{automation_id}")
def update_workflow(
    automation_id: int,
    payload: WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return WorkflowService.update_workflow(
            db=db,
            automation_id=automation_id,
            owner=current_user,
            name=payload.name,
            trigger=payload.trigger,
            action=payload.action,
            trigger_configuration=payload.trigger_configuration,
            action_configuration=payload.action_configuration
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/{automation_id}")
def delete_workflow(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return WorkflowService.delete_workflow(
            db=db,
            automation_id=automation_id,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )