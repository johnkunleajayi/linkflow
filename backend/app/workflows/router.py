from fastapi import (
    APIRouter,
    Depends,
    HTTPException
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


@router.delete("/{automation_id}")
def delete_workflow(
    automation_id: int,
    db: Session = Depends(get_db)
):
    """
    Deletes a complete workflow.

    This removes:
    - Automation
    - Trigger(s)
    - Action(s)
    """

    try:

        return WorkflowService.delete_workflow(
            db=db,
            automation_id=automation_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )