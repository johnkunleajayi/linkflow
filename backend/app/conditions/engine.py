class ConditionEngine:
    """
    Evaluates workflow conditions.

    MVP

    Supports:

    - keyword contains

    Future versions:

    - equals
    - not equals
    - starts with
    - ends with
    - regex
    - AND
    - OR
    """

    @staticmethod
    def evaluate(
        conditions: dict | None = None,
        payload: dict | None = None
    ) -> bool:
        """
        Returns True when the workflow
        should continue.

        Rules:

        1. No conditions -> continue

        2. If keyword exists, the comment
           must contain that keyword.
        """

        if conditions is None:
            return True

        if payload is None:
            payload = {}

        keyword = conditions.get("keyword")

        if not keyword:
            return True

        comment = (
            payload.get("comment") or ""
        )

        return (
            keyword.lower()
            in
            comment.lower()
        )