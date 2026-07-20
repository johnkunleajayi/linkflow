from urllib.parse import urlencode

import base64
import hashlib
import secrets

import httpx

from app.core.config import settings


# Temporary in-memory storage for MVP.
_code_verifier = None


class SalesforceOAuthService:
    """
    Handles Salesforce OAuth operations.
    """

    @staticmethod
    def get_authorization_url(
        workspace_id: int
    ):

        global _code_verifier

        # Generate PKCE verifier
        _code_verifier = secrets.token_urlsafe(64)

        # Generate PKCE challenge
        digest = hashlib.sha256(
            _code_verifier.encode("utf-8")
        ).digest()

        code_challenge = (
            base64.urlsafe_b64encode(digest)
            .decode("utf-8")
            .rstrip("=")
        )

        params = {
            "response_type": "code",
            "client_id": settings.SALESFORCE_CLIENT_ID,
            "redirect_uri": settings.SALESFORCE_REDIRECT_URI,
            "state": str(workspace_id),
            "code_challenge": code_challenge,
            "code_challenge_method": "S256"
        }

        return (
            f"{settings.SALESFORCE_LOGIN_URL}"
            f"/services/oauth2/authorize?"
            f"{urlencode(params)}"
        )

    @staticmethod
    def exchange_code_for_token(
        code: str
    ):

        global _code_verifier

        token_url = (
            f"{settings.SALESFORCE_LOGIN_URL}"
            "/services/oauth2/token"
        )

        payload = {
            "grant_type": "authorization_code",
            "client_id": settings.SALESFORCE_CLIENT_ID,
            "client_secret": settings.SALESFORCE_CLIENT_SECRET,
            "redirect_uri": settings.SALESFORCE_REDIRECT_URI,
            "code": code,
            "code_verifier": _code_verifier
        }

        response = httpx.post(
            token_url,
            data=payload,
            timeout=30
        )

        response.raise_for_status()

        return response.json()

    @staticmethod
    def refresh_access_token(
        refresh_token: str
    ):
        """
        Uses a Salesforce refresh token
        to obtain a new access token.
        """

        token_url = (
            f"{settings.SALESFORCE_LOGIN_URL}"
            "/services/oauth2/token"
        )

        payload = {
            "grant_type": "refresh_token",
            "client_id": settings.SALESFORCE_CLIENT_ID,
            "client_secret": settings.SALESFORCE_CLIENT_SECRET,
            "refresh_token": refresh_token
        }

        try:

            response = httpx.post(
                token_url,
                data=payload,
                timeout=30
            )

            response.raise_for_status()

            return {
                "success": True,
                "data": response.json()
            }

        except httpx.HTTPStatusError as e:

            try:
                error = e.response.json()
            except Exception:
                error = e.response.text

            return {
                "success": False,
                "error": error
            }

        except Exception as e:

            return {
                "success": False,
                "error": str(e)
            }


class LinkedInOAuthService:
    """
    Handles LinkedIn OAuth operations.
    """

    @staticmethod
    def get_authorization_url(
        workspace_id: int
    ):

        state = str(workspace_id)

        params = {
            "response_type": "code",
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "state": state,
            "scope": "openid profile email"
        }

        return (
            f"{settings.LINKEDIN_AUTHORIZATION_URL}"
            f"?{urlencode(params)}"
        )

    @staticmethod
    def exchange_code_for_token(
        code: str
    ):

        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET
        }

        response = httpx.post(
            settings.LINKEDIN_ACCESS_TOKEN_URL,
            data=payload,
            timeout=30
        )

        response.raise_for_status()

        return response.json()