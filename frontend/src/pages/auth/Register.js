import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../../api/usersApi";

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

  .reg-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  /* Right decorative panel (reversed layout vs Login) */
  .reg-deco {
    order: 2;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.8s ease forwards;
  }

  .reg-deco::before {
    content: '';
    position: absolute;
    bottom: -25%;
    right: -15%;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(122,106,82,0.28) 0%, transparent 65%);
    pointer-events: none;
  }

  .panel-brand {
    font-family: var(--font-display);
    font-size: 1.6rem;
    letter-spacing: -0.02em;
    color: #F7F5F0;
    position: relative; z-index: 1;
  }
  .panel-brand span { font-style: italic; color: #c8b89a; }

  .panel-body { position: relative; z-index: 1; }

  .panel-headline {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.5vw, 3rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #F7F5F0;
    margin-bottom: 1.2rem;
  }
  .panel-headline em { font-style: italic; color: #c8b89a; }

  .panel-sub {
    font-size: 0.88rem;
    font-weight: 300;
    color: rgba(247,245,240,0.5);
    line-height: 1.65;
    max-width: 300px;
  }

  .panel-steps {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-top: 2rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    font-size: 0.82rem;
    color: rgba(247,245,240,0.5);
    font-weight: 300;
  }

  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(247,245,240,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    color: #c8b89a;
    flex-shrink: 0;
  }

  .panel-footer {
    position: relative; z-index: 1;
    font-size: 0.75rem;
    color: rgba(247,245,240,0.25);
    letter-spacing: 0.04em;
  }

  /* Left form side */
  .reg-form-side {
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    animation: fadeUp 0.7s ease 0.15s both;
  }

  .reg-form-wrap {
    width: 100%;
    max-width: 400px;
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
    margin-bottom: 2.2rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  .form-group { margin-bottom: 1rem; }

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
    background: rgba(255,255,255,0.9);
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

  .auth-switch button {
    background: none;
    border: 0;
    padding: 0;
    color: var(--accent);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
  }

  .auth-switch button:hover { opacity: 0.7; }

  .error-msg {
    background: rgba(192,57,43,0.08);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: var(--danger);
    margin-bottom: 1.2rem;
  }

  .success-msg {
    background: rgba(46,125,82,0.08);
    border: 1px solid rgba(46,125,82,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.82rem;
    color: #2e7d52;
    margin-bottom: 1.2rem;
  }

  @media (max-width: 700px) {
    .reg-root { grid-template-columns: 1fr; }
    .reg-deco { display: none; }
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await usersApi.create(user);
      setSuccess("Account created! Redirecting to sign in…");
      setTimeout(() => navigate("/signin"), 1500);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        {/* Left: Form */}
        <div className="reg-form-side">
          <div className="reg-form-wrap">
            <p className="auth-form-label">Create Account</p>
            <h1 className="auth-form-title">Register</h1>
            <p className="auth-form-sub">Fill in your details to get started.</p>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  type="text"
                  name="userName"
                  placeholder="John Doe"
                  value={user.userName}
                  onChange={onInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={user.email}
                  onChange={onInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    placeholder="+1 234 567"
                    value={user.phone}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create account →"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/signin")}>Sign in</button>
            </p>
          </div>
        </div>

        {/* Right: Deco */}
        <div className="reg-deco">
          <div className="panel-brand">Items<span>Hub</span></div>
          <div className="panel-body">
            <h2 className="panel-headline">
              Start <em>managing</em><br />your inventory.
            </h2>
            <p className="panel-sub">Join ItemsHub to track, organize and manage your items effortlessly.</p>
            <ul className="panel-steps">
              <li className="step"><span className="step-num">1</span> Create your free account</li>
              <li className="step"><span className="step-num">2</span> Add and organize items</li>
              <li className="step"><span className="step-num">3</span> Export reports anytime</li>
            </ul>
          </div>
          <div className="panel-footer">© 2025 ItemsHub · All rights reserved</div>
        </div>
      </div>
    </>
  );
}

export default Register;
