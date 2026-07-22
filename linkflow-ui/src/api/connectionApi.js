const API_URL =
  import.meta.env.VITE_API_URL;



export async function getConnections() {

  const response = await fetch(

    `${API_URL}/connections/workspace/1`

  );


  if (!response.ok) {

    throw new Error(
      "Unable to fetch connections."
    );

  }


  const backendConnections =
    await response.json();


  const applications = [

    {
      name: "LinkedIn",
      provider: "LINKEDIN"
    },

    {
      name: "Salesforce",
      provider: "SALESFORCE"
    },

    {
      name: "HubSpot",
      provider: "HUBSPOT"
    }

  ];


  return applications.map(
    (application) => {

      const existingConnection =
        backendConnections.find(

          (connection) =>

            connection.provider ===
              application.provider &&

            connection.is_active ===
              "ACTIVE"

        );


      return {

        name: application.name,

        status:
          existingConnection
            ? "CONNECTED"
            : "DISCONNECTED"

      };

    }

  );

}





export async function connectApplicationApi(
  applicationName
) {

  switch (applicationName) {

    case "Salesforce": {

      const response = await fetch(

        `${API_URL}/oauth/salesforce?workspace_id=1`

      );


      if (!response.ok) {

        throw new Error(
          "Unable to start Salesforce OAuth."
        );

      }


      const data =
        await response.json();


      window.location.href =
        data.authorization_url;

      return;

    }


    case "LinkedIn": {

      const response = await fetch(

        `${API_URL}/oauth/linkedin?workspace_id=1`

      );


      if (!response.ok) {

        throw new Error(
          "Unable to start LinkedIn OAuth."
        );

      }


      const data =
        await response.json();


      window.location.href =
        data.authorization_url;

      return;

    }


    default:

      throw new Error(
        `${applicationName} is not supported yet.`
      );

  }

}





export async function getSalesforceAuthorizationUrl() {

  const response = await fetch(

    `${API_URL}/oauth/salesforce?workspace_id=1`

  );


  if (!response.ok) {

    throw new Error(
      "Unable to start Salesforce connection."
    );

  }


  return await response.json();

}