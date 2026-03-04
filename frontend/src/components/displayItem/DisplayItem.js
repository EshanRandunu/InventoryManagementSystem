import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  .di-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    position: relative;
    overflow-x: hidden;
  }

  .di-root::before {
    content: '';
    position: fixed;
    top: -20%;
    right: -8%;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,165,140,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .di-nav {
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
    background: none;
    border: none;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--ink-muted);
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .nav-btn:hover { color: var(--ink); background: rgba(0,0,0,0.04); }

  .di-content {
    flex: 1;
    padding: 3rem 0 2rem;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .di-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .di-header-left {}

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
    content: '';
    display: block;
    width: 20px;
    height: 1px;
    background: var(--accent);
  }

  .page-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    letter-spacing: -0.03em;
    color: var(--ink);
    line-height: 1.1;
  }

  .page-title em { font-style: italic; color: var(--accent); }

  .di-header-right {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  /* Search */
  .search-wrap {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
    font-size: 0.9rem;
    pointer-events: none;
  }

  .search-input {
    background: rgba(255,255,255,0.65);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    padding: 0.65rem 1rem 0.65rem 2.4rem;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink);
    width: 280px;
    outline: none;
    transition: all 0.2s;
    backdrop-filter: blur(8px);
  }

  .search-input::placeholder { color: var(--ink-faint); }

  .search-input:focus {
    border-color: var(--accent);
    background: rgba(255,255,255,0.9);
    box-shadow: 0 0 0 3px rgba(122,106,82,0.1);
  }

  /* Buttons */
  .btn-primary {
    background: var(--ink);
    color: var(--bg);
    border: none;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.22s;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }

  .btn-primary:hover {
    background: #2e2e2a;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.13);
  }

  .btn-icon {
    background: rgba(255,255,255,0.6);
    border: 1.5px solid var(--border);
    color: var(--ink-muted);
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 400;
    padding: 0.65rem 1.1rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
  }

  .btn-icon:hover {
    border-color: var(--border-strong);
    color: var(--ink);
    background: rgba(255,255,255,0.9);
  }

  /* Table */
  .table-wrap {
    background: rgba(255,255,255,0.55);
    border: 1px solid var(--border);
    border-radius: 14px;
    backdrop-filter: blur(12px);
    overflow: hidden;
  }

  .inv-table {
    width: 100%;
    border-collapse: collapse;
  }

  .inv-table thead tr {
    border-bottom: 1px solid var(--border);
  }

  .inv-table th {
    text-align: left;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
    padding: 1rem 1.2rem;
    background: rgba(247,245,240,0.5);
    white-space: nowrap;
  }

  .inv-table td {
    padding: 1rem 1.2rem;
    font-size: 0.88rem;
    color: var(--ink);
    vertical-align: middle;
    border-bottom: 1px solid var(--border);
  }

  .inv-table tbody tr {
    transition: background 0.15s;
  }

  .inv-table tbody tr:hover { background: rgba(255,255,255,0.6); }

  .inv-table tbody tr:last-child td { border-bottom: none; }

  .item-img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid var(--border);
    display: block;
  }

  .item-img-placeholder {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    border: 1px dashed var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .item-id {
    font-family: 'Courier New', monospace;
    font-size: 0.78rem;
    color: var(--ink-muted);
    background: rgba(0,0,0,0.04);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  .item-name { font-weight: 500; color: var(--ink); }

  .item-category {
    font-size: 0.78rem;
    color: var(--accent);
    background: var(--accent-light);
    padding: 0.25rem 0.65rem;
    border-radius: 100px;
    white-space: nowrap;
    display: inline-block;
  }

  .item-qty {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .item-qty.low { color: #c0392b; }
  .item-qty.ok { color: #2e7d52; }

  .item-details {
    color: var(--ink-muted);
    font-size: 0.84rem;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-edit {
    background: none;
    border: 1.5px solid var(--border);
    color: var(--ink-muted);
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-edit:hover {
    border-color: var(--ink);
    color: var(--ink);
  }

  .btn-del {
    background: none;
    border: 1.5px solid rgba(192,57,43,0.18);
    color: #c0392b;
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-del:hover {
    background: #c0392b;
    color: white;
    border-color: #c0392b;
  }

  /* Empty / states */
  .di-empty {
    text-align: center;
    padding: 5rem 2rem;
    color: var(--ink-faint);
  }

  .di-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  .di-empty p {
    font-size: 0.9rem;
    font-weight: 300;
  }

  .di-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    font-size: 0.9rem;
    color: var(--ink-faint);
    gap: 0.75rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .di-footer {
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: fadeUp 0.5s ease 0.5s both;
  }

  .footer-text { font-size: 0.75rem; color: var(--ink-faint); letter-spacing: 0.02em; }

  .count-badge {
    font-size: 0.75rem;
    color: var(--ink-muted);
    background: rgba(0,0,0,0.05);
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function DisplayItem() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const result = await axios.get("http://localhost:8080/inventory");
      setInventory(result.data);
      setError(null);
    } catch (err) {
      setError("Failed to load inventory. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await axios.delete(`http://localhost:8080/inventory/${id}`);
      loadInventory();
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Inventory Report", 14, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);

    autoTable(doc, {
      head: [["Item ID", "Item Name", "Category", "Qty", "Details"]],
      body: inventory.map(item => [item.itemId, item.itemName, item.itemCategory, item.itemQty, item.itemDetails]),
      startY: 30,
      styles: { font: "helvetica", fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [26, 26, 24], textColor: [247, 245, 240], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [247, 245, 240] },
    });

    doc.save("inventory_report.pdf");
  };

  const filtered = inventory.filter((item) =>
    item.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="di-loading">
        <div className="spinner" />
        <span>Loading inventory…</span>
      </div>
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
      <div className="di-root">
        {/* Nav */}
        <nav className="di-nav">
          <div className="nav-brand" onClick={() => window.location.href = "/"}>
            Items<span>Hub</span>
          </div>
          <button className="nav-btn" onClick={() => window.location.href = "/"}>← Home</button>
        </nav>

        <main className="di-content">
          {/* Header */}
          <div className="di-header">
            <div className="di-header-left">
              <p className="page-label">Inventory</p>
              <h1 className="page-title">All <em>Items</em></h1>
            </div>
            <div className="di-header-right">
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search by ID, name, category…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-icon" onClick={generatePdf}>
                ↓ Export PDF
              </button>
              <button className="btn-primary" onClick={() => window.location.href = "/additem"}>
                + Add Item
              </button>
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="di-empty">
              <div className="di-empty-icon">◻</div>
              <p>{searchTerm ? "No items match your search." : "No items found. Add your first item."}</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id || item.itemId}>
                      <td><span className="item-id">{item.itemId}</span></td>
                      <td>
                        {item.itemImage ? (
                          <img
                            className="item-img"
                            src={`http://localhost:8080/uploads/${item.itemImage}`}
                            alt={item.itemName}
                          />
                        ) : (
                          <div className="item-img-placeholder">None</div>
                        )}
                      </td>
                      <td><span className="item-name">{item.itemName}</span></td>
                      <td><span className="item-category">{item.itemCategory}</span></td>
                      <td>
                        <span className={`item-qty ${item.itemQty <= 5 ? "low" : "ok"}`}>
                          {item.itemQty}
                        </span>
                      </td>
                      <td><span className="item-details">{item.itemDetails}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="btn-edit" onClick={() => window.location.href = `/updateItem/${item.id}`}>
                            Edit
                          </button>
                          <button className="btn-del" onClick={() => deleteItem(item.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <footer className="di-footer">
          <span className="footer-text">© 2025 ItemsHub</span>
          <span className="count-badge">{filtered.length} of {inventory.length} items</span>
        </footer>
      </div>
    </>
  );
}

export default DisplayItem;
