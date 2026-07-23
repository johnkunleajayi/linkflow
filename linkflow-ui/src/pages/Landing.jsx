import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="app">
      <h1>Welcome to LinkFlow</h1>
      <p>Automate your LinkedIn workflow.</p>

      <div style={{ marginTop: "24px" }}>
        <Link to="/login">
          <button className="primary-btn">Login</button>
        </Link>

        <Link to="/register" style={{ marginLeft: "12px" }}>
          <button className="secondary-btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}