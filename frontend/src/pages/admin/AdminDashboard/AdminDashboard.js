import React, { useState, useEffect, useMemo } from "react";
import "./AdminDashboard.css";
import { inventoryApi } from "../../../api/inventoryApi";
import { usersApi } from "../../../api/usersApi";
import { API_BASE_URL } from "../../../shared/constants/apiConfig";
import { getInitials } from "../../../shared/utils/formatters";

// ─── Constants ────────────────────────────────────────────────────────────────
const API = API_BASE_URL;

const ACTIVITY = [
  { id: 1, type: "add",    msg: "New item added to inventory",        time: "2 min ago" },
  { id: 2, type: "edit",   msg: "Item quantity updated",              time: "18 min ago" },
  { id: 3, type: "user",   msg: "New user registered",               time: "1 hr ago" },
  { id: 4, type: "delete", msg: "Item removed from collection",       time: "3 hr ago" },
  { id: 5, type: "edit",   msg: "Item details updated",               time: "5 hr ago" },
  { id: 6, type: "add",    msg: "New item added to collection",       time: "Yesterday" },
  { id: 7, type: "user",   msg: "User account deactivated",          time: "Yesterday" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const qtyStatus = (qty) => {
  const n = parseInt(qty);
  if (isNaN(n) || n === 0) return "out";
  if (n <= 5) return "low";
  return "ok";
};

const qtyLabel = (qty) => {
  const n = parseInt(qty);
  if (isNaN(n) || n === 0) return "Out of Stock";
  if (n <= 5) return "Low Stock";
  return "In Stock";
};

const ACTIVITY_ICON = { add: "＋", edit: "✎", delete: "✕", user: "◉" };

// ─── Shared Loading / Error ───────────────────────────────────────────────────
function Loading({ msg = "Loading…" }) {
  return (
    <div className="ad-loading">
      <div className="ad-spinner" />
      <span>{msg}</span>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return <div className="ad-error">⚠ {msg}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function PageOverview({ inventory, users }) {
  const totalItems  = inventory.length;
  const totalStock  = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const lowItems    = inventory.filter(i => parseInt(i.itemQty) <= 5 && parseInt(i.itemQty) > 0);
  const outItems    = inventory.filter(i => !parseInt(i.itemQty) || parseInt(i.itemQty) === 0);
  const activeUsers = users.filter(u => u.status === "active").length;

  const categories = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))];
  const catData = categories.map(cat => ({
    name:  cat,
    count: inventory.filter(i => i.itemCategory === cat).length,
    stock: inventory.filter(i => i.itemCategory === cat).reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0),
  })).sort((a, b) => b.stock - a.stock);

  const maxStock = Math.max(...catData.map(c => c.stock), 1);

  const criticalItems = [...inventory]
    .filter(i => parseInt(i.itemQty) <= 5)
    .sort((a, b) => parseInt(a.itemQty) - parseInt(b.itemQty))
    .slice(0, 7);

  const statCards = [
    { label: "Total Items",  value: totalItems,                         sub: "in collection",              icon: "◼", cls: "" },
    { label: "Total Stock",  value: totalStock,                         sub: "units across all items",     icon: "▦", cls: "" },
    { label: "Active Users", value: users.length ? activeUsers : users.length, sub: `of ${users.length} total`, icon: "◉", cls: "green" },
    { label: "Alerts",       value: lowItems.length + outItems.length,  sub: `${outItems.length} out of stock`, icon: "⚠", cls: outItems.length > 0 ? "red" : "amber" },
  ];

  return (
    <>
      <div className="stats-row">
        {statCards.map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock by <em>Category</em></span>
            <span className="panel-meta">{categories.length} categories</span>
          </div>
          {catData.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">◻</div><p className="empty-msg">No category data.</p></div>
          ) : (
            <div className="bar-chart">
              {catData.map(cat => (
                <div className="bar-row" key={cat.name}>
                  <span className="bar-label">{cat.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(cat.stock / maxStock) * 100}%` }} />
                  </div>
                  <span className="bar-val">{cat.stock}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock <em>Alerts</em></span>
            <span className="panel-meta">{criticalItems.length} items</span>
          </div>
          {criticalItems.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✓</div><p className="empty-msg">All items well stocked</p></div>
          ) : (
            <div className="alert-list">
              {criticalItems.map(item => {
                const st = qtyStatus(item.itemQty);
                return (
                  <div className="alert-item" key={item.id || item.itemId}>
                    <div className={`alert-dot ${st}`} />
                    <span className="alert-name">{item.itemName}</span>
                    <span className="alert-id">{item.itemId}</span>
                    <span className={`badge-stock ${st}`}>
                      {parseInt(item.itemQty) === 0 ? "Out" : `${item.itemQty} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Category <em>Breakdown</em></span>
        </div>
        {catData.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">◻</div><p className="empty-msg">No data.</p></div>
        ) : (
          <div className="cat-cards">
            {catData.map(cat => (
              <div className="cat-card" key={cat.name}>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-val">{cat.stock}</div>
                <div className="cat-card-sub">{cat.count} {cat.count === 1 ? "item" : "items"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Recent <em>Activity</em></span>
          <span className="panel-meta">Last entries</span>
        </div>
        <div className="activity-list">
          {ACTIVITY.map(a => (
            <div className="activity-row" key={a.id}>
              <div className={`activity-icon ${a.type}`}>{ACTIVITY_ICON[a.type]}</div>
              <span className="activity-msg">{a.msg}</span>
              <span className="activity-time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════
function PageProducts({ inventory, loadInventory }) {
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [deleting,  setDeleting]  = useState(null);

  const categories = useMemo(() => {
    const cats = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))].sort();
    return ["All", ...cats];
  }, [inventory]);

  const filtered = useMemo(() => {
    let list = inventory;
    if (catFilter !== "All") list = list.filter(i => i.itemCategory === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.itemId?.toLowerCase().includes(q) ||
        i.itemName?.toLowerCase().includes(q) ||
        i.itemCategory?.toLowerCase().includes(q) ||
        i.itemDetails?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inventory, catFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from inventory?")) return;
    try {
      setDeleting(id);
      await inventoryApi.delete(id);
      await loadInventory();
    } catch {
      alert("Failed to delete item.");
    } finally {
      setDeleting(null);
    }
  };

  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const lowCount   = inventory.filter(i => parseInt(i.itemQty) <= 5).length;

  return (
    <>
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Total Products",  value: inventory.length,       icon: "◼", cls: "" },
          { label: "Total Units",     value: totalStock,             icon: "▦", cls: "" },
          { label: "Low / Out Stock", value: lowCount,               icon: "⚠", cls: lowCount > 3 ? "red" : "amber" },
          { label: "Categories",      value: categories.length - 1,  icon: "⊞", cls: "green" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Product <em>Catalogue</em></span>
          <div className="panel-actions">
            <button className="btn-ghost" onClick={() => window.location.href = "/inventory"}>
              Full View
            </button>
            <button className="btn-primary" onClick={() => window.location.href = "/inventory/new"}>
              + Add Item
            </button>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-search">
            <span className="toolbar-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by ID, name, category or details…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="toolbar-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <span className="toolbar-info">{filtered.length} of {inventory.length} items</span>
        </div>

        <div className="table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="no-row"><td colSpan="8">No items match your filters.</td></tr>
              ) : filtered.map(item => {
                const st = qtyStatus(item.itemQty);
                return (
                  <tr key={item.id || item.itemId}>
                    <td><span className="cell-id">{item.itemId}</span></td>
                    <td>
                      {item.itemImage
                        ? <img className="cell-img" src={inventoryApi.getImageUrl(item.itemImage)} alt={item.itemName} />
                        : <div className="cell-img-empty">none</div>
                      }
                    </td>
                    <td><span className="cell-name">{item.itemName}</span></td>
                    <td><span className="cell-cat">{item.itemCategory}</span></td>
                    <td><span className={`cell-qty ${st}`}>{item.itemQty}</span></td>
                    <td><span className={`badge-stock ${st}`}>{qtyLabel(item.itemQty)}</span></td>
                    <td><span className="cell-detail">{item.itemDetails}</span></td>
                    <td>
                      <div className="cell-actions">
                        <button className="btn-edit" onClick={() => window.location.href = `/inventory/${item.id}/edit`}>
                          Edit
                        </button>
                        <button
                          className="btn-del"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                        >
                          {deleting === item.id ? "…" : "✕"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: USERS
// ═══════════════════════════════════════════════════════════════════════════════
function PageUsers({ users, loadUsers }) {
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deleting,   setDeleting]   = useState(null);

  // Normalise: users from backend may only have id, userName, email
  const normalised = useMemo(() =>
    users.map(u => ({
      ...u,
      role:   u.role   || "Viewer",
      status: u.status || "active",
    }))
  , [users]);

  const roles = ["All", "Admin", "Editor", "Viewer"];

  const filtered = useMemo(() => {
    let list = normalised;
    if (roleFilter !== "All") list = list.filter(u => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.id?.toString().includes(q) ||
        u.userName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [normalised, roleFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      setDeleting(id);
      await usersApi.delete(id);
      await loadUsers();
    } catch {
      alert("Failed to delete user.");
    } finally {
      setDeleting(null);
    }
  };

  const activeCount = normalised.filter(u => u.status === "active").length;

  return (
    <>
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Total Users", value: users.length,                icon: "◉", cls: "" },
          { label: "Active",      value: activeCount,                 icon: "✓", cls: "green" },
          { label: "Inactive",    value: users.length - activeCount,  icon: "◯", cls: "" },
          { label: "Admins",      value: normalised.filter(u => u.role === "Admin").length, icon: "⊛", cls: "amber" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">User <em>Management</em></span>
          <div className="panel-actions">
            <button className="btn-ghost" onClick={() => window.location.href = "/admin/users"}>
              Full View
            </button>
            <button className="btn-primary" onClick={() => window.location.href = "/signup"}>
              + Add User
            </button>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-search">
            <span className="toolbar-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by ID, name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="toolbar-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <span className="toolbar-info">{filtered.length} of {users.length} users</span>
        </div>

        <div className="table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="no-row"><td colSpan="5">No users match your search.</td></tr>
              ) : filtered.map((user, i) => (
                <tr key={user.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td>
                    <div className="u-cell">
                      <div className="u-avatar">{getInitials(user.userName)}</div>
                      <div>
                        <div className="u-name">{user.userName}</div>
                        <div className="u-id">#{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="u-email">{user.email}</td>
                  <td><span className={`badge-role ${user.role}`}>{user.role}</span></td>
                  <td>
                    <span className={`badge-status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <button className="btn-edit" onClick={() => window.location.href = `/profile/edit/${user.id}`}>
                        Edit
                      </button>
                      <button
                        className="btn-del"
                        onClick={() => handleDelete(user.id)}
                        disabled={deleting === user.id}
                      >
                        {deleting === user.id ? "…" : "✕"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════
function PageAnalytics({ inventory, users }) {
  const categories = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))].sort();

  const catData = categories.map(cat => {
    const items = inventory.filter(i => i.itemCategory === cat);
    return {
      name:  cat,
      count: items.length,
      stock: items.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0),
    };
  }).sort((a, b) => b.stock - a.stock);

  const maxStock = Math.max(...catData.map(c => c.stock), 1);
  const maxCount = Math.max(...catData.map(c => c.count), 1);

  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const inStock    = inventory.filter(i => parseInt(i.itemQty) > 5).length;
  const lowStock   = inventory.filter(i => parseInt(i.itemQty) <= 5 && parseInt(i.itemQty) > 0).length;
  const outStock   = inventory.filter(i => !parseInt(i.itemQty) || parseInt(i.itemQty) === 0).length;
  const invLen     = inventory.length || 1;

  const totalUsers = users.length || 1;
  const normalised = users.map(u => ({ ...u, role: u.role || "Viewer" }));

  const roleCount = ["Admin", "Editor", "Viewer"].map(r => ({
    role:  r,
    count: normalised.filter(u => u.role === r).length,
    pct:   Math.round(normalised.filter(u => u.role === r).length / totalUsers * 100),
  }));

  const roleColors = { Admin: "#c8a97a", Editor: "#4a5a9a", Viewer: "#9a9a8a" };

  const stockDist = [
    { label: "In Stock",     value: inStock,  pct: Math.round(inStock  / invLen * 100), color: "#2e7d52" },
    { label: "Low Stock",    value: lowStock, pct: Math.round(lowStock / invLen * 100), color: "#b85c1a" },
    { label: "Out of Stock", value: outStock, pct: Math.round(outStock / invLen * 100), color: "#b83232" },
  ];

  const topItems = [...inventory].sort((a, b) => parseInt(b.itemQty) - parseInt(a.itemQty)).slice(0, 8);

  return (
    <>
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Inventory Health",  value: `${Math.round(inStock / invLen * 100)}%`,                                   sub: "items fully stocked",  cls: "green" },
          { label: "Avg Units / Item",  value: Math.round(totalStock / invLen),                                            sub: "units per item",       cls: "" },
          { label: "Most Stocked Cat.", value: catData[0]?.name || "—",                                                    sub: `${catData[0]?.stock || 0} units`, cls: "" },
          { label: "Largest Category",  value: [...catData].sort((a, b) => b.count - a.count)[0]?.name || "—",            sub: `${[...catData].sort((a,b)=>b.count-a.count)[0]?.count||0} items`, cls: "" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls}`}>◈</div>
            </div>
            <div className={`stat-value ${typeof s.value === "string" && s.value.length > 5 ? "sm" : ""}`}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock <em>Distribution</em></span>
          </div>
          <div className="dist-wrap">
            {stockDist.map(s => (
              <div className="dist-row" key={s.label}>
                <div className="dist-labels">
                  <span className="dist-label">{s.label}</span>
                  <span className="dist-val" style={{ color: s.color }}>
                    {s.value} items{" "}
                    <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>({s.pct}%)</span>
                  </span>
                </div>
                <div className="dist-track">
                  <div className="dist-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "1rem" }}>
                Units by Category
              </p>
              {catData.map(cat => (
                <div className="bar-row" key={cat.name} style={{ marginBottom: "0.75rem" }}>
                  <span className="bar-label">{cat.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(cat.stock / maxStock) * 100}%` }} />
                  </div>
                  <span className="bar-val">{cat.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <span className="panel-title">User <em>Roles</em></span>
            </div>
            <div className="role-dist">
              {roleCount.map(r => (
                <div className="role-dist-row" key={r.role}>
                  <div className="role-dist-labels">
                    <span className={`badge-role ${r.role}`}>{r.role}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{r.count} ({r.pct}%)</span>
                  </div>
                  <div className="role-dist-track">
                    <div className="role-dist-fill" style={{ width: `${r.pct}%`, background: roleColors[r.role] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <span className="panel-title">Items per <em>Category</em></span>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {catData.map(cat => (
                <div className="bar-row" key={cat.name}>
                  <span className="bar-label">{cat.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill blue" style={{ width: `${(cat.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="bar-val">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Top Items by <em>Stock Volume</em></span>
          <span className="panel-meta">Top {topItems.length}</span>
        </div>
        <div className="table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Item ID</th>
                <th>Category</th>
                <th>Units</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topItems.length === 0 ? (
                <tr className="no-row"><td colSpan="6">No items yet.</td></tr>
              ) : topItems.map((item, i) => {
                const st = qtyStatus(item.itemQty);
                return (
                  <tr key={item.id || item.itemId}>
                    <td style={{ color: "var(--ink-faint)", fontWeight: 600, fontSize: "0.8rem" }}>#{i + 1}</td>
                    <td><span className="cell-name">{item.itemName}</span></td>
                    <td><span className="cell-id">{item.itemId}</span></td>
                    <td><span className="cell-cat">{item.itemCategory}</span></td>
                    <td><span className={`cell-qty ${st}`}>{item.itemQty}</span></td>
                    <td><span className={`badge-stock ${st}`}>{qtyLabel(item.itemQty)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT: ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activePage,   setActivePage]   = useState("overview");
  const [globalSearch, setGlobalSearch] = useState("");

  const [inventory,    setInventory]    = useState([]);
  const [invLoading,   setInvLoading]   = useState(true);
  const [invError,     setInvError]     = useState(null);

  const [users,        setUsers]        = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError,   setUsersError]   = useState(null);

  // ─── Real backend fetches ────────────────────────────────────────────────────
  const loadInventory = async () => {
    try {
      setInvLoading(true);
      setInvError(null);
      const res = await inventoryApi.getAll();
      setInventory(res.data);
    } catch {
      setInvError(`Cannot reach ${API}/inventory — is Spring Boot running?`);
    } finally {
      setInvLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch {
      setUsersError(`Cannot reach ${API}/users — is Spring Boot running?`);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
    loadUsers();
  }, []);

  // ─── Nav ────────────────────────────────────────────────────────────────────
  const NAV = [
    { id: "overview",  label: "Overview",  icon: "⊞", section: null },
    { id: "analytics", label: "Analytics", icon: "◈", section: null },
    { id: "products",  label: "Products",  icon: "◼", section: "Management" },
    { id: "users",     label: "Users",     icon: "◉", section: "Management" },
  ];

  const PAGE_TITLES = {
    overview:  ["Dashboard", "Overview"],
    analytics: ["Analytics", "Insights"],
    products:  ["Products",  "Management"],
    users:     ["Users",     "Management"],
  };

  const lowStockCount = inventory.filter(i => parseInt(i.itemQty) <= 5).length;
  const [title, subtitle] = PAGE_TITLES[activePage];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const renderPage = () => {
    const loading = invLoading || usersLoading;
    const error   = invError   || usersError;
    if (loading) return <Loading msg="Fetching data from backend…" />;
    if (error)   return <ErrorMsg msg={error} />;

    switch (activePage) {
      case "overview":  return <PageOverview  inventory={inventory} users={users} />;
      case "analytics": return <PageAnalytics inventory={inventory} users={users} />;
      case "products":  return <PageProducts  inventory={inventory} loadInventory={loadInventory} />;
      case "users":     return <PageUsers     users={users}         loadUsers={loadUsers} />;
      default:          return null;
    }
  };

  return (
    <div className="ad-shell">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="ad-sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">Ely<em>Mon</em></div>
          <div className="brand-tag">Admin Console</div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            const prevSection = i > 0 ? NAV[i - 1].section : null;
            return (
              <React.Fragment key={item.id}>
                {item.section && item.section !== prevSection && (
                  <div className="nav-section-label">{item.section}</div>
                )}
                <button
                  className={`ad-nav-item ${activePage === item.id ? "active" : ""}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.id === "products" && lowStockCount > 0 && (
                    <span className="nav-badge">{lowStockCount}</span>
                  )}
                </button>
              </React.Fragment>
            );
          })}

          <div className="nav-section-label">Quick Links</div>
          <button className="ad-nav-item" onClick={() => window.location.href = "/"}>
            <span className="nav-icon">⌂</span> Back to Site
          </button>
          <button className="ad-nav-item" onClick={() => window.location.href = "/inventory"}>
            <span className="nav-icon">◧</span> All Items
          </button>
          <button className="ad-nav-item" onClick={() => window.location.href = "/admin/users"}>
            <span className="nav-icon">◉</span> User List
          </button>
          <button className="ad-nav-item" onClick={() => window.location.href = "/shop"}>
            <span className="nav-icon">⊡</span> Shop View
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-admin">
            <div className="admin-avatar">AD</div>
            <div className="admin-info">
              <div className="admin-name">Admin</div>
              <div className="admin-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="ad-main">

        <div className="ad-topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">{today}</div>
            <div className="topbar-page">{title} <em>/ {subtitle}</em></div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <span className="topbar-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Global search…"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
              />
            </div>
            <button
              className={`topbar-btn${lowStockCount > 0 ? " has-notif" : ""}`}
              title={lowStockCount > 0 ? `${lowStockCount} stock alerts` : "No alerts"}
              onClick={() => setActivePage("products")}
            >
              ⚑
            </button>
            <button className="topbar-btn" title="Home" onClick={() => window.location.href = "/"}>
              ⌂
            </button>
            <button
              className="topbar-btn"
              title="Sign out"
              onClick={() => {
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                window.location.href = "/signin";
              }}
            >
              ⊗
            </button>
          </div>
        </div>

        <div className="ad-page">
          {renderPage()}
        </div>

      </div>
    </div>
  );
}
