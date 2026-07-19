function CreateWorkflowModal({
  creating,
  name,
  setName,
  trigger,
  setTrigger,
  action,
  setAction,
  onCancel,
  onCreate,
}) {
  return (
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
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            disabled={creating}
            onClick={onCreate}
          >
            {creating
              ? "Creating..."
              : "Create Workflow"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateWorkflowModal;