from sqlalchemy.orm import Session

from app.auth.models import User
from app.auth.schemas import UserCreate
from app.core.jwt import create_access_token
from app.core.security import (
    hash_password,
    verify_password
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        user: UserCreate
    ) -> User:

        existing_user = (
            db.query(User)
            .filter(User.email == user.email)
            .first()
        )

        if existing_user:
            raise ValueError("Email already registered")

        new_user = User(
            full_name=user.full_name,
            email=user.email,
            password_hash=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str
    ) -> str:

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            password,
            user.password_hash
        ):
            raise ValueError("Invalid email or password")

        access_token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return access_token