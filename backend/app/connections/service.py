from sqlalchemy.orm import Session

from app.auth.models import User
from app.workspaces.models import Workspace
from app.connections.models import Connection
from app.connections.schemas import (
    ConnectionCreate,
    ConnectionUpdate
)


class ConnectionService:

    @staticmethod
    def create_connection(
        db: Session,
        workspace_id: int,
        connection: ConnectionCreate,
        owner: User
    ) -> Connection:

        workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not workspace:
            raise ValueError("Workspace not found")

        new_connection = Connection(
            workspace_id=workspace.id,
            provider=connection.provider,
            name=connection.name,
            credentials=connection.credentials
        )

        db.add(new_connection)
        db.commit()
        db.refresh(new_connection)

        return new_connection

    @staticmethod
    def create_or_update_connection(
        db: Session,
        workspace_id: int,
        provider: str,
        name: str,
        credentials: dict
    ) -> Connection:
        """
        Creates or updates an OAuth connection.
        """

        existing = (
            db.query(Connection)
            .filter(
                Connection.workspace_id == workspace_id,
                Connection.provider == provider
            )
            .first()
        )

        if existing:

            existing.name = name
            existing.credentials = credentials
            existing.is_active = "ACTIVE"

            db.commit()
            db.refresh(existing)

            return existing

        connection = Connection(
            workspace_id=workspace_id,
            provider=provider,
            name=name,
            credentials=credentials,
            is_active="ACTIVE"
        )

        db.add(connection)
        db.commit()
        db.refresh(connection)

        return connection

    @staticmethod
    def get_provider_connection(
        db: Session,
        workspace_id: int,
        provider: str
    ) -> Connection | None:
        """
        Returns the active provider connection.
        """

        return (
            db.query(Connection)
            .filter(
                Connection.workspace_id == workspace_id,
                Connection.provider == provider,
                Connection.is_active == "ACTIVE"
            )
            .first()
        )

    @staticmethod
    def get_connections(
        db: Session,
        workspace_id: int,
        owner: User
    ):

        workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not workspace:
            raise ValueError("Workspace not found")

        return (
            db.query(Connection)
            .filter(
                Connection.workspace_id == workspace_id
            )
            .all()
        )

    @staticmethod
    def get_connection(
        db: Session,
        connection_id: int,
        owner: User
    ) -> Connection:

        connection = (
            db.query(Connection)
            .join(Workspace)
            .filter(
                Connection.id == connection_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not connection:
            raise ValueError("Connection not found")

        return connection

    @staticmethod
    def update_connection(
        db: Session,
        connection_id: int,
        connection: ConnectionUpdate,
        owner: User
    ) -> Connection:

        existing_connection = (
            db.query(Connection)
            .join(Workspace)
            .filter(
                Connection.id == connection_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_connection:
            raise ValueError("Connection not found")

        if connection.name is not None:
            existing_connection.name = connection.name

        if connection.credentials is not None:
            existing_connection.credentials = connection.credentials

        if connection.is_active is not None:
            existing_connection.is_active = connection.is_active

        db.commit()
        db.refresh(existing_connection)

        return existing_connection

    @staticmethod
    def delete_connection(
        db: Session,
        connection_id: int,
        owner: User
    ):

        existing_connection = (
            db.query(Connection)
            .join(Workspace)
            .filter(
                Connection.id == connection_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_connection:
            raise ValueError("Connection not found")

        db.delete(existing_connection)
        db.commit()

        return True