from sqlalchemy.orm import Session

from app.auth.models import User
from app.automations.models import Automation
from app.automation_triggers.models import AutomationTrigger
from app.automation_triggers.schemas import (
    AutomationTriggerCreate,
    AutomationTriggerUpdate
)


class AutomationTriggerService:

    @staticmethod
    def create_trigger(
        db: Session,
        automation_id: int,
        trigger: AutomationTriggerCreate,
        owner: User
    ) -> AutomationTrigger:

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

        new_trigger = AutomationTrigger(
            automation_id=automation.id,
            trigger_type=trigger.trigger_type,
            configuration=trigger.configuration
        )

        db.add(new_trigger)
        db.commit()
        db.refresh(new_trigger)

        return new_trigger

    @staticmethod
    def get_triggers(
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
            db.query(AutomationTrigger)
            .filter(
                AutomationTrigger.automation_id == automation_id
            )
            .all()
        )

    @staticmethod
    def update_trigger(
        db: Session,
        trigger_id: int,
        trigger: AutomationTriggerUpdate,
        owner: User
    ) -> AutomationTrigger:

        existing_trigger = (
            db.query(AutomationTrigger)
            .join(Automation)
            .join(Automation.workspace)
            .filter(
                AutomationTrigger.id == trigger_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not existing_trigger:
            raise ValueError("Trigger not found")

        if trigger.trigger_type is not None:
            existing_trigger.trigger_type = trigger.trigger_type

        if trigger.configuration is not None:
            existing_trigger.configuration = trigger.configuration

        if trigger.is_enabled is not None:
            existing_trigger.is_enabled = trigger.is_enabled

        db.commit()
        db.refresh(existing_trigger)

        return existing_trigger

    @staticmethod
    def delete_trigger(
        db: Session,
        trigger_id: int,
        owner: User
    ):

        existing_trigger = (
            db.query(AutomationTrigger)
            .join(Automation)
            .join(Automation.workspace)
            .filter(
                AutomationTrigger.id == trigger_id,
                Automation.workspace.has(owner_id=owner.id)
            )
            .first()
        )

        if not existing_trigger:
            raise ValueError("Trigger not found")

        db.delete(existing_trigger)
        db.commit()

        return True

    @staticmethod
    def find_trigger_by_type(
        db: Session,
        trigger_type: str
    ) -> AutomationTrigger | None:
        """
        Finds the first enabled trigger matching
        an incoming event.
        """

        return (
            db.query(AutomationTrigger)
            .join(Automation)
            .filter(
                AutomationTrigger.trigger_type == trigger_type,
                AutomationTrigger.is_enabled == True,
                Automation.status == "ACTIVE"
            )
            .first()
        )