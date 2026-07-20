from fastapi import (
    APIRouter,
    Body,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution.engine import (
    execute_event
)

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
    Receives LinkedIn webhook events
    and forwards them to the automation
    engine.
    """

    print("=" * 60)
    print("LINKEDIN WEBHOOK RECEIVED")
    print("=" * 60)
    print(payload)

    event_type = payload.get("event")

    result = execute_event(
        db=db,
        event_type=event_type,
        payload=payload
    )

    return {
        "success": True,
        "result": result
    }