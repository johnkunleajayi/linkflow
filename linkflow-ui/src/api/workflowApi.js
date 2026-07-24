import apiClient from "./apiClient";


const triggerMap = {

  LINKEDIN_COMMENT:
    "LINKEDIN_COMMENT",

  "LINKEDIN_COMMENT":
    "LINKEDIN_COMMENT",

  LINKEDIN_CONNECTION_ACCEPTED:
    "connection.accepted",

  "LINKEDIN_CONNECTION_ACCEPTED":
    "connection.accepted",

  "connection.accepted":
    "connection.accepted",

};


const actionMap = {

  LINKEDIN_REPLY:
    "linkedin.reply",

  "LINKEDIN_REPLY":
    "linkedin.reply",

  "linkedin.reply":
    "linkedin.reply",

  SALESFORCE_CREATE_LEAD:
    "salesforce.create_lead",

  "SALESFORCE_CREATE_LEAD":
    "salesforce.create_lead",

  "salesforce.create_lead":
    "salesforce.create_lead",

};



function getAuthHeaders() {

  const token =
    localStorage.getItem(
      "access_token"
    );


  return {

    Authorization:
      `Bearer ${token}`

  };

}



export async function getWorkflows() {

  const workspace =
    JSON.parse(
      localStorage.getItem(
        "workspace"
      )
    );


  if (!workspace) {

    throw new Error(
      "No workspace selected."
    );

  }


  return await apiClient(

    `/workflows/workspace/${workspace.id}`,

    {

      headers:
        getAuthHeaders()

    }

  );

}



export async function getExecutionLogs(

  automationId

) {

  return await apiClient(

    `/execution-logs/automation/${automationId}`,

    {

      headers:
        getAuthHeaders()

    }

  );

}



export async function createWorkflowApi({

  name,

  trigger,

  action,

  actionConfiguration

}) {


  const workspace =
    JSON.parse(
      localStorage.getItem(
        "workspace"
      )
    );


  if (!workspace) {

    throw new Error(
      "No workspace selected."
    );

  }



  return await apiClient(

    `/workflows/workspace/${workspace.id}`,

    {

      method: "POST",

      headers:
        getAuthHeaders(),

      body: JSON.stringify({

        name,

        trigger:
          triggerMap[trigger] ||
          trigger,

        action:
          actionMap[action] ||
          action,

        trigger_configuration: {},

        action_configuration:
          actionConfiguration ||
          {}

      })

    }

  );

}



export async function updateWorkflowApi({

  automationId,

  name,

  trigger,

  action,

  actionConfiguration

}) {


  return await apiClient(

    `/workflows/${automationId}`,

    {

      method: "PUT",

      headers:
        getAuthHeaders(),

      body: JSON.stringify({

        name,

        trigger:
          triggerMap[trigger] ||
          trigger,

        action:
          actionMap[action] ||
          action,

        trigger_configuration: {},

        action_configuration:
          actionConfiguration ||
          {}

      })

    }

  );

}



export async function deleteWorkflowApi(

  automationId

) {

  return await apiClient(

    `/workflows/${automationId}`,

    {

      method: "DELETE",

      headers:
        getAuthHeaders()

    }

  );

}