import WorkflowCard from "./WorkflowCard";

function WorkflowGrid({
  loading,
  workflows,
  prettyTrigger,
  prettyAction
}) {

  if (loading) {

    return (
      <div className="loading">
        Loading workflows...
      </div>
    );

  }


  return (

    <div className="workflow-grid">

      {
        workflows.map((workflow) => (

          <WorkflowCard

            key={
              workflow.automation_id
            }

            workflow={workflow}

            prettyTrigger={
              prettyTrigger
            }

            prettyAction={
              prettyAction
            }

          />

        ))
      }

    </div>

  );

}


export default WorkflowGrid;