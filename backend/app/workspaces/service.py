from sqlalchemy.orm import Session

from app.workspaces.models import Workspace
from app.workspaces.schemas import (
    WorkspaceCreate,
    WorkspaceUpdate
)
from app.auth.models import User


class WorkspaceService:

    @staticmethod
    def create_workspace(
        db: Session,
        workspace: WorkspaceCreate,
        owner: User
    ) -> Workspace:

        new_workspace = Workspace(
            name=workspace.name,
            owner_id=owner.id
        )

        db.add(new_workspace)
        db.commit()
        db.refresh(new_workspace)

        return new_workspace

    @staticmethod
    def get_workspaces(
        db: Session,
        owner: User
    ):

        return (
            db.query(Workspace)
            .filter(Workspace.owner_id == owner.id)
            .all()
        )

    @staticmethod
    def rename_workspace(
        db: Session,
        workspace_id: int,
        workspace: WorkspaceUpdate,
        owner: User
    ) -> Workspace:

        existing_workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_workspace:
            raise ValueError("Workspace not found")

        existing_workspace.name = workspace.name

        db.commit()
        db.refresh(existing_workspace)

        return existing_workspace