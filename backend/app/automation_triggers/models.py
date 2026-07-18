from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class AutomationTrigger(Base):
    __tablename__ = "automation_triggers"

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

    trigger_type = Column(
        String(100),
        nullable=False
    )

    configuration = Column(
        JSON,
        nullable=True
    )

    is_enabled = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    automation = relationship(
        "Automation",
        back_populates="triggers"
    )