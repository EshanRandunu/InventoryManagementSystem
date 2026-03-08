import React from "react";

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
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }

  .nav-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
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
    gap: 0.6rem;
    align-items: center;
  }

  .btn-ghost {
    background: none;
    border: none;
    font-size: 0.9rem;
    color: #5a5a52;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 6px;
  }

  .btn-ghost:hover {
    color: #1a1a18;
    background: rgba(0,0,0,0.05);
  }

  .btn-outlined {
    border: 1.5px solid #1a1a18;
    background: none;
    font-size: 0.9rem;
    padding: 0.5rem 1.2rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-outlined:hover {
    background: #1a1a18;
    color: white;
  }

  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 720px;
    padding: 5rem 0;
  }

  .hero-label {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9a8a72;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem,5vw,4.5rem);
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: #1a1a18;
  }

  .hero-title em {
    color: #7a6a52;
    font-style: italic;
  }

  .hero-subtitle {
    font-size: 1.05rem;
    color: #6a6a60;
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 3rem;
  }

  .primary-actions {
    display: flex;
    gap: 1rem;
  }

  .btn-primary {
    background: #1a1a18;
    color: #F7F5F0;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
  }

  .btn-primary:hover {
    background: #333;
  }

  .btn-secondary {
    border: 1.5px solid rgba(0,0,0,0.2);
    background: none;
    padding: 0.9rem 2rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-secondary:hover {
    border-color: #000;
  }

  .footer {
    padding: 2rem 0;
    border-top: 1px solid rgba(0,0,0,0.06);
    display: flex;
    justify-content: space-between;
  }

  .footer-text {
    font-size: 0.75rem;
    color: #9a9a8a;
  }
`;

const Home = () => {
  return (
    <>
      <style>{styles}</style>

      <div className="home-root">

        {/* Navbar */}
        <nav className="nav">
          <div className="nav-brand">Ely<span>mon</span></div>

          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => window.location.href="/shop"}>Shop</button>
            <button className="btn-ghost" onClick={() => window.location.href="/collections"}>Collections</button>
            <button className="btn-ghost" onClick={() => window.location.href="/login"}>Log in</button>
            <button className="btn-outlined" onClick={() => window.location.href="/register"}>Join Elymon</button>
          </div>
        </nav>

        {/* Hero Section  */}
        <main className="hero">

          <p className="hero-label">Elymon Fashion</p>

          <h1 className="hero-title">
            Wear <em>Confidence</em><br/>Define Your Style
          </h1>

          <p className="hero-subtitle">
            Elymon brings modern fashion with timeless elegance. 
            Discover clothing designed for comfort, confidence, and individuality.
          </p>

          <div className="primary-actions">
            <button className="btn-primary" onClick={() => window.location.href="/shop"}>
              Shop Now
            </button>

            <button className="btn-secondary" onClick={() => window.location.href="/collections"}>
              Explore Collections
            </button>
          </div>

        </main>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-text">© 2026 Elymon. All rights reserved.</span>
          <span className="footer-text">Fashion • Style • Identity</span>
          <button className="btn-secondary" onClick={() => window.location.href="/admin/dashboard"}>
              Admin
            </button>
        </footer>

      </div>
    </>
  );
};

export default Home;