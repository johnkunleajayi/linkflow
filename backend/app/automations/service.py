from sqlalchemy.orm import Session

from app.auth.models import User
from app.workspaces.models import Workspace
from app.automations.models import Automation
from app.automations.schemas import (
    AutomationCreate,
    AutomationUpdate
)


class AutomationService:

    @staticmethod
    def create_automation(
        db: Session,
        workspace_id: int,
        automation: AutomationCreate,
        owner: User
    ) -> Automation:

        workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not workspace:
            raise ValueError("Workspace not found")

        new_automation = Automation(
            workspace_id=workspace.id,
            name=automation.name,
            description=automation.description
        )

        db.add(new_automation)
        db.commit()
        db.refresh(new_automation)

        return new_automation

    @staticmethod
    def get_automations(
        db: Session,
        workspace_id: int,
        owner: User
    ):

        workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not workspace:
            raise ValueError("Workspace not found")

        return (
            db.query(Automation)
            .filter(
                Automation.workspace_id == workspace_id
            )
            .all()
        )

    @staticmethod
    def update_automation(
        db: Session,
        automation_id: int,
        automation: AutomationUpdate,
        owner: User
    ) -> Automation:

        existing_automation = (
            db.query(Automation)
            .join(Workspace)
            .filter(
                Automation.id == automation_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_automation:
            raise ValueError("Automation not found")

        if automation.name is not None:
            existing_automation.name = automation.name

        if automation.description is not None:
            existing_automation.description = automation.description

        if automation.status is not None:
            existing_automation.status = automation.status

        db.commit()
        db.refresh(existing_automation)

        return existing_automation

    @staticmethod
    def delete_automation(
        db: Session,
        automation_id: int,
        owner: User
    ):

        existing_automation = (
            db.query(Automation)
            .join(Workspace)
            .filter(
                Automation.id == automation_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_automation:
            raise ValueError("Automation not found")

        db.delete(existing_automation)
        db.commit()

        return True