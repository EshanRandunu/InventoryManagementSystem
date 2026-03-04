import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --ink: #1a1a18; --ink-muted: #6a6a60; --ink-faint: #9a9a8a;
    --accent: #7a6a52; --accent-light: rgba(122,106,82,0.1);
    --border: rgba(0,0,0,0.08); --border-strong: rgba(0,0,0,0.15);
    --card: rgba(255,255,255,0.72); --danger: #c0392b;
    --font-display: 'DM Serif Display', serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); }

  .uu-root {
    min-height: 100vh; background: var(--bg); font-family: var(--font-body);
    display: flex; flex-direction: column; padding: 0 2rem; position: relative; overflow-x: hidden;
  }
  .uu-root::before {
    content: ''; position: fixed; top: -20%; right: -8%; width: 450px; height: 450px;
    border-radius: 50%; background: radial-gradient(circle, rgba(180,165,140,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .uu-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 2rem 0; border-bottom: 1px solid var(--border);
    animation: fadeDown 0.5s ease forwards;
  }
  .nav-brand { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: -0.02em; color: var(--ink); cursor: pointer; }
  .nav-brand span { font-style: italic; color: var(--accent); }
  .nav-btn {
    background: none; border: none; font-family: var(--font-body); font-size: 0.82rem;
    color: var(--ink-muted); cursor: pointer; padding: 0.4rem 0.8rem; border-radius: 6px; transition: all 0.2s;
  }
  .nav-btn:hover { color: var(--ink); background: rgba(0,0,0,0.04); }

  .uu-content {
    flex: 1; display: flex; align-items: flex-start; gap: 4rem;
    padding: 3.5rem 0 2rem; position: relative; z-index: 1;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .uu-left { flex-shrink: 0; width: 240px; }
  .page-label {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.6rem;
  }
  .page-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--accent); }
  .page-title {
    font-family: var(--font-display); font-size: 2.6rem; letter-spacing: -0.03em;
    color: var(--ink); line-height: 1.08; margin-bottom: 1.2rem;
  }
  .page-title em { font-style: italic; color: var(--accent); }
  .page-desc { font-size: 0.85rem; font-weight: 300; color: var(--ink-muted); line-height: 1.7; }

  /* Avatar in sidebar */
  .sidebar-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #c8b89a 0%, #a08870 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 1.6rem; color: white;
    margin-top: 2rem; border: 3px solid rgba(255,255,255,0.8);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .sidebar-user-name {
    font-family: var(--font-display); font-size: 1rem; letter-spacing: -0.02em;
    color: var(--ink); margin-top: 0.85rem;
  }
  .sidebar-user-id { font-size: 0.73rem; color: var(--ink-faint); margin-top: 0.2rem; font-family: 'Courier New', monospace; }

  .uu-right { flex: 1; max-width: 480px; }

  .form-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    backdrop-filter: blur(12px); padding: 2.2rem; margin-bottom: 1rem;
  }
  .form-card-title {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-faint); margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);
  }

  .form-group { margin-bottom: 1.1rem; }
  .form-group:last-child { margin-bottom: 0; }
  .form-label {
    display: block; font-size: 0.73rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--ink-muted); margin-bottom: 0.45rem;
  }
  .form-input {
    width: 100%; background: rgba(255,255,255,0.65); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 0.78rem 1rem; font-family: var(--font-body); font-size: 0.9rem;
    color: var(--ink); outline: none; transition: all 0.2s;
  }
  .form-input::placeholder { color: var(--ink-faint); }
  .form-input:focus {
    border-color: var(--accent); background: rgba(255,255,255,0.92);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .form-actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn-submit {
    background: var(--ink); color: var(--bg); border: none; font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 500; padding: 0.88rem 2rem; cursor: pointer;
    border-radius: 8px; transition: all 0.22s;
  }
  .btn-submit:hover { background: #2e2e2a; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.13); }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-cancel {
    background: none; color: var(--ink-muted); border: 1.5px solid var(--border);
    font-family: var(--font-body); font-size: 0.88rem; padding: 0.85rem 1.4rem;
    cursor: pointer; border-radius: 8px; transition: all 0.2s;
  }
  .btn-cancel:hover { border-color: var(--border-strong); color: var(--ink); }

  .error-msg {
    background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.2); border-radius: 8px;
    padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--danger); margin-bottom: 1rem;
  }

  .di-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; font-size: 0.9rem; color: var(--ink-faint); gap: 0.75rem;
  }
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.1); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  .uu-footer {
    padding: 2rem 0; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }
  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
    } catch {
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      await axios.put(`http://localhost:8080/user/${id}`, user);
      navigate("/userProfile");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = user.userName ? user.userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="di-loading"><div className="spinner" /><span>Loading…</span></div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="uu-root">
        <nav className="uu-nav">
          <div className="nav-brand" onClick={() => navigate("/")}>Items<span>Hub</span></div>
          <button className="nav-btn" onClick={() => navigate("/userProfile")}>← Profile</button>
        </nav>

        <main className="uu-content">
          <aside className="uu-left">
            <p className="page-label">Account</p>
            <h1 className="page-title">Edit <em>profile</em></h1>
            <p className="page-desc">Update your personal information below.</p>
            <div className="sidebar-avatar">{initials}</div>
            <p className="sidebar-user-name">{user.userName || "—"}</p>
            <p className="sidebar-user-id">ID #{id}</p>
          </aside>

          <div className="uu-right">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-card">
                <p className="form-card-title">Personal Details</p>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" name="userName"
                    placeholder="Full name" value={user.userName || ""} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" name="email"
                    placeholder="Email" value={user.email || ""} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" name="phone"
                    placeholder="Phone" value={user.phone || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="form-card">
                <p className="form-card-title">Security</p>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" name="password"
                    placeholder="Leave blank to keep current" value={user.password || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-submit" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button className="btn-cancel" type="button" onClick={() => navigate("/userProfile")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="uu-footer">
          <span className="footer-text">© 2025 ItemsHub</span>
          <span className="footer-text">v1.0.0</span>
        </footer>
      </div>
    </>
  );
}

export default UpdateUser;
