from sqlalchemy.orm import Session

from app.automations.models import Automation
from app.automation_actions.models import AutomationAction
from app.automation_triggers.models import AutomationTrigger

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
        payload: dict | None = None,
        event_payload: dict | None = None
    ):

        if payload is None:
            payload = event_payload or {}

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
                "commands": [],
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

        print(f"\nAutomation {automation.id}: {automation.name}")
        print(f"Enabled Actions: {len(actions)}")

        results = []
        commands = []

        execution_status = "SUCCESS"

        for action in actions:

            print(
                f"  Action ID={action.id} "
                f"Type={action.action_type}"
            )

            result = ActionExecutor.execute(
                db=db,
                action=action
            )

            results.append(result)

            commands.extend(
                result.get("commands", [])
            )

            if not result.get("success", False):
                execution_status = "FAILED"

        execution_result = {
            "automation_id": automation.id,
            "automation_name": automation.name,
            "actions_executed": len(actions),
            "results": results,
            "commands": commands
        }

        ExecutionLogService.create_log(
            db=db,
            automation_id=automation.id,
            event_type=event_type,
            status=execution_status,
            result=execution_result
        )

        return execution_result


def execute_event(
    db: Session,
    event_type: str,
    payload: dict,
    workspace_id: int | None = None
):
    """
    Finds every ACTIVE automation listening
    for this event and executes it.

    If workspace_id is supplied,
    only automations belonging to that
    workspace are executed.
    """

    query = (
        db.query(AutomationTrigger)
        .join(
            Automation,
            Automation.id == AutomationTrigger.automation_id
        )
        .filter(
            Automation.status == "ACTIVE",
            AutomationTrigger.trigger_type == event_type,
            AutomationTrigger.is_enabled == True
        )
    )

    if workspace_id is not None:

        query = query.filter(
            Automation.workspace_id == workspace_id
        )

    triggers = query.all()

    print("\n" + "=" * 70)
    print("EVENT RECEIVED:", event_type)

    if workspace_id is None:
        print("Workspace: ALL")
    else:
        print(f"Workspace: {workspace_id}")

    print("Matched Triggers:", len(triggers))

    for trigger in triggers:

        print(
            f"Trigger ID={trigger.id} | "
            f"Automation ID={trigger.automation_id} | "
            f"Trigger={trigger.trigger_type}"
        )

    print("=" * 70)

    executions = []

    for trigger in triggers:

        result = AutomationEngine.execute_automation(
            db=db,
            automation_id=trigger.automation_id,
            event_type=event_type,
            payload=payload
        )

        executions.append(result)

    return {
        "event": event_type,
        "workspace_id": workspace_id,
        "matched_automations": len(triggers),
        "executions": executions
    }