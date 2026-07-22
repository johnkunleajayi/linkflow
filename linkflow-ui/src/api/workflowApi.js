import apiClient from "./apiClient";


export async function getWorkflows() {

  return await apiClient(

    "/workflows/workspace/1"

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

        trigger,

        action,

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

        trigger,

        action,

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