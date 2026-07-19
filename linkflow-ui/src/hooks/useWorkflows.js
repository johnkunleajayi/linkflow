import { useState } from "react";

function useWorkflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadWorkflows() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/workflows/workspace/1"
      );

      const data = await response.json();

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
      alert("Workflow name is required.");
      return;
    }

    try {

      setCreating(true);

      const response = await fetch(
        "http://127.0.0.1:8000/workflows/workspace/1",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            trigger,
            action,
            trigger_configuration: {},
            action_configuration: {},
          }),
        }
      );


      if (!response.ok) {
        throw new Error(
          "Unable to create workflow."
        );
      }


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