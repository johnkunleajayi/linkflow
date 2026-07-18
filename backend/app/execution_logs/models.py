from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    automation_id = Column(
        Integer,
        ForeignKey("automations.id"),
        nullable=False
    )

    event_type = Column(
        String(150),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False
    )

    result = Column(
        JSON,
        nullable=True
    )

    executed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    automation = relationship(
        "Automation"
    )