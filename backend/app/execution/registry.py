from app.execution.salesforce_executor import (
    SalesforceExecutor
)


class ExecutorRegistry:
    """
    Maps an action type to the class
    responsible for executing it.
    """

    _executors = {
        "salesforce.create_lead": SalesforceExecutor(),
    }

    @classmethod
    def get_executor(
        cls,
        action_type: str
    ):

        return cls._executors.get(action_type)