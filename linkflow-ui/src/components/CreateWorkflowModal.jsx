function CreateWorkflowModal({
  creating,
  editingWorkflow,

  name,
  setName,

  trigger,
  setTrigger,

  action,
  setAction,

  keyword,
  setKeyword,

  replyMessage,
  setReplyMessage,

  onCancel,
  onCreate,
}) {

  const isEditing =
    editingWorkflow !== null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>
          {
            isEditing
              ? "Edit Workflow"
              : "Create Workflow"
          }
        </h2>

        <div className="form-group">

          <label>Workflow Name</label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Welcome New Connections"
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

            <option value="LINKEDIN_COMMENT">
              LinkedIn Comment
            </option>

            <option value="LINKEDIN_CONNECTION_ACCEPTED">
              LinkedIn Connection Accepted
            </option>

          </select>

        </div>

        {
          trigger === "LINKEDIN_COMMENT" && (

            <div className="form-group">

              <label>Keyword</label>

              <input
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
                placeholder="ebook"
              />

            </div>

          )
        }

        <div className="form-group">

          <label>Action</label>

          <select
            value={action}
            onChange={(e) =>
              setAction(e.target.value)
            }
          >

            <option value="linkedin.reply">
                Reply to Comment
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Reply Message</label>

          <textarea
            rows={6}
            value={replyMessage}
            onChange={(e) =>
              setReplyMessage(
                e.target.value
              )
            }
            placeholder="Hi 👋 Thanks for your comment. Check your inbox for the guide."
          />

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

            {
              creating
                ? (
                    isEditing
                      ? "Saving..."
                      : "Creating..."
                  )
                : (
                    isEditing
                      ? "Save Changes"
                      : "Create Workflow"
                  )
            }

          </button>

        </div>

      </div>

    </div>

  );

}

export default CreateWorkflowModal;