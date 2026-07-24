from sqlalchemy.orm import Session

from app.automation_actions.models import (
    AutomationAction
)


class LinkedInReplyExecutor:
    """
    Executes a LinkedIn reply action.

    MVP

    For now this simulates a reply.

    Later this class will call the
    LinkedIn API.
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
            "provider": "LINKEDIN",
            "action": "reply",
            "message": reply_message
        }