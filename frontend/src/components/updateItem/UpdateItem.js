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

  .ui-root {
    min-height: 100vh; background: var(--bg); font-family: var(--font-body);
    display: flex; flex-direction: column; padding: 0 2rem; position: relative; overflow-x: hidden;
  }
  .ui-root::before {
    content: ''; position: fixed; top: -20%; right: -8%; width: 450px; height: 450px;
    border-radius: 50%; background: radial-gradient(circle, rgba(180,165,140,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .ui-nav {
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

  .ui-content {
    flex: 1; display: flex; align-items: flex-start; gap: 4rem;
    padding: 3.5rem 0 2rem; position: relative; z-index: 1;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .ui-left { flex-shrink: 0; width: 240px; }
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

  /* Current image preview in sidebar */
  .sidebar-img-wrap { margin-top: 2rem; }
  .sidebar-img-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink-faint); margin-bottom: 0.6rem;
  }
  .sidebar-img {
    width: 100%; border-radius: 10px; object-fit: cover; max-height: 140px;
    border: 1px solid var(--border); display: block;
  }
  .sidebar-no-img {
    width: 100%; height: 100px; border-radius: 10px; border: 1.5px dashed var(--border-strong);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.05em;
  }
  .sidebar-item-id {
    font-family: 'Courier New', monospace; font-size: 0.75rem; color: var(--ink-faint);
    margin-top: 0.75rem; background: rgba(0,0,0,0.04); padding: 0.3rem 0.6rem;
    border-radius: 5px; display: inline-block;
  }

  .ui-right { flex: 1; max-width: 520px; }

  .form-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    backdrop-filter: blur(12px); padding: 2.2rem; margin-bottom: 1rem;
  }
  .form-card-title {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-faint); margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { margin-bottom: 1.1rem; }
  .form-group:last-child { margin-bottom: 0; }
  .form-label {
    display: block; font-size: 0.73rem; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--ink-muted); margin-bottom: 0.45rem;
  }

  .form-input, .form-select, .form-textarea {
    width: 100%; background: rgba(255,255,255,0.65); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 0.78rem 1rem; font-family: var(--font-body); font-size: 0.9rem;
    color: var(--ink); outline: none; transition: all 0.2s;
  }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--ink-faint); }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--accent); background: rgba(255,255,255,0.92);
    box-shadow: 0 0 0 3px var(--accent-light);
  }
  .form-select {
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239a9a8a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem;
  }
  .form-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

  /* Upload */
  .upload-zone {
    border: 1.5px dashed var(--border-strong); border-radius: 10px;
    padding: 1.4rem; text-align: center; cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.35); position: relative;
  }
  .upload-zone:hover { border-color: var(--accent); background: var(--accent-light); }
  .upload-zone.has-file { border-color: var(--accent); border-style: solid; background: var(--accent-light); }
  .upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .upload-text { font-size: 0.82rem; color: var(--ink-muted); font-weight: 300; }
  .upload-text strong { font-weight: 500; color: var(--accent); }
  .upload-hint { font-size: 0.72rem; color: var(--ink-faint); margin-top: 0.2rem; }
  .upload-preview { display: flex; align-items: center; gap: 0.75rem; justify-content: center; }
  .preview-img { width: 48px; height: 48px; border-radius: 7px; object-fit: cover; border: 1px solid var(--border); }
  .preview-name { font-size: 0.82rem; color: var(--accent); font-weight: 500; }

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

  .ui-footer {
    padding: 2rem 0; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }
  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function UpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({ itemName: "", itemCategory: "", itemQty: "", itemDetails: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadItem(); }, []);

  const loadItem = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/inventory/${id}`);
      setItem(result.data);
    } catch {
      setError("Failed to load item data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const formData = new FormData();
      formData.append("itemDetails", new Blob([JSON.stringify(item)], { type: "application/json" }));
      if (imageFile) formData.append("file", imageFile);
      await axios.put(`http://localhost:8080/inventory/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/allItems");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="di-loading"><div className="spinner" /><span>Loading item…</span></div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ui-root">
        <nav className="ui-nav">
          <div className="nav-brand" onClick={() => navigate("/")}>Items<span>Hub</span></div>
          <button className="nav-btn" onClick={() => navigate("/allItems")}>← All Items</button>
        </nav>

        <main className="ui-content">
          <aside className="ui-left">
            <p className="page-label">Inventory</p>
            <h1 className="page-title">Edit <em>item</em></h1>
            <p className="page-desc">Update the item details below. Changes will be saved immediately.</p>
            <div className="sidebar-img-wrap">
              <p className="sidebar-img-label">Current image</p>
              {preview ? (
                <img className="sidebar-img" src={preview} alt="new preview" />
              ) : item.itemImage ? (
                <img className="sidebar-img" src={`http://localhost:8080/uploads/${item.itemImage}`} alt={item.itemName} />
              ) : (
                <div className="sidebar-no-img">No image</div>
              )}
              {item.itemId && <span className="sidebar-item-id">{item.itemId}</span>}
            </div>
          </aside>

          <div className="ui-right">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-card">
                <p className="form-card-title">Item Details</p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input className="form-input" type="text" name="itemName"
                      value={item.itemName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" name="itemCategory" value={item.itemCategory} onChange={handleChange}>
                      <option value="">Select category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Stationery">Stationery</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" name="itemQty"
                    min="0" value={item.itemQty} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea className="form-textarea" name="itemDetails"
                    value={item.itemDetails} onChange={handleChange} />
                </div>
              </div>

              <div className="form-card">
                <p className="form-card-title">Replace Image</p>
                <div className={`upload-zone ${imageFile ? "has-file" : ""}`}>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imageFile ? (
                    <div className="upload-preview">
                      <img className="preview-img" src={preview} alt="preview" />
                      <span className="preview-name">{imageFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="upload-text"><strong>Click to upload</strong> a new image</p>
                      <p className="upload-hint">Leave blank to keep existing image</p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-submit" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button className="btn-cancel" type="button" onClick={() => navigate("/allItems")}>Cancel</button>
              </div>
            </form>
          </div>
        </main>

        <footer className="ui-footer">
          <span className="footer-text">© 2025 ItemsHub</span>
          <span className="footer-text">v1.0.0</span>
        </footer>
      </div>
    </>
  );
}

export default UpdateItem;
