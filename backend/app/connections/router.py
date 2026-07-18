from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.auth.dependencies import get_current_user

from app.auth.models import User

from app.connections.schemas import (
    ConnectionCreate,
    ConnectionUpdate,
    ConnectionResponse
)

from app.connections.service import (
    ConnectionService
)


router = APIRouter(
    prefix="/connections",
    tags=["Connections"]
)



@router.post(
    "/workspace/{workspace_id}",
    response_model=ConnectionResponse,
    status_code=201
)
def create_connection(
    workspace_id: int,
    connection: ConnectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return ConnectionService.create_connection(
            db=db,
            workspace_id=workspace_id,
            connection=connection,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )



@router.get(
    "/workspace/{workspace_id}",
    response_model=list[ConnectionResponse]
)
def get_connections(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return ConnectionService.get_connections(
            db=db,
            workspace_id=workspace_id,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )



@router.get(
    "/{connection_id}",
    response_model=ConnectionResponse
)
def get_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return ConnectionService.get_connection(
            db=db,
            connection_id=connection_id,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )



@router.put(
    "/{connection_id}",
    response_model=ConnectionResponse
)
def update_connection(
    connection_id: int,
    connection: ConnectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return ConnectionService.update_connection(
            db=db,
            connection_id=connection_id,
            connection=connection,
            owner=current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )



@router.delete(
    "/{connection_id}"
)
def delete_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        ConnectionService.delete_connection(
            db=db,
            connection_id=connection_id,
            owner=current_user
        )

        return {
            "message": "Connection deleted successfully."
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )