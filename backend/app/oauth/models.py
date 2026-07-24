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


class OAuthState(Base):

    __tablename__ = "oauth_states"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    state = Column(
        String(255),
        nullable=False,
        unique=True,
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


    code_verifier = Column(
        String(255),
        nullable=True
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    workspace = relationship(
        "Workspace"
    )