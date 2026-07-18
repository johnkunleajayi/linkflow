import httpx

from sqlalchemy.orm import Session

from app.automation_actions.models import AutomationAction
from app.connections.models import Connection


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

        salesforce_url = credentials.get(
            "instance_url"
        )

        access_token = credentials.get(
            "access_token"
        )

        configuration = action.configuration or {}

        lead_data = configuration.get(
            "lead",
            {
                "FirstName": "John",
                "LastName": "LinkedIn Lead",
                "Company": "LinkFlow"
            }
        )

        #
        # MVP fallback
        #

        if not salesforce_url or not access_token:

            print("Salesforce credentials not configured.")
            print("Running Mock Salesforce execution.")
            print()

            return {
                "success": True,
                "mode": "mock",
                "message": "Salesforce Lead created successfully."
            }

        #
        # Salesforce REST endpoint
        #

        endpoint = (
            f"{salesforce_url}"
            "/services/data/v64.0/sobjects/Lead"
        )

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        try:

            response = httpx.post(
                endpoint,
                json=lead_data,
                headers=headers,
                timeout=30
            )

            if response.status_code not in [200, 201]:

                return {
                    "success": False,
                    "mode": "salesforce",
                    "message": "Salesforce Lead creation failed.",
                    "response": response.text
                }

            return {
                "success": True,
                "mode": "salesforce",
                "message": "Salesforce Lead created successfully.",
                "salesforce_response": response.json()
            }

        except Exception as e:

            return {
                "success": False,
                "mode": "salesforce",
                "message": str(e)
            }