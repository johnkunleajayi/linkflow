from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.workflows.schemas import WorkflowCreate
from app.workflows.service import WorkflowService


router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"]
)


@router.post("/workspace/{workspace_id}")
def create_workflow(
    workspace_id: int,
    payload: WorkflowCreate,
    db: Session = Depends(get_db)
):

    return WorkflowService.create_workflow(
        db=db,
        workspace_id=workspace_id,
        name=payload.name,
        trigger=payload.trigger,
        action=payload.action,
        trigger_configuration=payload.trigger_configuration,
        action_configuration=payload.action_configuration
    )


@router.get("/workspace/{workspace_id}")
def get_workflows(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    """
    Returns all workflows belonging
    to a workspace.
    """

    return WorkflowService.get_workflows(
        db=db,
        workspace_id=workspace_id
    )