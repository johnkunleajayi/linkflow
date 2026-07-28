from fastapi import (
    APIRouter,
    Body,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution.engine import execute_event

from app.auth.dependencies import (
    get_current_user
)

from app.auth.models import User

from app.workspaces.models import Workspace


router = APIRouter(
    prefix="/linkedin",
    tags=["LinkedIn"]
)


@router.post("/webhook")
async def linkedin_webhook(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    """
    Endpoint called by the
    LinkFlow Chrome Extension.

    The authenticated user determines
    which workspace is allowed to
    execute workflows.
    """

    print("=" * 60)
    print("LINKFLOW LINKEDIN EVENT")
    print("=" * 60)
    print(payload)
    print("=" * 60)

    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.owner_id == current_user.id
        )
        .first()
    )

    if workspace is None:

        return {
            "success": False,
            "message": "Workspace not found."
        }

    result = execute_event(
        db=db,
        event_type=payload.get("event"),
        payload=payload,
        workspace_id=workspace.id
    )

    commands = []

    for execution in result.get(
        "executions",
        []
    ):

        commands.extend(
            execution.get(
                "commands",
                []
            )
        )

    return {
        "success": True,
        "commands": commands,
        "execution": result
    }