from sqlalchemy.orm import Session

from app.automations.models import Automation
from app.automation_triggers.models import AutomationTrigger
from app.automation_actions.models import AutomationAction


class WorkflowService:
    """
    Handles workflow creation.

    A workflow creates:
    - Automation
    - Automation Trigger
    - Automation Action
    """

    @staticmethod
    def create_workflow(
        db: Session,
        workspace_id: int,
        name: str,
        trigger: str,
        action: str,
        action_configuration: dict | None = None,
        trigger_configuration: dict | None = None
    ):

        automation = Automation(
            workspace_id=workspace_id,
            name=name,
            status="ACTIVE"
        )

        db.add(automation)
        db.commit()
        db.refresh(automation)

        automation_trigger = AutomationTrigger(
            automation_id=automation.id,
            trigger_type=trigger,
            configuration=trigger_configuration or {}
        )

        db.add(automation_trigger)

        automation_action = AutomationAction(
            automation_id=automation.id,
            action_type=action,
            configuration=action_configuration or {}
        )

        db.add(automation_action)

        db.commit()

        return {
            "automation_id": automation.id,
            "name": automation.name,
            "trigger": trigger,
            "action": action,
            "trigger_configuration": automation_trigger.configuration,
            "action_configuration": automation_action.configuration,
            "status": automation.status
        }

    @staticmethod
    def get_workflows(
        db: Session,
        workspace_id: int
    ):
        """
        Returns only complete workflows
        belonging to a workspace.

        A complete workflow consists of:
        - Automation
        - Trigger
        - Action
        """

        automations = (
            db.query(Automation)
            .filter(
                Automation.workspace_id == workspace_id
            )
            .order_by(Automation.id.desc())
            .all()
        )

        workflows = []

        for automation in automations:

            trigger = (
                db.query(AutomationTrigger)
                .filter(
                    AutomationTrigger.automation_id == automation.id
                )
                .first()
            )

            action = (
                db.query(AutomationAction)
                .filter(
                    AutomationAction.automation_id == automation.id
                )
                .first()
            )

            #
            # Ignore incomplete workflows.
            #
            if trigger is None or action is None:
                continue

            workflows.append(
                {
                    "automation_id": automation.id,
                    "name": automation.name,
                    "status": automation.status,
                    "trigger": trigger.trigger_type,
                    "action": action.action_type,
                    "trigger_configuration": trigger.configuration,
                    "action_configuration": action.configuration
                }
            )

        return workflows

    @staticmethod
    def update_workflow(
        db: Session,
        automation_id: int,
        name: str,
        trigger: str,
        action: str,
        action_configuration: dict | None = None,
        trigger_configuration: dict | None = None
    ):
        """
        Updates an existing workflow.

        Updates:
        - Automation
        - Trigger
        - Action
        """

        automation = (
            db.query(Automation)
            .filter(
                Automation.id == automation_id
            )
            .first()
        )

        if automation is None:
            raise ValueError("Workflow not found")

        automation.name = name

        trigger_record = (
            db.query(AutomationTrigger)
            .filter(
                AutomationTrigger.automation_id == automation_id
            )
            .first()
        )

        if trigger_record is None:
            raise ValueError("Workflow trigger not found")

        trigger_record.trigger_type = trigger
        trigger_record.configuration = (
            trigger_configuration or {}
        )

        action_record = (
            db.query(AutomationAction)
            .filter(
                AutomationAction.automation_id == automation_id
            )
            .first()
        )

        if action_record is None:
            raise ValueError("Workflow action not found")

        action_record.action_type = action
        action_record.configuration = (
            action_configuration or {}
        )

        db.commit()

        return {
            "automation_id": automation.id,
            "name": automation.name,
            "trigger": trigger_record.trigger_type,
            "action": action_record.action_type,
            "trigger_configuration": trigger_record.configuration,
            "action_configuration": action_record.configuration,
            "status": automation.status
        }

    @staticmethod
    def delete_workflow(
        db: Session,
        automation_id: int
    ):
        """
        Deletes an entire workflow,
        including its triggers,
        actions and automation.
        """

        automation = (
            db.query(Automation)
            .filter(
                Automation.id == automation_id
            )
            .first()
        )

        if automation is None:
            raise ValueError("Workflow not found")

        (
            db.query(AutomationTrigger)
            .filter(
                AutomationTrigger.automation_id == automation_id
            )
            .delete()
        )

        (
            db.query(AutomationAction)
            .filter(
                AutomationAction.automation_id == automation_id
            )
            .delete()
        )

        db.delete(automation)

        db.commit()

        return {
            "message": "Workflow deleted successfully."
        }