import {
  useState
} from "react";

function ExecutionLogsModal({

  logs,

  loading,

  onClose

}) {

  const [

    selectedLog,

    setSelectedLog

  ] = useState(null);

  function formatStatus(status) {

    switch (status) {

      case "SUCCESS":
        return "status-badge success";

      case "FAILED":
        return "status-badge failed";

      case "SKIPPED":
        return "status-badge skipped";

      default:
        return "status-badge";

    }

  }

  function formatDate(date) {

    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  }

  function getExecutionResult() {

    return (
      selectedLog?.result?.results?.[0] || {}
    );

  }

  const execution =
    getExecutionResult();

  return (

    <>

      <div className="modal-overlay">

        <div className="modal">

          <h2>
            Execution Logs
          </h2>

          {

            loading ? (

              <p>
                Loading execution logs...
              </p>

            ) : logs.length === 0 ? (

              <p>
                No execution logs found.
              </p>

            ) : (

              <table
                className="logs-table"
              >

                <thead>

                  <tr>

                    <th>Status</th>

                    <th>Event</th>

                    <th>Executed At</th>

                    <th></th>

                  </tr>

                </thead>

                <tbody>

                  {

                    logs.map((log) => (

                      <tr
                        key={log.id}
                      >

                        <td>

                          <span
                            className={
                              formatStatus(
                                log.status
                              )
                            }
                          >

                            {log.status}

                          </span>

                        </td>

                        <td>

                          {log.event_type}

                        </td>

                        <td>

                          {

                            formatDate(
                              log.executed_at
                            )

                          }

                        </td>

                        <td>

                          <button

                            className="secondary-btn"

                            onClick={() =>
                              setSelectedLog(log)
                            }

                          >

                            View Details

                          </button>

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            )

          }

          <div
            className="modal-buttons"
          >

            <button

              className="primary-btn"

              onClick={onClose}

            >

              Close

            </button>

          </div>

        </div>

      </div>

      {

        selectedLog && (

          <div className="modal-overlay">

            <div className="modal">

              <h2>

                Execution Details

              </h2>

              <div className="form-group">

                <label>Status</label>

                <span
                  className={
                    formatStatus(
                      selectedLog.status
                    )
                  }
                >

                  {selectedLog.status}

                </span>

              </div>

              <div className="form-group">

                <label>Automation</label>

                <p>

                  {
                    selectedLog.result
                      ?.automation_name ||
                    "N/A"
                  }

                </p>

              </div>

              <div className="form-group">

                <label>Execution Mode</label>

                <p>

                  {

                    execution.mode ||
                    "N/A"

                  }

                </p>

              </div>

              <div className="form-group">

                <label>HTTP Status</label>

                <p>

                  {

                    execution.status_code ??
                    "N/A"

                  }

                </p>

              </div>

              <div className="form-group">

                <label>Lead ID</label>

                <p>

                  {

                    execution.lead_id ||
                    "Not Available"

                  }

                </p>

              </div>

              <div className="form-group">

                <label>Message</label>

                <p>

                  {

                    execution.message ||
                    "No message"

                  }

                </p>

              </div>

              <div className="form-group">

                <label>Executed At</label>

                <p>

                  {

                    formatDate(
                      selectedLog.executed_at
                    )

                  }

                </p>

              </div>

              <div className="form-group">

                <label>Raw Response</label>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowX: "auto",
                    background: "#f8fafc",
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "13px"
                  }}
                >

                  {

                    JSON.stringify(
                      selectedLog.result,
                      null,
                      2
                    )

                  }

                </pre>

              </div>

              <div className="modal-buttons">

                <button

                  className="primary-btn"

                  onClick={() =>
                    setSelectedLog(null)
                  }

                >

                  Close

                </button>

              </div>

            </div>

          </div>

        )

      }

    </>

  );

}

export default ExecutionLogsModal;