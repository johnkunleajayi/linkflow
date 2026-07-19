import { useMemo } from "react";


function useWorkflowSearch(
  workflows,
  search
) {

  const filteredWorkflows = useMemo(() => {

    return workflows.filter((workflow) =>

      workflow.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  }, [
    workflows,
    search
  ]);


  return filteredWorkflows;

}


export default useWorkflowSearch;