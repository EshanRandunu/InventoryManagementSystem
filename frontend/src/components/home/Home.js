import React, { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    min-height: 100vh;
    background: #F7F5F0;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    position: relative;
    overflow: hidden;
  }

  .home-root::before {
    content: '';
    position: fixed;
    top: -30%;
    right: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,165,140,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .home-root::after {
    content: '';
    position: fixed;
    bottom: -20%;
    left: -5%;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100,120,100,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    opacity: 0;
    animation: fadeDown 0.6s ease forwards;
  }

  .nav-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
    color: #1a1a18;
    cursor: pointer;
  }

  .nav-brand span {
    font-style: italic;
    color: #7a6a52;
  }

  .nav-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-ghost {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    color: #5a5a52;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }

  .btn-ghost:hover {
    color: #1a1a18;
    background: rgba(0,0,0,0.04);
  }

  .btn-outlined {
    background: none;
    border: 1.5px solid #1a1a18;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #1a1a18;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }

  .btn-outlined:hover {
    background: #1a1a18;
    color: #F7F5F0;
  }

  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 680px;
    padding: 5rem 0 3rem;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.2s forwards;
  }

  .hero-label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9a8a72;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .hero-label::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: #9a8a72;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.8rem, 5vw, 4.5rem);
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #1a1a18;
    margin-bottom: 1.5rem;
  }

  .hero-title em {
    font-style: italic;
    color: #7a6a52;
  }

  .hero-subtitle {
    font-size: 1rem;
    font-weight: 300;
    color: #6a6a60;
    line-height: 1.7;
    max-width: 440px;
    margin-bottom: 3rem;
  }

  .primary-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 4rem;
  }

  .btn-primary {
    background: #1a1a18;
    color: #F7F5F0;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.85rem 2rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover {
    background: #2e2e2a;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: none;
    color: #1a1a18;
    border: 1.5px solid rgba(0,0,0,0.15);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    padding: 0.85rem 2rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }

  .btn-secondary:hover {
    border-color: #1a1a18;
    background: rgba(0,0,0,0.03);
    transform: translateY(-1px);
  }

  .divider {
    width: 100%;
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin-bottom: 2rem;
  }

  .quick-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.4s forwards;
  }

  .quick-link {
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(0,0,0,0.07);
    color: #4a4a42;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    border-radius: 100px;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }

  .quick-link:hover {
    background: rgba(255,255,255,0.9);
    border-color: rgba(0,0,0,0.15);
    color: #1a1a18;
  }

  .footer {
    padding: 2rem 0;
    border-top: 1px solid rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.6s forwards;
  }

  .footer-text {
    font-size: 0.75rem;
    color: #a0a090;
    letter-spacing: 0.02em;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Home = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="home-root">
        {/* Nav */}
        <nav className="nav">
          <div className="nav-brand">Items<span>Hub</span></div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => (window.location.href = "/displayUsers")}>
              Users
            </button>
            <button className="btn-ghost" onClick={() => (window.location.href = "/userProfile")}>
              Profile
            </button>
            <button className="btn-ghost" onClick={() => (window.location.href = "/login")}>
              Log in
            </button>
            <button className="btn-outlined" onClick={() => (window.location.href = "/register")}>
              Register
            </button>
          </div>
        </nav>

        {/* Hero */}
        <main className="hero">
          <p className="hero-label">Inventory Management</p>
          <h1 className="hero-title">
            Manage items <em>simply</em><br />and efficiently
          </h1>
          <p className="hero-subtitle">
            A clean, focused workspace for adding, organizing, and reviewing your inventory — without the noise.
          </p>

          <div className="primary-actions">
            <button className="btn-primary" onClick={() => (window.location.href = "/additem")}>
              + Add new item
            </button>
            <button className="btn-secondary" onClick={() => (window.location.href = "/allItems")}>
              View all items
            </button>
          </div>

          <div className="divider" />

          <div className="quick-links">
            <span style={{ fontSize: "0.75rem", color: "#9a9a8a", alignSelf: "center", marginRight: "0.25rem" }}>
              Quick links:
            </span>
            <button className="quick-link" onClick={() => (window.location.href = "/userProfile")}>My Profile</button>
            <button className="quick-link" onClick={() => (window.location.href = "/displayUsers")}>All Users</button>
            <button className="quick-link" onClick={() => (window.location.href = "/register")}>Create Account</button>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-text">© 2025 ItemsHub. All rights reserved.</span>
          <span className="footer-text">v1.0.0</span>
        </footer>
      </div>
    </>
  );
};

export default Home;
