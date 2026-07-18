from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.oauth.service import (
    SalesforceOAuthService
)

from app.connections.service import (
    ConnectionService
)


router = APIRouter(
    prefix="/oauth",
    tags=["OAuth"]
)


@router.get("/salesforce")
def salesforce_login(
    workspace_id: int = Query(...)
):
    """
    Returns the Salesforce OAuth
    authorization URL.
    """

    authorization_url = (
        SalesforceOAuthService.get_authorization_url(
            workspace_id
        )
    )

    return {
        "authorization_url": authorization_url
    }


@router.get("/salesforce/callback")
def salesforce_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Exchanges Salesforce authorization
    code for an access token and
    stores it as a Connection.
    """

    try:

        workspace_id = int(state)

        token_response = (
            SalesforceOAuthService.exchange_code_for_token(
                code=code
            )
        )

        ConnectionService.create_or_update_connection(
            db=db,
            workspace_id=workspace_id,
            provider="SALESFORCE",
            name="Salesforce OAuth",
            credentials={
                "access_token": token_response["access_token"],
                "refresh_token": token_response["refresh_token"],
                "instance_url": token_response["instance_url"]
            }
        )

        return {
            "message": "Salesforce connected successfully.",
            "connection_saved": True,
            "workspace_id": workspace_id,
            "instance_url": token_response["instance_url"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )