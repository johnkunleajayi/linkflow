import {
  useState
} from "react";

import {
  getExecutionLogs
} from "../api/workflowApi";


function useExecutionLogs() {

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedWorkflowId,
    setSelectedWorkflowId
  ] =
    useState(null);


  async function loadExecutionLogs(
    automationId
  ) {

    try {

      console.log(
        "Loading logs for automation:",
        automationId
      );

      setLoading(true);

      setSelectedWorkflowId(
        automationId
      );

      const data =
        await getExecutionLogs(
          automationId
        );

      console.log(
        "Execution logs received:",
        data
      );

      setLogs(data);

    } catch (error) {

      console.error(
        "Execution log error:",
        error
      );

      setLogs([]);

      alert(
        "Failed to load execution logs."
      );

    } finally {

      setLoading(false);

    }

  }


  function clearExecutionLogs() {

    setLogs([]);

    setSelectedWorkflowId(null);

  }


  return {

    logs,

    loading,

    selectedWorkflowId,

    loadExecutionLogs,

    clearExecutionLogs

  };

}


export default useExecutionLogs;