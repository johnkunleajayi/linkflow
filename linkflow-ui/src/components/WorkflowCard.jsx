function WorkflowCard({
  workflow,
  prettyTrigger,
  prettyAction,
  onEdit,
  onDelete,
  onViewLogs
}) {

  async function handleDelete() {

    const confirmed = window.confirm(

      `Delete workflow "${workflow.name}"?`

    );

    if (!confirmed) {

      return;

    }

    await onDelete(
      workflow.automation_id
    );

  }

  function handleEdit() {

    onEdit(workflow);

  }

  function handleViewLogs() {

    if (onViewLogs) {

      onViewLogs(workflow);

    }

  }

  return (

    <div className="workflow-card">

      <div className="workflow-header">

        <div>

          <h3>{workflow.name}</h3>

          <span
            className={
              workflow.status === "ACTIVE"
                ? "badge active"
                : "badge disabled"
            }
          >
            {workflow.status}
          </span>

        </div>

        <button className="menu-btn">
          ⋯
        </button>

      </div>

      <div className="workflow-info">

        <div>

          <small>Trigger</small>

          <strong>
            {prettyTrigger(workflow.trigger)}
          </strong>

        </div>

        <div>

          <small>Action</small>

          <strong>
            {prettyAction(workflow.action)}
          </strong>

        </div>

      </div>

      <div className="workflow-actions">

        <button
          className="secondary-btn"
          onClick={handleEdit}
        >
          Edit
        </button>

        <button
          className="secondary-btn"
          onClick={handleViewLogs}
        >
          View Logs
        </button>

        <button
          className="danger-btn"
          onClick={handleDelete}
        >
          Delete
        </button>

      </div>

    </div>

  );

}

export default WorkflowCard;