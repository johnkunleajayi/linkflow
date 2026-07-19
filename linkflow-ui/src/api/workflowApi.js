import apiClient from "./apiClient";




export async function getWorkflows() {


  return await apiClient(

    "/workflows/workspace/1"

  );


}







export async function createWorkflowApi({

  name,

  trigger,

  action

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

        action_configuration: {},

      }),

    }

  );


}