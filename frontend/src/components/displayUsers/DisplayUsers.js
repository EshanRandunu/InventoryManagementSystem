import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --ink: #1a1a18; --ink-muted: #6a6a60; --ink-faint: #9a9a8a;
    --accent: #7a6a52; --accent-light: rgba(122,106,82,0.1);
    --border: rgba(0,0,0,0.08); --border-strong: rgba(0,0,0,0.15);
    --card: rgba(255,255,255,0.7); --danger: #c0392b; --danger-bg: rgba(192,57,43,0.07);
    --font-display: 'DM Serif Display', serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); }

  .du-root {
    min-height: 100vh; background: var(--bg); font-family: var(--font-body);
    display: flex; flex-direction: column; padding: 0 2rem; position: relative; overflow-x: hidden;
  }
  .du-root::before {
    content: ''; position: fixed; top: -20%; right: -8%; width: 450px; height: 450px;
    border-radius: 50%; background: radial-gradient(circle, rgba(180,165,140,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .du-nav {
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

  .du-content {
    flex: 1; padding: 3rem 0 2rem; position: relative; z-index: 1;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .du-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 2.5rem; gap: 1.5rem; flex-wrap: wrap;
  }

  .page-label {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.6rem;
  }
  .page-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--accent); }
  .page-title {
    font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    letter-spacing: -0.03em; color: var(--ink); line-height: 1.1;
  }
  .page-title em { font-style: italic; color: var(--accent); }

  .search-wrap { position: relative; }
  .search-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: var(--ink-faint); font-size: 0.95rem; pointer-events: none;
  }
  .search-input {
    background: rgba(255,255,255,0.65); border: 1.5px solid var(--border); border-radius: 8px;
    padding: 0.65rem 1rem 0.65rem 2.4rem; font-family: var(--font-body); font-size: 0.85rem;
    color: var(--ink); width: 280px; outline: none; transition: all 0.2s; backdrop-filter: blur(8px);
  }
  .search-input::placeholder { color: var(--ink-faint); }
  .search-input:focus {
    border-color: var(--accent); background: rgba(255,255,255,0.9);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  /* User grid layout */
  .users-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;
  }

  .user-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px;
    backdrop-filter: blur(12px); padding: 1.5rem; transition: all 0.2s; position: relative;
    animation: fadeUp 0.5s ease both;
  }
  .user-card:hover {
    border-color: var(--border-strong); transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.07);
  }

  .user-card-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }

  .user-avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #c8b89a 0%, #a08870 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 1.2rem; color: white;
    border: 2px solid rgba(255,255,255,0.7);
  }

  .user-name {
    font-family: var(--font-display); font-size: 1.05rem; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 0.15rem;
  }
  .user-id-badge {
    font-family: 'Courier New', monospace; font-size: 0.7rem; color: var(--ink-faint);
    background: rgba(0,0,0,0.04); padding: 0.15rem 0.45rem; border-radius: 4px; display: inline-block;
  }

  .user-email {
    font-size: 0.83rem; color: var(--ink-muted); font-weight: 300;
    padding: 0.65rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    margin-bottom: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .user-actions { display: flex; gap: 0.5rem; }

  .btn-edit {
    background: none; border: 1.5px solid var(--border); color: var(--ink-muted);
    font-family: var(--font-body); font-size: 0.78rem; font-weight: 500;
    padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer; transition: all 0.2s;
    flex: 1; text-align: center;
  }
  .btn-edit:hover { border-color: var(--ink); color: var(--ink); }

  .btn-del {
    background: none; border: 1.5px solid rgba(192,57,43,0.18); color: var(--danger);
    font-family: var(--font-body); font-size: 0.78rem; font-weight: 500;
    padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer; transition: all 0.2s;
    flex: 1; text-align: center;
  }
  .btn-del:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* Empty / loading states */
  .du-empty {
    text-align: center; padding: 5rem 2rem; color: var(--ink-faint);
  }
  .du-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.35; }
  .du-empty p { font-size: 0.9rem; font-weight: 300; }

  .di-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; font-size: 0.9rem; color: var(--ink-faint); gap: 0.75rem;
  }
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.1); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  .du-footer {
    padding: 2rem 0; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }
  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }
  .count-badge {
    font-size: 0.75rem; color: var(--ink-muted); background: rgba(0,0,0,0.05);
    padding: 0.3rem 0.75rem; border-radius: 100px;
  }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function DisplayUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/users");
      setUsers(response.data);
      setError(null);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:8080/user/${id}`);
      loadUsers();
    }
  };

  const filtered = users.filter((u) =>
    u.id.toString().includes(searchTerm) ||
    u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) =>
    name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="di-loading"><div className="spinner" /><span>Loading users…</span></div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="di-loading" style={{ color: "#c0392b" }}>⚠ {error}</div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="du-root">
        <nav className="du-nav">
          <div className="nav-brand" onClick={() => window.location.href = "/"}>Items<span>Hub</span></div>
          <button className="nav-btn" onClick={() => window.location.href = "/"}>← Home</button>
        </nav>

        <main className="du-content">
          <div className="du-header">
            <div>
              <p className="page-label">Administration</p>
              <h1 className="page-title">All <em>Users</em></h1>
            </div>
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by ID, name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="du-empty">
              <div className="du-empty-icon">◻</div>
              <p>{searchTerm ? "No users match your search." : "No users found."}</p>
            </div>
          ) : (
            <div className="users-grid">
              {filtered.map((user, i) => (
                <div className="user-card" key={user.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="user-card-top">
                    <div className="user-avatar">{getInitials(user.userName)}</div>
                    <div>
                      <p className="user-name">{user.userName}</p>
                      <span className="user-id-badge">#{user.id}</span>
                    </div>
                  </div>
                  <p className="user-email">{user.email}</p>
                  <div className="user-actions">
                    <button className="btn-edit" onClick={() => window.location.href = `/updateUser/${user.id}`}>
                      Edit
                    </button>
                    <button className="btn-del" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="du-footer">
          <span className="footer-text">© 2025 ItemsHub</span>
          <span className="count-badge">{filtered.length} of {users.length} users</span>
        </footer>
      </div>
    </>
  );
}

export default DisplayUsers;
