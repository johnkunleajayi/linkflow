import {
  useState
} from "react";

import {
  getWorkflows,
  createWorkflowApi,
  updateWorkflowApi,
  deleteWorkflowApi
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

    actionConfiguration,

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

        action,

        actionConfiguration

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


  async function updateWorkflow({

    automationId,

    name,

    trigger,

    action,

    actionConfiguration,

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

      await updateWorkflowApi({

        automationId,

        name,

        trigger,

        action,

        actionConfiguration

      });

      await loadWorkflows();

      if (onSuccess) {

        onSuccess();

      }

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update workflow."
      );

    } finally {

      setCreating(false);

    }

  }


  async function deleteWorkflow(
    automationId
  ) {

    try {

      await deleteWorkflowApi(
        automationId
      );

      await loadWorkflows();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete workflow."
      );

    }

  }


  return {

    workflows,

    loading,

    creating,

    loadWorkflows,

    createWorkflow,

    updateWorkflow,

    deleteWorkflow

  };

}

export default useWorkflows;