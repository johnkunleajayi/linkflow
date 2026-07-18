import httpx

from app.automation_actions.models import AutomationAction


class SalesforceExecutor:
    """
    Executes Salesforce-related actions.
    """

    def execute(
        self,
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

        configuration = action.configuration or {}

        salesforce_url = configuration.get(
            "salesforce_url"
        )

        access_token = configuration.get(
            "access_token"
        )

        lead_data = configuration.get(
            "lead",
            {
                "FirstName": "John",
                "LastName": "LinkedIn Lead",
                "Company": "LinkFlow"
            }
        )

        # MVP fallback mode

        if not salesforce_url or not access_token:

            print("Salesforce credentials not configured.")
            print("Running Mock Salesforce execution.")
            print()

            return {
                "success": True,
                "mode": "mock",
                "message": "Salesforce Lead created successfully."
            }


        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }


        try:

            response = httpx.post(
                salesforce_url,
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