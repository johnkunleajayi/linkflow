from sqlalchemy.orm import Session

from app.automations.models import Automation
from app.automation_actions.models import AutomationAction

from app.execution.executor import ActionExecutor
from app.execution_logs.service import ExecutionLogService
from app.conditions.engine import ConditionEngine


class AutomationEngine:
    """
    Executes an automation by running
    all enabled actions belonging to it.
    """

    @staticmethod
    def execute_automation(
        db: Session,
        automation_id: int,
        event_type: str = "UNKNOWN_EVENT",
        payload: dict | None = None
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

        #
        # Evaluate workflow conditions.
        # Version 1 always returns True.
        #

        should_continue = ConditionEngine.evaluate(
            conditions=None,
            payload=payload
        )

        if not should_continue:

            execution_result = {
                "automation_id": automation.id,
                "automation_name": automation.name,
                "actions_executed": 0,
                "results": [],
                "message": (
                    "Workflow skipped because "
                    "its conditions were not met."
                )
            }

            ExecutionLogService.create_log(
                db=db,
                automation_id=automation.id,
                event_type=event_type,
                status="SKIPPED",
                result=execution_result
            )

            return execution_result

        actions = (
            db.query(AutomationAction)
            .filter(
                AutomationAction.automation_id == automation.id,
                AutomationAction.is_enabled == True
            )
            .all()
        )

        results = []

        execution_status = "SUCCESS"

        for action in actions:

            result = ActionExecutor.execute(
                db=db,
                action=action
            )

            results.append(result)

            if not result.get("success", False):
                execution_status = "FAILED"

        execution_result = {
            "automation_id": automation.id,
            "automation_name": automation.name,
            "actions_executed": len(actions),
            "results": results
        }

        ExecutionLogService.create_log(
            db=db,
            automation_id=automation.id,
            event_type=event_type,
            status=execution_status,
            result=execution_result
        )

        return execution_result