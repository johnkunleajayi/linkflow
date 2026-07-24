from sqlalchemy.orm import Session

from app.execution.engine import execute_event


class LinkedInService:
    """
    Handles LinkedIn events received
    from the LinkFlow Chrome Extension.
    """

    @staticmethod
    def process_event(
        db: Session,
        payload: dict
    ):
        """
        Sends a LinkedIn event into
        the automation engine.
        """

        event_type = payload.get("event")

        result = execute_event(
            db=db,
            event_type=event_type,
            payload=payload
        )

        reply = None

        if result["executions"]:

            execution = result["executions"][0]

            if execution["results"]:

                reply = execution["results"][0].get(
                    "message"
                )

        return {
            "success": True,
            "reply": reply,
            "execution": result
        }