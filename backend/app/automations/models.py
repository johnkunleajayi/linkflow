from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Automation(Base):
    __tablename__ = "automations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    name = Column(
        String(150),
        nullable=False
    )

    trigger_type = Column(
        String(100),
        nullable=False
    )

    action_type = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(50),
        default="ACTIVE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    workspace = relationship(
        "Workspace",
        back_populates="automations"
    )