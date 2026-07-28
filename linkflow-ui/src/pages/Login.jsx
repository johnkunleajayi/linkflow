import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import apiClient from "../api/apiClient";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const data = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      const workspaces =
        await apiClient(
          "/workspaces",
          {
            headers: {
              Authorization:
                `Bearer ${data.access_token}`
            }
          }
        );

      if (workspaces.length === 0) {

        localStorage.removeItem("workspace");
        localStorage.removeItem("linkflow_session");

        navigate("/workspace");

        return;

      }

      const workspace = workspaces[0];

      localStorage.setItem(
        "workspace",
        JSON.stringify(workspace)
      );

      // Session object for future integrations
      localStorage.setItem(
        "linkflow_session",
        JSON.stringify({
          token: data.access_token,
          workspace_id: workspace.id,
          workspace_name: workspace.name
        })
      );

      navigate("/dashboard");

    }

    catch (err) {

      setError(
        err.message ||
        "Login failed"
      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <div className="app">

      <div className="modal">

        <h2>Login</h2>

        <form
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {error && (

            <p
              style={{
                color: "red"
              }}
            >
              {error}
            </p>

          )}

          <button
            className="primary-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>

  );

}