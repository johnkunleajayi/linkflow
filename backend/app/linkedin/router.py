from fastapi import (
    APIRouter,
    Body,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution.engine import execute_event


router = APIRouter(
    prefix="/linkedin",
    tags=["LinkedIn"]
)


@router.post("/webhook")
async def linkedin_webhook(
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    """
    MVP endpoint called by the
    LinkFlow Chrome Extension.

    Example:

    {
        "event": "LINKEDIN_COMMENT",
        "author": "John",
        "comment": "I need pricing",
        "keyword": "pricing"
    }
    """

    print("=" * 60)
    print("LINKFLOW LINKEDIN EVENT")
    print("=" * 60)
    print(payload)
    print("=" * 60)

    result = execute_event(
        db=db,
        event_type=payload.get("event"),
        payload=payload
    )

    return {
        "success": True,
        "reply": (
            result["executions"][0]["results"][0]["message"]
            if result["executions"]
            else None
        ),
        "execution": result
    }