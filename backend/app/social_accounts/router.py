from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.auth.dependencies import get_current_user
from app.auth.models import User

from app.social_accounts.schemas import (
    SocialAccountCreate,
    SocialAccountUpdate,
    SocialAccountResponse
)

from app.social_accounts.service import SocialAccountService


router = APIRouter(
    prefix="/social-accounts",
    tags=["Social Accounts"]
)


@router.post(
    "",
    response_model=SocialAccountResponse,
    status_code=201
)
def create_social_account(
    social_account: SocialAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return SocialAccountService.create_social_account(
            db=db,
            social_account=social_account,
            owner=current_user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "",
    response_model=list[SocialAccountResponse]
)
def get_social_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return SocialAccountService.get_social_accounts(
        db=db,
        owner=current_user
    )


@router.put(
    "/{social_account_id}",
    response_model=SocialAccountResponse
)
def update_social_account(
    social_account_id: int,
    social_account: SocialAccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return SocialAccountService.update_social_account(
            db=db,
            social_account_id=social_account_id,
            social_account=social_account,
            owner=current_user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{social_account_id}"
)
def delete_social_account(
    social_account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return SocialAccountService.delete_social_account(
            db=db,
            social_account_id=social_account_id,
            owner=current_user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )