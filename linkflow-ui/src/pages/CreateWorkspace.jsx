import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function CreateWorkspace() {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleCreate(e) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "access_token"
        );

      const workspace =
        await apiClient(

          "/workspaces",

          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

            body: JSON.stringify({

              name,

            }),

          }

        );

      localStorage.setItem(

        "workspace",

        JSON.stringify(workspace)

      );

      navigate("/dashboard");

    }

    catch (err) {

      console.error(err);

      setError(err.message);

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <div className="auth-page">

      <form

        className="auth-card"

        onSubmit={handleCreate}

      >

        <h1>
          Create Workspace
        </h1>

        <input

          type="text"

          placeholder="Workspace Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }

          required

        />

        {

          error && (

            <p className="error">

              {error}

            </p>

          )

        }

        <button

          type="submit"

          className="primary-btn"

          disabled={loading}

        >

          {

            loading

              ? "Creating..."

              : "Create Workspace"

          }

        </button>

      </form>

    </div>

  );

}

export default CreateWorkspace;