from sqlalchemy.orm import Session

from app.social_accounts.models import SocialAccount
from app.social_accounts.schemas import (
    SocialAccountCreate,
    SocialAccountUpdate
)
from app.workspaces.models import Workspace
from app.auth.models import User


class SocialAccountService:

    @staticmethod
    def create_social_account(
        db: Session,
        social_account: SocialAccountCreate,
        owner: User
    ) -> SocialAccount:

        workspace = (
            db.query(Workspace)
            .filter(
                Workspace.id == social_account.workspace_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not workspace:
            raise ValueError("Workspace not found")

        new_social_account = SocialAccount(
            workspace_id=social_account.workspace_id,
            platform=social_account.platform,
            account_name=social_account.account_name,
            account_identifier=social_account.account_identifier
        )

        db.add(new_social_account)
        db.commit()
        db.refresh(new_social_account)

        return new_social_account

    @staticmethod
    def get_social_accounts(
        db: Session,
        owner: User
    ):

        return (
            db.query(SocialAccount)
            .join(Workspace)
            .filter(
                Workspace.owner_id == owner.id
            )
            .all()
        )

    @staticmethod
    def update_social_account(
        db: Session,
        social_account_id: int,
        social_account: SocialAccountUpdate,
        owner: User
    ) -> SocialAccount:

        existing_social_account = (
            db.query(SocialAccount)
            .join(Workspace)
            .filter(
                SocialAccount.id == social_account_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_social_account:
            raise ValueError("Social account not found")

        existing_social_account.account_name = social_account.account_name

        db.commit()
        db.refresh(existing_social_account)

        return existing_social_account

    @staticmethod
    def delete_social_account(
        db: Session,
        social_account_id: int,
        owner: User
    ):

        existing_social_account = (
            db.query(SocialAccount)
            .join(Workspace)
            .filter(
                SocialAccount.id == social_account_id,
                Workspace.owner_id == owner.id
            )
            .first()
        )

        if not existing_social_account:
            raise ValueError("Social account not found")

        db.delete(existing_social_account)
        db.commit()

        return {
            "message": "Social account deleted successfully"
        }