import React, { useEffect, useState, useMemo } from "react";
import "./Shop.css";
import { inventoryApi } from "../../api/inventoryApi";

const ALL = "All";

function Shop() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const result = await inventoryApi.getAll();
      setInventory(result.data);
      setError(null);
    } catch (err) {
      setError("Unable to connect to the server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Remove this item from the collection?")) {
      await inventoryApi.delete(id);
      loadInventory();
    }
  };

  /* ── Derived data ── */
  const categories = useMemo(() => {
    const cats = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))].sort();
    return [ALL, ...cats];
  }, [inventory]);

  const filtered = useMemo(() => {
    let list = inventory;

    if (activeCategory !== ALL)
      list = list.filter(i => i.itemCategory === activeCategory);

    if (searchTerm.trim())
      list = list.filter(i =>
        i.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.itemCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.itemDetails?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortBy === "name-az")  list = [...list].sort((a,b) => a.itemName?.localeCompare(b.itemName));
    if (sortBy === "name-za")  list = [...list].sort((a,b) => b.itemName?.localeCompare(a.itemName));
    if (sortBy === "qty-asc")  list = [...list].sort((a,b) => a.itemQty - b.itemQty);
    if (sortBy === "qty-desc") list = [...list].sort((a,b) => b.itemQty - a.itemQty);

    return list;
  }, [inventory, activeCategory, searchTerm, sortBy]);

  /* ── Group filtered items by category ── */
  const grouped = useMemo(() => {
    if (activeCategory !== ALL) {
      return { [activeCategory]: filtered };
    }
    return filtered.reduce((acc, item) => {
      const cat = item.itemCategory || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const lowStockCount = inventory.filter(i => i.itemQty <= 5).length;

  /* ── Loading ── */
  if (loading) return (
    <div className="el-loading">
      <div className="spinner" />
      <span>Curating collection…</span>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="el-loading" style={{ color: "#B84040", flexDirection: "column", gap: "0.5rem" }}>
      <span style={{ fontSize: "1.5rem" }}>⚠</span>
      <span>{error}</span>
    </div>
  );

  return (
    <div className="el-root">

      {/* Topbar */}
      <div className="el-topbar">
        Free shipping on orders over $200 · New arrivals every Thursday
      </div>

      {/* Nav */}
      <nav className="el-nav">
        <div className="nav-brand" onClick={() => window.location.href = "/"}>
          El<em>y</em>mon
        </div>
        <div className="nav-right">
          <button className="nav-link" onClick={() => window.location.href = "/"}>Home</button>
          <button className="nav-link">Collections</button>
          <button className="nav-link">About</button>
          <button className="nav-link" onClick={() => (window.location.href = "/profile")}>Profile</button>
          
        </div>
      </nav>

      {/* Hero */}
      <section className="el-hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Shop</p>
          <h1 className="hero-title">The <em>Collection</em><br />Catalogue</h1>
          <p className="hero-sub">Manage, explore and curate your full clothing inventory with ease.</p>
        </div>
        <div className="hero-right">
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">{inventory.length}</div>
              <div className="stat-label">Items</div>
            </div>
            <div className="stat">
              <div className="stat-num">{categories.length - 1}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat">
              <div className="stat-num">{totalStock}</div>
              <div className="stat-label">Total Stock</div>
            </div>
            {lowStockCount > 0 && (
              <div className="stat">
                <div className="stat-num" style={{ color: "#e06b6b" }}>{lowStockCount}</div>
                <div className="stat-label">Low Stock</div>
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* Toolbar */}
      <div className="el-toolbar">
        <div className="toolbar-left">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search items…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="name-az">Name A–Z</option>
            <option value="name-za">Name Z–A</option>
            <option value="qty-asc">Qty: Low first</option>
            <option value="qty-desc">Qty: High first</option>
          </select>
        </div>
      </div>

      {/* Main */}
      <main className="el-main">
        {filtered.length === 0 ? (
          <div className="el-empty">
            <div className="el-empty-icon">E</div>
            <p className="el-empty-title">
              {searchTerm ? "No items match your search." : "No items in this collection yet."}
            </p>
            <p className="el-empty-sub">
              {searchTerm ? "Try different keywords or browse all categories." : "Add your first item to get started."}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            
            <section key={category} className="cat-section">
            {/* ========================================================================================Category Section */}
              {/* Only show section header when showing all categories */}
              {activeCategory === ALL && (
                <div className="cat-section-header">
                  <span className="cat-section-name">{category}</span>
                  <div className="cat-section-line" />
                  <span className="cat-section-count">{items.length} {items.length === 1 ? "piece" : "pieces"}</span>
                </div>
              )}

              {activeCategory !== ALL && (
                <div className="section-header">
                  <h2 className="section-title"><em>{category}</em> Collection</h2>
                  <span className="section-count">{items.length} {items.length === 1 ? "item" : "items"}</span>
                </div>
              )}

              <div className="items-grid">
                {items.map((item, idx) => (
                  <ItemCard
                    key={item.id || item.itemId}
                    item={item}
                    idx={idx}
                    onEdit={() => window.location.href = `/inventory/${item.id}/edit`}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="el-footer">
        <div className="footer-brand">El<em>y</em>mon</div>
        <span className="footer-copy">
          {filtered.length} of {inventory.length} items shown · © {new Date().getFullYear()} Elymon
        </span>
      </footer>

    </div>
  );
}

/* ─── Item Card Component ─── */
function ItemCard({ item, idx, onEdit, onDelete }) {
  const isLow = parseInt(item.itemQty) <= 5;

  return (
    <div className="item-card" style={{ animationDelay: `${idx * 0.05}s` }}>
      {/* Image */}
      <div className="card-img-wrap">
        {item.itemImage ? (
          <img
            src={inventoryApi.getImageUrl(item.itemImage)}
            alt={item.itemName}
            loading="lazy"
          />
        ) : (
          <div className="card-img-placeholder">
            <span>E</span>
            <p>No Image</p>
          </div>
        )}

        {isLow && <span className="card-badge low">Low Stock</span>}
        {!isLow && <span className="card-badge">In Stock</span>}

        {item.itemCategory && (
          <span className="card-badge category">{item.itemCategory}</span>
        )}

      
      </div>

      {/* Body */}
      <div className="card-body">
        <p className="card-id">{item.itemId}</p>
        <h3 className="card-name">{item.itemName}</h3>
        {item.itemDetails && <p className="card-details">{item.itemDetails}</p>}

        <div className="card-footer">
          <span className={`card-qty ${isLow ? "low-text" : ""}`}>
            <span className={`qty-dot ${isLow ? "low" : "ok"}`} />
            {item.itemQty} {parseInt(item.itemQty) === 1 ? "unit" : "units"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Shop;
