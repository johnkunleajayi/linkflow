from app.execution.salesforce_executor import (
    SalesforceExecutor
)

from app.execution.linkedin_reply_executor import (
    LinkedInReplyExecutor
)


class ExecutorRegistry:
    """
    Maps an action type to the class
    responsible for executing it.
    """

    _executors = {

        "salesforce.create_lead":
            SalesforceExecutor(),

        "linkedin.reply":
            LinkedInReplyExecutor(),

    }

    @classmethod
    def get_executor(
        cls,
        action_type: str
    ):

        return cls._executors.get(
            action_type
        )