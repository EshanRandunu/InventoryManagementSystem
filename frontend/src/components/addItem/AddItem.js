import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  .ai-root {
    min-height: 100vh; background: var(--bg); font-family: var(--font-body);
    display: flex; flex-direction: column; padding: 0 2rem; position: relative; overflow-x: hidden;
  }
  .ai-root::before {
    content: ''; position: fixed; top: -20%; right: -8%; width: 450px; height: 450px;
    border-radius: 50%; background: radial-gradient(circle, rgba(180,165,140,0.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .ai-nav {
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

  .ai-content {
    flex: 1; display: flex; gap: 4rem; padding: 3.5rem 0 2rem;
    position: relative; z-index: 1; animation: fadeUp 0.7s ease 0.1s both;
  }

  .ai-left { flex-shrink: 0; width: 240px; }
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

  .ai-right { flex: 1; max-width: 580px; }

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
  .required { color: var(--accent); margin-left: 2px; }

  .form-input, .form-select, .form-textarea {
    width: 100%; background: rgba(255,255,255,0.65); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 0.78rem 1rem; font-family: var(--font-body); font-size: 0.9rem;
    color: var(--ink); outline: none; transition: all 0.2s; backdrop-filter: blur(8px);
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

  /* Image Upload */
  .upload-zone {
    border: 1.5px dashed var(--border-strong); border-radius: 10px;
    padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.35); position: relative;
  }
  .upload-zone:hover { border-color: var(--accent); background: var(--accent-light); }
  .upload-zone.has-file { border-color: var(--accent); border-style: solid; background: var(--accent-light); }
  .upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .upload-icon { font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.4; }
  .upload-text { font-size: 0.82rem; color: var(--ink-muted); font-weight: 300; }
  .upload-text strong { font-weight: 500; color: var(--accent); }
  .upload-hint { font-size: 0.72rem; color: var(--ink-faint); margin-top: 0.25rem; }
  .upload-preview {
    display: flex; align-items: center; gap: 0.75rem; justify-content: center; flex-wrap: wrap;
  }
  .preview-img {
    width: 52px; height: 52px; border-radius: 8px; object-fit: cover;
    border: 1px solid var(--border);
  }
  .preview-name { font-size: 0.82rem; color: var(--accent); font-weight: 500; }

  /* Action row */
  .form-actions { display: flex; gap: 0.75rem; align-items: center; padding-top: 0.5rem; }
  .btn-submit {
    background: var(--ink); color: var(--bg); border: none; font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 500; padding: 0.88rem 2.2rem; cursor: pointer;
    border-radius: 8px; transition: all 0.22s; letter-spacing: 0.01em;
  }
  .btn-submit:hover { background: #2e2e2a; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.13); }
  .btn-submit:active { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-reset {
    background: none; color: var(--ink-muted); border: 1.5px solid var(--border);
    font-family: var(--font-body); font-size: 0.88rem; padding: 0.85rem 1.4rem;
    cursor: pointer; border-radius: 8px; transition: all 0.2s;
  }
  .btn-reset:hover { border-color: var(--border-strong); color: var(--ink); }

  .error-msg {
    background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.2); border-radius: 8px;
    padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--danger); margin-bottom: 1rem;
  }
  .success-msg {
    background: rgba(46,125,82,0.08); border: 1px solid rgba(46,125,82,0.2); border-radius: 8px;
    padding: 0.75rem 1rem; font-size: 0.82rem; color: #2e7d52; margin-bottom: 1rem;
  }

  .ai-footer {
    padding: 2rem 0; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }
  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

const EMPTY = { itemId: "", itemName: "", itemCategory: "", itemQty: "", itemDetails: "" };

function AddItem() {
  const navigate = useNavigate();
  const [item, setItem] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const reset = () => {
    setItem(EMPTY); setImageFile(null); setPreview(null); setError(""); setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!item.itemId || !item.itemName || !item.itemCategory || !item.itemQty) {
      setError("Please fill in all required fields."); return;
    }
    if (isNaN(item.itemQty) || parseInt(item.itemQty) <= 0) {
      setError("Quantity must be a positive number."); return;
    }
    setLoading(true);
    try {
      let imageName = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const imgRes = await axios.post("http://localhost:8080/inventory/itemImg", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageName = imgRes.data;
      }
      await axios.post("http://localhost:8080/inventory", {
        ...item, itemQty: item.itemQty.toString(), itemImage: imageName
      });
      setSuccess("Item added successfully!");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ai-root">
        <nav className="ai-nav">
          <div className="nav-brand" onClick={() => navigate("/")}>Items<span>Hub</span></div>
          <button className="nav-btn" onClick={() => navigate("/")}>← Home</button>
        </nav>

        <main className="ai-content">
          <aside className="ai-left">
            <p className="page-label">Inventory</p>
            <h1 className="page-title">Add <em>new</em> item</h1>
            <p className="page-desc">Fill in the details to add a new item to your inventory. Fields marked with <span style={{color:"var(--accent)"}}>*</span> are required.</p>
          </aside>

          <div className="ai-right">
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="form-card">
                <p className="form-card-title">Basic Information</p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item ID <span className="required">*</span></label>
                    <input className="form-input" type="text" name="itemId" placeholder="e.g. ITM-001"
                      value={item.itemId} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category <span className="required">*</span></label>
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
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item Name <span className="required">*</span></label>
                    <input className="form-input" type="text" name="itemName" placeholder="e.g. Wireless Mouse"
                      value={item.itemName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity <span className="required">*</span></label>
                    <input className="form-input" type="number" name="itemQty" placeholder="0"
                      min="1" value={item.itemQty} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea className="form-textarea" name="itemDetails" placeholder="Additional notes about this item…"
                    value={item.itemDetails} onChange={handleChange} />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-card">
                <p className="form-card-title">Item Image</p>
                <div className={`upload-zone ${imageFile ? "has-file" : ""}`}>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imageFile ? (
                    <div className="upload-preview">
                      <img className="preview-img" src={preview} alt="preview" />
                      <span className="preview-name">{imageFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">◻</div>
                      <p className="upload-text"><strong>Click to upload</strong> or drag & drop</p>
                      <p className="upload-hint">PNG, JPG, WEBP up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-submit" type="submit" disabled={loading}>
                  {loading ? "Saving…" : "+ Add Item"}
                </button>
                <button className="btn-reset" type="button" onClick={reset}>Clear form</button>
              </div>
            </form>
          </div>
        </main>

        <footer className="ai-footer">
          <span className="footer-text">© 2025 ItemsHub</span>
          <span className="footer-text">v1.0.0</span>
        </footer>
      </div>
    </>
  );
}

export default AddItem;
