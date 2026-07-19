function Stats({
  totalWorkflows,
  activeWorkflows,
  connections,
  executions,
}) {
  return (
    <section className="stats">

      <div className="stat-card">

        <small>Total Workflows</small>

        <h2>{totalWorkflows}</h2>

      </div>

      <div className="stat-card">

        <small>Active</small>

        <h2>{activeWorkflows}</h2>

      </div>

      <div className="stat-card">

        <small>Connections</small>

        <h2>{connections}</h2>

      </div>

      <div className="stat-card">

        <small>Executions</small>

        <h2>{executions}</h2>

      </div>

    </section>
  );
}

export default Stats;