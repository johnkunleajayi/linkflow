from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    owner = relationship(
        "User",
        back_populates="workspace"
    )