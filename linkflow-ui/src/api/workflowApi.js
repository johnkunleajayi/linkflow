import apiClient from "./apiClient";

const triggerMap = {
  LINKEDIN_CONNECTION_ACCEPTED:
    "connection.accepted",

  "LINKEDIN_CONNECTION_ACCEPTED":
    "connection.accepted",

  "connection.accepted":
    "connection.accepted",
};

const actionMap = {
  SALESFORCE_CREATE_LEAD:
    "salesforce.create_lead",

  "SALESFORCE_CREATE_LEAD":
    "salesforce.create_lead",

  "salesforce.create_lead":
    "salesforce.create_lead",
};

export async function getWorkflows() {

  return await apiClient(

    "/workflows/workspace/1"

  );

}


export async function getExecutionLogs(
  automationId
) {

  return await apiClient(

    `/execution-logs/automation/${automationId}`

  );

}


export async function createWorkflowApi({

  name,

  trigger,

  action,

  actionConfiguration

}) {

  return await apiClient(

    "/workflows/workspace/1",

    {

      method: "POST",

      body: JSON.stringify({

        name,

        trigger:
          triggerMap[trigger] || trigger,

        action:
          actionMap[action] || action,

        trigger_configuration: {},

        action_configuration:
          actionConfiguration || {}

      }),

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

      body: JSON.stringify({

        name,

        trigger:
          triggerMap[trigger] || trigger,

        action:
          actionMap[action] || action,

        trigger_configuration: {},

        action_configuration:
          actionConfiguration || {}

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

      method: "DELETE"

    }

  );

}