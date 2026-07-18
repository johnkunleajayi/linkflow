from app.automation_actions.models import AutomationAction

from app.execution.registry import (
    ExecutorRegistry
)


class ActionExecutor:
    """
    Dispatches an Automation Action
    to the correct executor.
    """

    @staticmethod
    def execute(
        action: AutomationAction
    ):

        executor = ExecutorRegistry.get_executor(
            action.action_type
        )

        if executor is None:

            raise ValueError(
                f"No executor registered for "
                f"'{action.action_type}'"
            )

        return executor.execute(action)