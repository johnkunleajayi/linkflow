from sqlalchemy.orm import Session

from app.execution_logs.models import ExecutionLog


class ExecutionLogService:

    @staticmethod
    def create_log(
        db: Session,
        automation_id: int,
        event_type: str,
        status: str,
        result: dict | None = None
    ) -> ExecutionLog:

        log = ExecutionLog(
            automation_id=automation_id,
            event_type=event_type,
            status=status,
            result=result
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        return log

    @staticmethod
    def get_logs(
        db: Session,
        automation_id: int
    ):

        return (
            db.query(ExecutionLog)
            .filter(
                ExecutionLog.automation_id == automation_id
            )
            .order_by(
                ExecutionLog.executed_at.desc()
            )
            .all()
        )