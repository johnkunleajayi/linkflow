from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class SocialAccount(Base):
    __tablename__ = "social_accounts"

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

    platform = Column(
        String(50),
        nullable=False
    )

    account_name = Column(
        String(255),
        nullable=False
    )

    account_identifier = Column(
        String(255),
        nullable=False
    )

    is_connected = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workspace = relationship(
        "Workspace",
        back_populates="social_accounts"
    )