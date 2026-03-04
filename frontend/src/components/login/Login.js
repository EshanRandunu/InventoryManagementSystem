import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F5F0;
    --ink: #1a1a18;
    --ink-muted: #6a6a60;
    --ink-faint: #9a9a8a;
    --accent: #7a6a52;
    --accent-light: rgba(122,106,82,0.1);
    --border: rgba(0,0,0,0.08);
    --border-strong: rgba(0,0,0,0.15);
    --card: rgba(255,255,255,0.75);
    --danger: #c0392b;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); }

  .auth-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  /* Left decorative panel */
  .auth-panel {
    background: var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.8s ease forwards;
  }

  .auth-panel::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -20%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(122,106,82,0.3) 0%, transparent 65%);
    pointer-events: none;
  }

  .auth-panel::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -15%;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(122,106,82,0.15) 0%, transparent 65%);
    pointer-events: none;
  }

  .panel-brand {
    font-family: var(--font-display);
    font-size: 1.6rem;
    letter-spacing: -0.02em;
    color: #F7F5F0;
    position: relative;
    z-index: 1;
  }
  .panel-brand span { font-style: italic; color: #c8b89a; }

  .panel-body { position: relative; z-index: 1; }

  .panel-headline {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #F7F5F0;
    margin-bottom: 1.2rem;
  }

  .panel-headline em { font-style: italic; color: #c8b89a; }

  .panel-sub {
    font-size: 0.9rem;
    font-weight: 300;
    color: rgba(247,245,240,0.55);
    line-height: 1.6;
    max-width: 320px;
  }

  .panel-footer {
    position: relative;
    z-index: 1;
    font-size: 0.75rem;
    color: rgba(247,245,240,0.3);
    letter-spacing: 0.04em;
  }

  /* Right form panel */
  .auth-form-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    animation: fadeUp 0.7s ease 0.2s both;
  }

  .auth-form-wrap {
    width: 100%;
    max-width: 380px;
  }

  .auth-form-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .auth-form-label::before {
    content: ''; display: block;
    width: 20px; height: 1px; background: var(--accent);
  }

  .auth-form-title {
    font-family: var(--font-display);
    font-size: 2.4rem;
    letter-spacing: -0.03em;
    color: var(--ink);
    margin-bottom: 0.5rem;
    line-height: 1.1;
  }

  .auth-form-sub {
    font-size: 0.85rem;
    color: var(--ink-muted);
    font-weight: 300;
    margin-bottom: 2.5rem;
  }

  .form-group {
    margin-bottom: 1.1rem;
  }

  .form-label {
    display: block;
    font-size: 0.73rem;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 0.45rem;
  }

  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.65);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    padding: 0.8rem 1rem;
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--ink);
    outline: none;
    transition: all 0.2s;
    backdrop-filter: blur(8px);
  }

  .form-input::placeholder { color: var(--ink-faint); }

  .form-input:focus {
    border-color: var(--accent);
    background: rgba(255,255,255,0.92);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .btn-submit {
    width: 100%;
    background: var(--ink);
    color: var(--bg);
    border: none;
    font-family: var(--font-body);
    font-size: 0.92rem;
    font-weight: 500;
    padding: 0.95rem 2rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.22s;
    margin-top: 0.5rem;
    letter-spacing: 0.02em;
  }

  .btn-submit:hover {
    background: #2e2e2a;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  .btn-submit:active { transform: translateY(0); }

  .auth-switch {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.82rem;
    color: var(--ink-muted);
  }

  .auth-switch a {
    color: var(--accent);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .auth-switch a:hover { opacity: 0.7; }

  .error-msg {
    background: rgba(192,57,43,0.08);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: var(--danger);
    margin-bottom: 1.2rem;
    animation: fadeIn 0.3s ease;
  }

  @media (max-width: 700px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-panel { display: none; }
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login", user);
      if (response.status === 200 && response.data.id) {
        localStorage.setItem("userId", response.data.id);
        navigate("/userProfile");
      } else {
        setError(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        {/* Left panel */}
        <div className="auth-panel">
          <div className="panel-brand">Items<span>Hub</span></div>
          <div className="panel-body">
            <h2 className="panel-headline">
              Welcome<br /><em>back.</em>
            </h2>
            <p className="panel-sub">
              Sign in to manage your inventory, track items, and keep everything organized.
            </p>
          </div>
          <div className="panel-footer">© 2025 ItemsHub · All rights reserved</div>
        </div>

        {/* Right form */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <p className="auth-form-label">Sign In</p>
            <h1 className="auth-form-title">Log in</h1>
            <p className="auth-form-sub">Enter your credentials to continue.</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <a onClick={() => navigate("/register")}>Create one</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
