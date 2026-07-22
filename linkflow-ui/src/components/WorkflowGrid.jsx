import WorkflowCard from "./WorkflowCard";

function WorkflowGrid({
  loading,
  workflows,
  prettyTrigger,
  prettyAction,
  onDelete,
  onEdit
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

            onDelete={
              onDelete
            }

            onEdit={
              onEdit
            }

          />

        ))
      }

    </div>

  );

}

export default WorkflowGrid;