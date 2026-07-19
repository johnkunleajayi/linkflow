import {
  useState
} from "react";


import {
  getWorkflows,
  createWorkflowApi
} from "../api/workflowApi";



function useWorkflows() {


  const [workflows, setWorkflows] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [creating, setCreating] =
    useState(false);






  async function loadWorkflows() {


    try {


      setLoading(true);



      const data =
        await getWorkflows();



      setWorkflows(data);



    } catch (error) {


      console.error(error);



    } finally {


      setLoading(false);


    }


  }








  async function createWorkflow({

    name,

    trigger,

    action,

    onSuccess

  }) {



    if (!name.trim()) {


      alert(
        "Workflow name is required."
      );


      return;


    }






    try {


      setCreating(true);




      await createWorkflowApi({

        name,

        trigger,

        action

      });





      await loadWorkflows();





      if (onSuccess) {


        onSuccess();


      }





    } catch (error) {


      console.error(error);



      alert(
        "Failed to create workflow."
      );



    } finally {


      setCreating(false);



    }



  }







  return {


    workflows,

    loading,

    creating,

    loadWorkflows,

    createWorkflow,


  };


}



export default useWorkflows;