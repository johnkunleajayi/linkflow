from sqlalchemy.orm import Session

from app.automation_actions.models import (
    AutomationAction
)

from app.execution.commands import (
    Command,
    CommandType
)


class LinkedInReplyExecutor:
    """
    Executes a LinkedIn reply action.

    Instead of replying directly,
    it returns commands that the
    LinkedIn Extension can execute.
    """

    def execute(
        self,
        db: Session,
        action: AutomationAction
    ):

        configuration = (
            action.configuration or {}
        )

        reply_message = (
            configuration.get(
                "message",
                "Thank you for your comment!"
            )
        )

        print("=" * 60)
        print("LINKFLOW LINKEDIN REPLY")
        print("=" * 60)
        print(reply_message)
        print("=" * 60)

        return {
            "success": True,
            "commands": [
                Command(
                    type=CommandType.REPLY,
                    text=reply_message
                ).model_dump()
            ]
        }