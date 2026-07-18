from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.execution_logs.schemas import (
    ExecutionLogResponse
)

from app.execution_logs.service import (
    ExecutionLogService
)


router = APIRouter(
    prefix="/execution-logs",
    tags=["Execution Logs"]
)


@router.get(
    "/automation/{automation_id}",
    response_model=list[ExecutionLogResponse]
)
def get_execution_logs(
    automation_id: int,
    db: Session = Depends(get_db)
):

    return ExecutionLogService.get_logs(
        db=db,
        automation_id=automation_id
    )