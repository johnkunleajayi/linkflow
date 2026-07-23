function ExecutionLogsModal({

  logs,

  loading,

  onClose

}) {

  return (

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

                </tr>

              </thead>

              <tbody>

                {

                  logs.map((log) => (

                    <tr
                      key={log.id}
                    >

                      <td>

                        {log.status}

                      </td>

                      <td>

                        {log.event_type}

                      </td>

                      <td>

                        {

                          new Date(
                            log.executed_at
                          ).toLocaleString()

                        }

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

  );

}

export default ExecutionLogsModal;