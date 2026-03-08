import React, { useEffect, useState } from "react";
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
    --card: rgba(255,255,255,0.7);
    --danger: #c0392b;
    --danger-bg: rgba(192,57,43,0.07);
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); }

  .up-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    position: relative;
  }

  .up-root::before {
    content: '';
    position: fixed;
    top: -25%;
    right: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,165,140,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .up-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;
    border-bottom: 1px solid var(--border);
    animation: fadeDown 0.5s ease forwards;
  }

  .nav-brand {
    font-family: var(--font-display);
    font-size: 1.4rem;
    letter-spacing: -0.02em;
    color: var(--ink);
    cursor: pointer;
  }
  .nav-brand span { font-style: italic; color: var(--accent); }

  .nav-btn {
    background: none; border: none;
    font-family: var(--font-body);
    font-size: 0.82rem; color: var(--ink-muted);
    cursor: pointer; padding: 0.4rem 0.8rem;
    border-radius: 6px; transition: all 0.2s;
  }
  .nav-btn:hover { color: var(--ink); background: rgba(0,0,0,0.04); }

  .up-content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: 3rem;
    padding: 4rem 0 2rem;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  /* Left panel */
  .up-left {
    flex-shrink: 0;
    width: 220px;
  }

  .page-label {
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
  .page-label::before {
    content: ''; display: block;
    width: 20px; height: 1px;
    background: var(--accent);
  }

  .page-title {
    font-family: var(--font-display);
    font-size: 2.4rem;
    letter-spacing: -0.03em;
    color: var(--ink);
    line-height: 1.1;
    margin-bottom: 2rem;
  }
  .page-title em { font-style: italic; color: var(--accent); }

  /* Avatar */
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8b89a 0%, #a08870 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 2rem;
    color: white;
    margin-bottom: 1.2rem;
    border: 3px solid rgba(255,255,255,0.8);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }

  .avatar-name {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 0.25rem;
  }

  .avatar-role {
    font-size: 0.75rem;
    color: var(--ink-faint);
    letter-spacing: 0.05em;
  }

  /* Right panel */
  .up-right { flex: 1; }

  .profile-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .profile-card-title {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .profile-field {
    display: flex;
    align-items: baseline;
    padding: 0.9rem 0;
    border-bottom: 1px solid var(--border);
    gap: 1.5rem;
  }

  .profile-field:last-child { border-bottom: none; }

  .field-label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    width: 90px;
    flex-shrink: 0;
  }

  .field-value {
    font-size: 0.95rem;
    color: var(--ink);
    font-weight: 400;
  }

  /* Actions card */
  .actions-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    padding: 1.5rem 2rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .btn-secondary {
    background: none; color: var(--ink);
    border: 1.5px solid var(--border-strong);
    font-family: var(--font-body); font-size: 0.88rem; font-weight: 400;
    padding: 0.75rem 1.5rem; cursor: pointer; border-radius: 8px;
    transition: all 0.22s; display: inline-flex; align-items: center; gap: 0.4rem;
  }
  .btn-secondary:hover {
    background: rgba(0,0,0,0.04); border-color: var(--ink); transform: translateY(-1px);
  }

  .btn-danger {
    background: var(--danger-bg); color: var(--danger);
    border: 1.5px solid rgba(192,57,43,0.2);
    font-family: var(--font-body); font-size: 0.88rem; font-weight: 500;
    padding: 0.75rem 1.5rem; cursor: pointer; border-radius: 8px;
    transition: all 0.22s; display: inline-flex; align-items: center; gap: 0.4rem;
    margin-left: auto;
  }
  .btn-danger:hover {
    background: var(--danger); color: white; border-color: var(--danger);
    transform: translateY(-1px); box-shadow: 0 6px 18px rgba(192,57,43,0.2);
  }

  .up-footer {
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }
  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }

  .di-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; font-size: 0.9rem; color: var(--ink-faint); gap: 0.75rem;
  }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,0.1); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); navigate("/login"); return; }
    loadUser(userId);
  }, [navigate]);

  const loadUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(response.data);
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  const deleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete(`http://localhost:8080/user/${user.id}`);
        localStorage.removeItem("userId");
        navigate("/login");
      } catch (err) {
        alert("Failed to delete account");
      }
    }
  };

  if (!user) return (
    <>
      <style>{styles}</style>
      <div className="di-loading"><div className="spinner" /><span>Loading profile…</span></div>
    </>
  );

  const initials = user.userName ? user.userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <>
      <style>{styles}</style>
      <div className="up-root">
        <nav className="up-nav">
          <div className="nav-brand" onClick={() => navigate("/")}>Items<span>Hub</span></div>
          <button className="nav-btn" onClick={() => navigate("/")}>← Home</button>
        </nav>

        <main className="up-content">
          {/* Left */}
          <aside className="up-left">
            <p className="page-label">Account</p>
            <h1 className="page-title">My <em>Profile</em></h1>
            <div className="avatar">{initials}</div>
            <p className="avatar-name">{user.userName}</p>
            <p className="avatar-role">Member</p>
          </aside>

          {/* Right */}
          <div className="up-right">
            <div className="profile-card">
              <p className="profile-card-title">Personal Information</p>
              <div className="profile-field">
                <span className="field-label">Name</span>
                <span className="field-value">{user.userName}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Email</span>
                <span className="field-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Phone</span>
                <span className="field-value">{user.phone}</span>
              </div>
            </div>

            <div className="actions-card">
              <button className="btn-secondary" onClick={() => navigate("/updateUser/" + user.id)}>
                ✎ Edit Profile
              </button>
              <button className="btn-danger" onClick={deleteUser}>
                ✕ Delete Account
              </button>
            </div>
          </div>
        </main>

        <footer className="up-footer">
          <span className="footer-text">© 2025 Elygon</span>
          <span className="footer-text">v1.0.0</span>
        </footer>
      </div>
    </>
  );
}

export default UserProfile;
