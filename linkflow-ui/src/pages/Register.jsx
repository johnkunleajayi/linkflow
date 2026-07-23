import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";

export default function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleRegister(e) {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await registerUser({

        full_name: fullName,

        email,

        password

      });

      navigate("/login");

    }

    catch (err) {

      setError(

        err.response?.data?.detail ||

        "Registration failed"

      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <div className="app">

      <div className="modal">

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          <div className="form-group">

            <label>Full Name</label>

            <input

              value={fullName}

              onChange={(e) =>
                setFullName(e.target.value)
              }

            />

          </div>

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

          {

            error && (

              <p style={{ color: "red" }}>

                {error}

              </p>

            )

          }

          <button

            className="primary-btn"

            disabled={loading}

          >

            {

              loading

                ? "Creating..."

                : "Create Account"

            }

          </button>

        </form>

      </div>

    </div>

  );

}