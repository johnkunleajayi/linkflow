from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.auth.dependencies import get_current_user
from app.auth.models import User

from app.workspaces.schemas import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse
)

from app.workspaces.service import WorkspaceService


router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"]
)


@router.post(
    "",
    response_model=WorkspaceResponse,
    status_code=201
)
def create_workspace(
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return WorkspaceService.create_workspace(
        db=db,
        workspace=workspace,
        owner=current_user
    )


@router.get(
    "",
    response_model=list[WorkspaceResponse]
)
def get_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return WorkspaceService.get_workspaces(
        db=db,
        owner=current_user
    )


@router.put(
    "/{workspace_id}",
    response_model=WorkspaceResponse
)
def rename_workspace(
    workspace_id: int,
    workspace: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return WorkspaceService.rename_workspace(
            db=db,
            workspace_id=workspace_id,
            workspace=workspace,
            owner=current_user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )