import httpx

from sqlalchemy.orm import Session

from app.automation_actions.models import AutomationAction
from app.connections.models import Connection
from app.connections.service import ConnectionService
from app.oauth.service import SalesforceOAuthService


class SalesforceExecutor:
    """
    Executes Salesforce-related actions.
    """

    def execute(
        self,
        db: Session,
        action: AutomationAction
    ):

        print("=" * 60)
        print("LINKFLOW EXECUTION ENGINE")
        print("=" * 60)
        print("Executing Salesforce Action...")
        print()

        print(f"Action ID      : {action.id}")
        print(f"Action Type    : {action.action_type}")
        print(f"Configuration  : {action.configuration}")
        print()

        workspace_id = action.automation.workspace_id

        connection = (
            db.query(Connection)
            .filter(
                Connection.workspace_id == workspace_id,
                Connection.provider == "SALESFORCE",
                Connection.is_active == "ACTIVE"
            )
            .first()
        )

        if connection is None:

            return {
                "success": False,
                "mode": "connection",
                "message": "No active Salesforce connection found."
            }

        credentials = connection.credentials or {}

        instance_url = credentials.get(
            "instance_url"
        )

        access_token = credentials.get(
            "access_token"
        )

        refresh_token = credentials.get(
            "refresh_token"
        )

        #
        # Validate Salesforce OAuth connection
        #

        if not instance_url or not access_token:

            return {
                "success": False,
                "mode": "connection",
                "message": (
                    "Salesforce connection is missing "
                    "an access token or instance URL."
                )
            }

        configuration = action.configuration or {}

        lead_data = configuration.get(
            "lead",
            {
                "FirstName": "John",
                "LastName": "LinkedIn Lead",
                "Company": "LinkFlow"
            }
        )

        endpoint = (
            f"{instance_url}"
            "/services/data/v64.0/sobjects/Lead"
        )

        def send_request(token: str):

            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }

            return httpx.post(
                endpoint,
                json=lead_data,
                headers=headers,
                timeout=30
            )

        print("Creating Salesforce Lead...")
        print(endpoint)
        print()

        try:

            response = send_request(access_token)

            try:
                response_json = response.json()
            except Exception:
                response_json = {
                    "raw_response": response.text
                }

            #
            # Access Token Expired
            #

            if (
                response.status_code == 401
                and isinstance(response_json, list)
                and len(response_json) > 0
                and response_json[0].get("errorCode")
                == "INVALID_SESSION_ID"
            ):

                print("Access token expired.")
                print("Refreshing Salesforce token...")
                print()

                if not refresh_token:

                    return {
                        "success": False,
                        "mode": "salesforce",
                        "status_code": 401,
                        "error_type": "NO_REFRESH_TOKEN",
                        "message": (
                            "Salesforce refresh token not found."
                        )
                    }

                refresh_result = (
                    SalesforceOAuthService.refresh_access_token(
                        refresh_token
                    )
                )

                if not refresh_result["success"]:

                    return {
                        "success": False,
                        "mode": "salesforce",
                        "status_code": 401,
                        "error_type": "REFRESH_FAILED",
                        "message": (
                            "Unable to refresh Salesforce access token."
                        ),
                        "response": refresh_result["error"]
                    }

                new_access_token = (
                    refresh_result["data"]["access_token"]
                )

                ConnectionService.update_access_token(
                    db=db,
                    connection=connection,
                    access_token=new_access_token
                )

                print("Access token refreshed.")
                print("Retrying Salesforce request...")
                print()

                response = send_request(new_access_token)

                try:
                    response_json = response.json()
                except Exception:
                    response_json = {
                        "raw_response": response.text
                    }

            #
            # Normal Salesforce Error
            #

            if response.status_code not in [200, 201]:

                error_code = "UNKNOWN_ERROR"

                if (
                    isinstance(response_json, list)
                    and len(response_json) > 0
                ):

                    error_code = response_json[0].get(
                        "errorCode",
                        "UNKNOWN_ERROR"
                    )

                print("Salesforce Error")
                print(response_json)

                return {
                    "success": False,
                    "mode": "salesforce",
                    "status_code": response.status_code,
                    "error_type": error_code,
                    "message": (
                        "Salesforce Lead creation failed."
                    ),
                    "response": response_json
                }

            print("Lead Created Successfully")
            print(response_json)

            return {
                "success": True,
                "mode": "salesforce",
                "status_code": response.status_code,
                "message": (
                    "Salesforce Lead created successfully."
                ),
                "lead_id": response_json.get("id"),
                "salesforce_response": response_json
            }

        except Exception as e:

            return {
                "success": False,
                "mode": "salesforce",
                "message": str(e)
            }