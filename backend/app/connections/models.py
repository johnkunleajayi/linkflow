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


class Connection(Base):

    __tablename__ = "connections"


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


    provider = Column(
        String(50),
        nullable=False
    )


    name = Column(
        String(150),
        nullable=False
    )


    credentials = Column(
        JSON,
        nullable=True
    )


    is_active = Column(
        String(20),
        default="ACTIVE"
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    workspace = relationship(
        "Workspace",
        back_populates="connections"
    )