from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    Depends
)

from fastapi.responses import RedirectResponse

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.oauth.service import (
    SalesforceOAuthService,
    LinkedInOAuthService
)

from app.oauth.models import OAuthState

from app.connections.service import (
    ConnectionService
)


router = APIRouter(
    prefix="/oauth",
    tags=["OAuth"]
)


# ==================================================
# Salesforce OAuth
# ==================================================

@router.get("/salesforce")
def salesforce_login(
    workspace_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Returns the Salesforce OAuth
    authorization URL.
    """

    authorization_url = (
        SalesforceOAuthService.get_authorization_url(
            db=db,
            workspace_id=workspace_id
        )
    )

    return {
        "authorization_url": authorization_url
    }



@router.get("/salesforce/callback")
def salesforce_callback(
    code: str | None = Query(None),
    state: str = Query(...),
    error: str | None = Query(None),
    error_description: str | None = Query(None),
    db: Session = Depends(get_db)
):
    """
    Handles Salesforce OAuth callback.

    Success:
    - Receives authorization code
    - Exchanges code for tokens
    - Stores Salesforce connection

    Failure:
    - Returns Salesforce OAuth error
    """

    try:

        if error:

            raise HTTPException(
                status_code=400,
                detail={
                    "error": error,
                    "description": error_description
                }
            )


        if code is None:

            raise HTTPException(
                status_code=400,
                detail="Missing authorization code."
            )


        token_response = (
            SalesforceOAuthService.exchange_code_for_token(
                db=db,
                code=code,
                state=state
            )
        )


        oauth_state = (
            db.query(OAuthState)
            .filter(
                OAuthState.state == state,
                OAuthState.provider == "SALESFORCE"
            )
            .first()
        )


        if oauth_state is None:

            raise HTTPException(
                status_code=400,
                detail="Invalid OAuth state."
            )



        ConnectionService.create_or_update_connection(
            db=db,
            workspace_id=oauth_state.workspace_id,
            provider="SALESFORCE",
            name="Salesforce OAuth",
            credentials={
                "access_token":
                    token_response["access_token"],

                "refresh_token":
                    token_response.get(
                        "refresh_token"
                    ),

                "instance_url":
                    token_response["instance_url"]
            }
        )



        return RedirectResponse(
            url=(
                "http://localhost:5173/"
                "connections"
                "?provider=salesforce"
                "&success=true"
            )
        )


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )



# ==================================================
# LinkedIn OAuth
# ==================================================

@router.get("/linkedin")
def linkedin_login(
    workspace_id: int = Query(...)
):
    """
    Returns the LinkedIn OAuth
    authorization URL.
    """

    authorization_url = (
        LinkedInOAuthService.get_authorization_url(
            workspace_id
        )
    )

    return {
        "authorization_url": authorization_url
    }



@router.get("/linkedin/callback")
def linkedin_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Exchanges LinkedIn authorization
    code for an access token,
    stores the connection,
    then redirects back to LinkFlow.
    """

    try:

        workspace_id = int(state)


        token_response = (
            LinkedInOAuthService.exchange_code_for_token(
                code=code
            )
        )


        ConnectionService.create_or_update_connection(
            db=db,
            workspace_id=workspace_id,
            provider="LINKEDIN",
            name="LinkedIn OAuth",
            credentials=token_response
        )


        return RedirectResponse(
            url=(
                "http://localhost:5173/"
                "connections"
                "?provider=linkedin"
                "&success=true"
            )
        )


    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )