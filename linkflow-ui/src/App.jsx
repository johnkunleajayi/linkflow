import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("LINKEDIN_CONNECTION_ACCEPTED");
  const [action, setAction] = useState("SALESFORCE_CREATE_LEAD");

  useEffect(() => {
    loadWorkflows();
  }, []);

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

  async function createWorkflow() {
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
        throw new Error("Unable to create workflow.");
      }

      setName("");
      setTrigger("LINKEDIN_CONNECTION_ACCEPTED");
      setAction("SALESFORCE_CREATE_LEAD");

      setShowModal(false);

      await loadWorkflows();
    } catch (error) {
      console.error(error);
      alert("Failed to create workflow.");
    } finally {
      setCreating(false);
    }
  }

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [workflows, search]);

  function prettyTrigger(trigger) {
    switch (trigger) {
      case "LINKEDIN_CONNECTION_ACCEPTED":
        return "LinkedIn Connection Accepted";

      default:
        return trigger;
    }
  }

  function prettyAction(action) {
    switch (action) {
      case "SALESFORCE_CREATE_LEAD":
        return "Create Salesforce Lead";

      default:
        return action;
    }
  }

  const activeCount = workflows.filter(
    (x) => x.status === "ACTIVE"
  ).length;

  return (
    <div className="app">

      <section className="hero">

        <div>

          <span className="hero-badge">
            🚀 LINKFLOW
          </span>

          <h1>
            Build automations that work while you sleep.
          </h1>

          <p>
            Connect LinkedIn, Salesforce, HubSpot,
            Gmail and more without writing code.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + New Workflow
        </button>

      </section>

      <section className="stats">

        <div className="stat-card">

          <small>Total Workflows</small>

          <h2>{workflows.length}</h2>

        </div>

        <div className="stat-card">

          <small>Active</small>

          <h2>{activeCount}</h2>

        </div>

        <div className="stat-card">

          <small>Connections</small>

          <h2>2</h2>

        </div>

        <div className="stat-card">

          <small>Executions</small>

          <h2>283</h2>

        </div>

      </section>

      <section className="toolbar">

        <div>

          <h2>My Workflows</h2>

          <p>
            Manage every automation from one place.
          </p>

        </div>

        <input
          className="search-box"
          placeholder="Search workflow..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </section>

      {loading ? (

        <div className="loading">

          Loading workflows...

        </div>

      ) : (

        <div className="workflow-grid">

          {filteredWorkflows.map((workflow) => (

            <div
              key={workflow.automation_id}
              className="workflow-card"
            >

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

                <button className="secondary-btn">
                  Edit
                </button>

                <button className="danger-btn">
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Create Workflow</h2>

            <div className="form-group">

              <label>Name</label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Trigger</label>

              <select
                value={trigger}
                onChange={(e) =>
                  setTrigger(e.target.value)
                }
              >
                <option value="LINKEDIN_CONNECTION_ACCEPTED">
                  LinkedIn Connection Accepted
                </option>
              </select>

            </div>

            <div className="form-group">

              <label>Action</label>

              <select
                value={action}
                onChange={(e) =>
                  setAction(e.target.value)
                }
              >
                <option value="SALESFORCE_CREATE_LEAD">
                  Salesforce Create Lead
                </option>
              </select>

            </div>

            <div className="modal-buttons">

              <button
                className="secondary-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                disabled={creating}
                onClick={createWorkflow}
              >
                {creating
                  ? "Creating..."
                  : "Create Workflow"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;