class ConditionEngine:
    """
    Evaluates workflow conditions.

    Version 1 (MVP)

    If no conditions exist,
    the workflow is allowed
    to continue.

    Future versions will support:

    - equals
    - not equals
    - contains
    - starts with
    - ends with
    - greater than
    - less than
    - AND
    - OR
    - nested conditions
    """

    @staticmethod
    def evaluate(
        conditions: dict | None = None,
        payload: dict | None = None
    ) -> bool:
        """
        Returns True when the workflow
        should continue.

        Version 1 always returns True.
        """

        return True