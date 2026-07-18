from sqlalchemy.orm import Session

from app.auth.models import User
from app.automations.models import Automation
from app.automation_actions.models import AutomationAction
from app.automation_actions.schemas import (
    AutomationActionCreate,
    AutomationActionUpdate
)


class AutomationActionService:

    @staticmethod
    def create_action(
        db: Session,
        automation_id: int,
        action: AutomationActionCreate,
        owner: User
    ) -> AutomationAction:

        automation = (
            db.query(Automation)
            .join(Automation.workspace)
            .filter(
                Automation.id == automation_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not automation:
            raise ValueError("Automation not found")

        new_action = AutomationAction(
            automation_id=automation.id,
            action_type=action.action_type,
            configuration=action.configuration
        )

        db.add(new_action)
        db.commit()
        db.refresh(new_action)

        return new_action

    @staticmethod
    def get_actions(
        db: Session,
        automation_id: int,
        owner: User
    ):

        automation = (
            db.query(Automation)
            .join(Automation.workspace)
            .filter(
                Automation.id == automation_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not automation:
            raise ValueError("Automation not found")

        return (
            db.query(AutomationAction)
            .filter(
                AutomationAction.automation_id == automation.id
            )
            .all()
        )

    @staticmethod
    def update_action(
        db: Session,
        action_id: int,
        action: AutomationActionUpdate,
        owner: User
    ) -> AutomationAction:

        existing_action = (
            db.query(AutomationAction)
            .join(Automation)
            .filter(
                AutomationAction.id == action_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not existing_action:
            raise ValueError("Action not found")

        if action.action_type is not None:
            existing_action.action_type = action.action_type

        if action.configuration is not None:
            existing_action.configuration = action.configuration

        if action.is_enabled is not None:
            existing_action.is_enabled = action.is_enabled

        db.commit()
        db.refresh(existing_action)

        return existing_action

    @staticmethod
    def delete_action(
        db: Session,
        action_id: int,
        owner: User
    ):

        existing_action = (
            db.query(AutomationAction)
            .join(Automation)
            .filter(
                AutomationAction.id == action_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not existing_action:
            raise ValueError("Action not found")

        db.delete(existing_action)
        db.commit()

        return True