import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateItem.css";

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
    <div className="di-loading"><div className="spinner" /><span>Loading item…</span></div>
  );

  return (
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
    );
  }
  
  export default UpdateItem;
