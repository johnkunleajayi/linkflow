from sqlalchemy.orm import Session

from app.automations.models import Automation
from app.automation_actions.models import AutomationAction
from app.execution.executor import ActionExecutor


class AutomationEngine:
    """
    Executes an automation by running
    all enabled actions belonging to it.
    """

    @staticmethod
    def execute_automation(
        db: Session,
        automation_id: int
    ):

        automation = (
            db.query(Automation)
            .filter(
                Automation.id == automation_id,
                Automation.status == "ACTIVE"
            )
            .first()
        )

        if automation is None:
            raise ValueError("Automation not found")

        actions = (
            db.query(AutomationAction)
            .filter(
                AutomationAction.automation_id == automation.id,
                AutomationAction.is_enabled == True
            )
            .all()
        )

        results = []

        for action in actions:

            result = ActionExecutor.execute(
                action
            )

            results.append(result)

        return {
            "automation_id": automation.id,
            "automation_name": automation.name,
            "actions_executed": len(actions),
            "results": results
        }