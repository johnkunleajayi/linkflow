import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/workflows/workspace/1"
      );

      const data = await response.json();

      console.log(data);

      setWorkflows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 LinkFlow</h1>

        <button className="primary-btn">
          + New Workflow
        </button>
      </header>

      <main className="content">
        <h2>My Workflows</h2>

        {loading ? (
          <p>Loading workflows...</p>
        ) : (
          <table className="workflow-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Trigger</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {workflows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">
                    No workflows found.
                  </td>
                </tr>
              ) : (
                workflows.map((workflow) => (
                  <tr key={workflow.automation_id}>
                    <td>{workflow.name}</td>

                    <td>{workflow.trigger}</td>

                    <td>{workflow.action}</td>

                    <td>
                      <span
                        className={
                          workflow.status === "ACTIVE"
                            ? "badge active"
                            : "badge disabled"
                        }
                      >
                        {workflow.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;