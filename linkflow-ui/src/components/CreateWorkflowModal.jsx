function CreateWorkflowModal({
  creating,
  name,
  setName,
  trigger,
  setTrigger,
  action,
  setAction,

  firstName,
  setFirstName,

  lastName,
  setLastName,

  company,
  setCompany,

  email,
  setEmail,

  phone,
  setPhone,

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

            <option
              value="LINKEDIN_CONNECTION_ACCEPTED"
            >
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

            <option
              value="SALESFORCE_CREATE_LEAD"
            >
              Salesforce Create Lead
            </option>

          </select>

        </div>

        {action === "SALESFORCE_CREATE_LEAD" && (

          <>

            <div className="form-group">

              <label>Lead First Name</label>

              <input
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Lead Last Name</label>

              <input
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Company</label>

              <input
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Email</label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Phone</label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

            </div>

          </>

        )}

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