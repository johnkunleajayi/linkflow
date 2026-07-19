from typing import Any

from pydantic import BaseModel


class WorkflowCreate(BaseModel):
    """
    Request schema for creating
    a complete automation workflow.
    """

    name: str

    trigger: str

    action: str

    trigger_configuration: dict[str, Any] | None = None

    action_configuration: dict[str, Any] | None = None