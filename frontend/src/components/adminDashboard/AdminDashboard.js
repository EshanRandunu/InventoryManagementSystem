import React, { useState, useEffect, useMemo } from "react";

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F5F0;
    --surface: rgba(255,255,255,0.72);
    --surface-solid: #ffffff;
    --ink: #1a1a18;
    --ink-muted: #6a6a60;
    --ink-faint: #9a9a8a;
    --accent: #7a6a52;
    --accent-light: rgba(122,106,82,0.1);
    --accent-glow: rgba(122,106,82,0.18);
    --border: rgba(0,0,0,0.07);
    --border-strong: rgba(0,0,0,0.14);
    --danger: #b83232;
    --danger-bg: rgba(184,50,50,0.08);
    --success: #2e7d52;
    --success-bg: rgba(46,125,82,0.09);
    --warning: #b85c1a;
    --warning-bg: rgba(184,92,26,0.09);
    --sidebar-w: 240px;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 14px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); font-family: var(--font-body); }

  /* ── Layout ── */
  .ad-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
  }

  /* ── Sidebar ── */
  .ad-sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
    z-index: 100;
    animation: slideInLeft 0.5s ease both;
  }

  .sidebar-brand {
    padding: 2rem 1.6rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 1.3rem;
    letter-spacing: -0.02em;
    color: #F7F5F0;
  }

  .brand-name em { font-style: italic; color: #c8a97a; }

  .brand-tag {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(249,246,241,0.3);
    margin-top: 0.3rem;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1.25rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .nav-section-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(249,246,241,0.25);
    padding: 0.8rem 0.75rem 0.4rem;
    margin-top: 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.9rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.18s ease;
    color: rgba(249,246,241,0.55);
    font-size: 0.85rem;
    font-weight: 400;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    position: relative;
  }

  .nav-item:hover {
    background: rgba(255,255,255,0.06);
    color: rgba(249,246,241,0.85);
  }

  .nav-item.active {
    background: rgba(200,169,122,0.15);
    color: #c8a97a;
    font-weight: 500;
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    height: 60%;
    width: 3px;
    background: #c8a97a;
    border-radius: 0 2px 2px 0;
  }

  .nav-icon {
    font-size: 0.95rem;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
  }

  .sidebar-footer {
    padding: 1.25rem 1.25rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .sidebar-admin {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8a97a, #9a7850);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 0.8rem;
    color: white;
    flex-shrink: 0;
  }

  .admin-info { flex: 1; overflow: hidden; }

  .admin-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(249,246,241,0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-role {
    font-size: 0.68rem;
    color: rgba(249,246,241,0.3);
    letter-spacing: 0.04em;
  }

  /* ── Main Area ── */
  .ad-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-x: hidden;
  }

  /* ── Topbar ── */
  .ad-topbar {
    background: rgba(247,245,240,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 50;
    animation: fadeDown 0.5s ease both;
  }

  .topbar-left {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .topbar-greeting {
    font-size: 0.7rem;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
  }

  .topbar-page {
    font-family: var(--font-display);
    font-size: 1.15rem;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  .topbar-page em { font-style: italic; color: var(--accent); }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .topbar-search {
    position: relative;
  }

  .topbar-search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
    font-size: 0.85rem;
    pointer-events: none;
  }

  .topbar-search input {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5rem 1rem 0.5rem 2.2rem;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--ink);
    width: 220px;
    outline: none;
    transition: all 0.2s;
  }

  .topbar-search input::placeholder { color: var(--ink-faint); }
  .topbar-search input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .topbar-btn {
    background: var(--surface);
    border: 1.5px solid var(--border);
    color: var(--ink-muted);
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .topbar-btn:hover { border-color: var(--border-strong); color: var(--ink); }

  .notif-dot {
    position: relative;
  }

  .notif-dot::after {
    content: '';
    position: absolute;
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    background: #b83232;
    border-radius: 50%;
    border: 1.5px solid var(--bg);
  }

  /* ── Page Content ── */
  .ad-page {
    flex: 1;
    padding: 2rem;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  /* ── Stat Cards ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    padding: 1.4rem 1.5rem;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s ease both;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(122,106,82,0.4), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
  .stat-card:hover::before { opacity: 1; }

  .stat-card.accent-green { border-color: rgba(46,125,82,0.2); }
  .stat-card.accent-red { border-color: rgba(184,50,50,0.18); }
  .stat-card.accent-amber { border-color: rgba(184,92,26,0.2); }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .stat-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .stat-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    background: rgba(122,106,82,0.1);
    color: var(--accent);
  }

  .stat-icon.green { background: rgba(46,125,82,0.1); color: #2e7d52; }
  .stat-icon.red { background: rgba(184,50,50,0.1); color: #b83232; }
  .stat-icon.amber { background: rgba(184,92,26,0.1); color: #b85c1a; }

  .stat-value {
    font-family: var(--font-display);
    font-size: 2rem;
    letter-spacing: -0.04em;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .stat-sub {
    font-size: 0.78rem;
    color: var(--ink-faint);
    font-weight: 300;
  }

  .stat-delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.15rem 0.5rem;
    border-radius: 100px;
    margin-left: 0.5rem;
  }

  .stat-delta.up { background: rgba(46,125,82,0.1); color: #2e7d52; }
  .stat-delta.down { background: rgba(184,50,50,0.1); color: #b83232; }

  /* ── Dashboard Grid ── */
  .dash-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .dash-grid-full { grid-column: 1 / -1; }

  /* ── Panel ── */
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    overflow: hidden;
    animation: fadeUp 0.55s ease 0.15s both;
  }

  .panel-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  .panel-title em { font-style: italic; color: var(--accent); }

  .panel-count {
    font-size: 0.72rem;
    color: var(--ink-faint);
    background: rgba(0,0,0,0.04);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .panel-actions { display: flex; gap: 0.5rem; align-items: center; }

  /* ── Category Bar Chart ── */
  .cat-chart {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .cat-bar-row {
    display: grid;
    grid-template-columns: 100px 1fr 48px;
    align-items: center;
    gap: 0.75rem;
  }

  .cat-bar-label {
    font-size: 0.82rem;
    color: var(--ink-muted);
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cat-bar-track {
    height: 8px;
    background: rgba(0,0,0,0.05);
    border-radius: 100px;
    overflow: hidden;
  }

  .cat-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, #c8a97a, #8a6a42);
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cat-bar-val {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink-muted);
    text-align: right;
  }

  /* ── Stock donut-style indicator ── */
  .stock-indicators {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .stock-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.4);
    transition: all 0.18s;
    cursor: pointer;
  }

  .stock-item:hover { background: rgba(255,255,255,0.75); border-color: var(--border-strong); }

  .stock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .stock-dot.ok { background: #2e7d52; }
  .stock-dot.low { background: #b85c1a; }
  .stock-dot.out { background: #b83232; }

  .stock-name {
    flex: 1;
    font-size: 0.84rem;
    color: var(--ink);
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stock-id {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: var(--ink-faint);
  }

  .stock-badge {
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.18rem 0.55rem;
    border-radius: 100px;
    white-space: nowrap;
  }

  .stock-badge.ok { background: var(--success-bg); color: var(--success); }
  .stock-badge.low { background: var(--warning-bg); color: var(--warning); }
  .stock-badge.out { background: var(--danger-bg); color: var(--danger); }

  /* ── Activity Feed ── */
  .activity-feed {
    padding: 0.5rem 0;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 0.85rem 1.5rem;
    transition: background 0.15s;
    border-bottom: 1px solid var(--border);
  }

  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { background: rgba(255,255,255,0.5); }

  .activity-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    flex-shrink: 0;
    margin-top: 0.05rem;
  }

  .activity-icon.add { background: rgba(46,125,82,0.12); color: #2e7d52; }
  .activity-icon.edit { background: rgba(122,106,82,0.12); color: var(--accent); }
  .activity-icon.delete { background: rgba(184,50,50,0.1); color: #b83232; }
  .activity-icon.user { background: rgba(80,100,160,0.1); color: #4a5a9a; }

  .activity-msg {
    font-size: 0.83rem;
    color: var(--ink-muted);
    line-height: 1.45;
    flex: 1;
  }

  .activity-time {
    font-size: 0.7rem;
    color: var(--ink-faint);
    white-space: nowrap;
    margin-top: 0.1rem;
  }

  /* ── Users Table ── */
  .users-table-wrap {
    overflow-x: auto;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table th {
    text-align: left;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-faint);
    padding: 0.85rem 1.25rem;
    background: rgba(247,245,240,0.5);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .users-table td {
    padding: 0.9rem 1.25rem;
    font-size: 0.85rem;
    color: var(--ink);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .users-table tbody tr { transition: background 0.15s; }
  .users-table tbody tr:hover { background: rgba(255,255,255,0.6); }
  .users-table tbody tr:last-child td { border-bottom: none; }

  .u-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8b89a, #9a7850);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
    font-family: var(--font-display);
  }

  .u-name-cell { display: flex; align-items: center; gap: 0.75rem; }
  .u-name { font-weight: 500; }
  .u-email { font-size: 0.78rem; color: var(--ink-faint); }

  .role-badge {
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    letter-spacing: 0.03em;
  }

  .role-badge.Admin { background: rgba(122,106,82,0.15); color: var(--accent); }
  .role-badge.Editor { background: rgba(80,100,160,0.1); color: #4a5a9a; }
  .role-badge.Viewer { background: rgba(0,0,0,0.05); color: var(--ink-muted); }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.65rem;
    border-radius: 100px;
  }

  .status-pill.active { background: var(--success-bg); color: var(--success); }
  .status-pill.inactive { background: rgba(0,0,0,0.05); color: var(--ink-faint); }
  .status-pill::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* ── Products Table ── */
  .products-toolbar {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .pt-search {
    position: relative;
    flex: 1;
    min-width: 180px;
  }

  .pt-search-icon {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
    font-size: 0.85rem;
    pointer-events: none;
  }

  .pt-search input {
    width: 100%;
    background: rgba(255,255,255,0.5);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.55rem 0.9rem 0.55rem 2.1rem;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
    transition: all 0.2s;
  }

  .pt-search input::placeholder { color: var(--ink-faint); }
  .pt-search input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: rgba(255,255,255,0.85);
  }

  .pt-cat-select {
    background: rgba(255,255,255,0.5);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.55rem 0.9rem;
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pt-cat-select:focus { border-color: var(--accent); }

  .btn-sm {
    background: var(--ink);
    color: #F7F5F0;
    border: none;
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.55rem 1.1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-sm:hover { background: #2e2e2a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.13); }

  .btn-sm-ghost {
    background: none;
    border: 1.5px solid var(--border);
    color: var(--ink-muted);
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 400;
    padding: 0.52rem 0.9rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-sm-ghost:hover { border-color: var(--border-strong); color: var(--ink); }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .items-table th {
    text-align: left;
    font-size: 0.67rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-faint);
    padding: 0.85rem 1.25rem;
    background: rgba(247,245,240,0.5);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .items-table td {
    padding: 0.9rem 1.25rem;
    color: var(--ink);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .items-table tbody tr { transition: background 0.15s; }
  .items-table tbody tr:hover { background: rgba(255,255,255,0.6); }
  .items-table tbody tr:last-child td { border-bottom: none; }

  .item-id-badge {
    font-family: 'Courier New', monospace;
    font-size: 0.72rem;
    color: var(--ink-muted);
    background: rgba(0,0,0,0.04);
    padding: 0.18rem 0.45rem;
    border-radius: 4px;
  }

  .item-img-thumb {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: rgba(0,0,0,0.05);
    border: 1px dashed var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: var(--ink-faint);
    letter-spacing: 0.03em;
  }

  .cat-tag {
    font-size: 0.72rem;
    font-weight: 500;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    background: var(--accent-light);
    color: var(--accent);
  }

  .qty-cell { font-variant-numeric: tabular-nums; font-weight: 500; }
  .qty-cell.ok { color: var(--success); }
  .qty-cell.low { color: var(--warning); }
  .qty-cell.out { color: var(--danger); }

  .row-btns { display: flex; gap: 0.4rem; }

  .btn-row-edit {
    background: none;
    border: 1.5px solid var(--border);
    color: var(--ink-muted);
    font-size: 0.72rem;
    padding: 0.28rem 0.65rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.18s;
    font-family: var(--font-body);
  }

  .btn-row-edit:hover { border-color: var(--ink); color: var(--ink); }

  .btn-row-del {
    background: none;
    border: 1.5px solid rgba(184,50,50,0.2);
    color: var(--danger);
    font-size: 0.72rem;
    padding: 0.28rem 0.65rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.18s;
    font-family: var(--font-body);
  }

  .btn-row-del:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* ── Category breakdown summary ── */
  .cat-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
  }

  .cat-summary-card {
    padding: 1.1rem 1.2rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: rgba(255,255,255,0.5);
    transition: all 0.18s;
  }

  .cat-summary-card:hover {
    border-color: var(--accent);
    background: rgba(255,255,255,0.8);
    transform: translateY(-1px);
  }

  .cat-summary-name {
    font-size: 0.78rem;
    color: var(--ink-muted);
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .cat-summary-val {
    font-family: var(--font-display);
    font-size: 1.5rem;
    letter-spacing: -0.03em;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .cat-summary-items {
    font-size: 0.72rem;
    color: var(--ink-faint);
  }

  /* ── Empty ── */
  .empty-state {
    text-align: center;
    padding: 3.5rem 2rem;
    color: var(--ink-faint);
  }

  .empty-icon { font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.4; }
  .empty-msg { font-size: 0.88rem; font-weight: 300; }

  /* ── Misc ── */
  .section-gap { height: 1rem; }

  .no-items-row td {
    text-align: center;
    padding: 3rem;
    color: var(--ink-faint);
    font-size: 0.85rem;
    font-style: italic;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

const qtyStatus = (qty) => {
  const n = parseInt(qty);
  if (n === 0) return "out";
  if (n <= 5) return "low";
  return "ok";
};

const qtyLabel = (qty) => {
  const n = parseInt(qty);
  if (n === 0) return "Out of Stock";
  if (n <= 5) return "Low Stock";
  return "In Stock";
};

const activityIconClass = { add: "add", edit: "edit", delete: "delete", user: "user" };
const activityIcon = { add: "＋", edit: "✎", delete: "✕", user: "◉" };

// ─── Subpages ─────────────────────────────────────────────────────────────────

// Overview / Dashboard
function PageOverview({ inventory, users }) {
  const totalItems = inventory.length;
  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const lowStock = inventory.filter(i => parseInt(i.itemQty) <= 5 && parseInt(i.itemQty) > 0);
  const outStock = inventory.filter(i => parseInt(i.itemQty) === 0);
  const activeUsers = users.filter(u => u.status === "active").length;

  const categories = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))];
  const catData = categories.map(cat => ({
    name: cat,
    count: inventory.filter(i => i.itemCategory === cat).length,
    stock: inventory.filter(i => i.itemCategory === cat).reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0),
  })).sort((a, b) => b.stock - a.stock);

  const maxStock = Math.max(...catData.map(c => c.stock), 1);

  const criticalItems = inventory
    .filter(i => parseInt(i.itemQty) <= 5)
    .sort((a, b) => parseInt(a.itemQty) - parseInt(b.itemQty))
    .slice(0, 6);

  return (
    <>
      {/* Stats Row */}
      <div className="stats-row">
        {[
          { label: "Total Items", value: totalItems, sub: "in collection", icon: "◼", delta: null, cls: "" },
          { label: "Total Stock", value: totalStock, sub: "units across all items", icon: "▦", delta: null, cls: "" },
          { label: "Active Users", value: activeUsers, sub: `of ${users.length} total`, icon: "◉", delta: null, cls: "accent-green" },
          { label: "Low / Out of Stock", value: lowStock.length + outStock.length, sub: `${outStock.length} out of stock`, icon: "⚠", delta: null, cls: outStock.length > 0 ? "accent-red" : "accent-amber" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls === "accent-green" ? "green" : s.cls === "accent-red" ? "red" : s.cls === "accent-amber" ? "amber" : ""}`}>
                {s.icon}
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Category breakdown */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock by <em>Category</em></span>
            <span className="panel-count">{categories.length} categories</span>
          </div>
          <div className="cat-chart">
            {catData.map(cat => (
              <div className="cat-bar-row" key={cat.name}>
                <span className="cat-bar-label">{cat.name}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${(cat.stock / maxStock) * 100}%` }} />
                </div>
                <span className="cat-bar-val">{cat.stock}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock <em>Alerts</em></span>
            <span className="panel-count">{criticalItems.length} items</span>
          </div>
          <div className="stock-indicators">
            {criticalItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <p className="empty-msg">All items well stocked</p>
              </div>
            ) : criticalItems.map(item => {
              const st = qtyStatus(item.itemQty);
              return (
                <div className="stock-item" key={item.id}>
                  <div className={`stock-dot ${st}`} />
                  <span className="stock-name">{item.itemName}</span>
                  <span className="stock-id">{item.itemId}</span>
                  <span className={`stock-badge ${st}`}>{parseInt(item.itemQty) === 0 ? "Out" : `${item.itemQty} left`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="panel" style={{ marginBottom: "1rem" }}>
        <div className="panel-header">
          <span className="panel-title">Category <em>Breakdown</em></span>
        </div>
        <div className="cat-summary-grid">
          {catData.map(cat => (
            <div className="cat-summary-card" key={cat.name}>
              <div className="cat-summary-name">{cat.name}</div>
              <div className="cat-summary-val">{cat.stock}</div>
              <div className="cat-summary-items">{cat.count} {cat.count === 1 ? "item" : "items"}</div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

// Products Management
function PageProducts({ inventory, setInventory }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))].sort();
    return ["All", ...cats];
  }, [inventory]);

  const filtered = useMemo(() => {
    let list = inventory;
    if (catFilter !== "All") list = list.filter(i => i.itemCategory === catFilter);
    if (search.trim())
      list = list.filter(i =>
        i.itemId?.toLowerCase().includes(search.toLowerCase()) ||
        i.itemName?.toLowerCase().includes(search.toLowerCase()) ||
        i.itemDetails?.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [inventory, catFilter, search]);

  const handleDelete = (id) => {
    if (window.confirm("Remove this item from inventory?")) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const lowCount = inventory.filter(i => parseInt(i.itemQty) <= 5).length;

  return (
    <>
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Total Products", value: inventory.length, icon: "◼", cls: "" },
          { label: "Total Units", value: totalStock, icon: "▦", cls: "" },
          { label: "Low / Out Stock", value: lowCount, icon: "⚠", cls: lowCount > 3 ? "accent-red" : "accent-amber" },
          { label: "Categories", value: categories.length - 1, icon: "⊞", cls: "accent-green" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls === "accent-green" ? "green" : s.cls === "accent-red" ? "red" : s.cls === "accent-amber" ? "amber" : ""}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Product <em>Catalogue</em></span>
          <div className="panel-actions">
            <button className="btn-sm" onClick={() => window.location.href = "/additem"}>+ Add Item</button>
          </div>
        </div>

        <div className="products-toolbar">
          <div className="pt-search">
            <span className="pt-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by name, ID or details…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="pt-cat-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginLeft: "auto" }}>
            {filtered.length} of {inventory.length} items
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="items-table">
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
                <tr className="no-items-row"><td colSpan="8">No items match your filters.</td></tr>
              ) : filtered.map(item => {
                const st = qtyStatus(item.itemQty);
                return (
                  <tr key={item.id}>
                    <td><span className="item-id-badge">{item.itemId}</span></td>
                    <td>
                      {item.itemImage
                        ? <img src={`http://localhost:8080/uploads/${item.itemImage}`} alt={item.itemName} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }} />
                        : <div className="item-img-thumb">No img</div>
                      }
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.itemName}</td>
                    <td><span className="cat-tag">{item.itemCategory}</span></td>
                    <td><span className={`qty-cell ${st}`}>{item.itemQty}</span></td>
                    <td><span className={`stock-badge ${st}`}>{qtyLabel(item.itemQty)}</span></td>
                    <td style={{ color: "var(--ink-muted)", fontSize: "0.81rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.itemDetails}</td>
                    <td>
                      <div className="row-btns">
                        <button className="btn-row-edit" onClick={() => window.location.href = `/updateItem/${item.id}`}>Edit</button>
                        <button className="btn-row-del" onClick={() => handleDelete(item.id)}>✕</button>
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

// Users Management
function PageUsers({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const roles = ["All", "Admin", "Editor", "Viewer"];

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "All") list = list.filter(u => u.role === roleFilter);
    if (search.trim())
      list = list.filter(u =>
        u.id.toString().includes(search) ||
        u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [users, roleFilter, search]);

  const handleDelete = (id) => {
    if (window.confirm("Remove this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const activeCount = users.filter(u => u.status === "active").length;
  const roleBreakdown = roles.slice(1).map(r => ({ role: r, count: users.filter(u => u.role === r).length }));

  return (
    <>
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Total Users", value: users.length, icon: "◉", cls: "" },
          { label: "Active", value: activeCount, icon: "✓", cls: "accent-green" },
          { label: "Inactive", value: users.length - activeCount, icon: "◯", cls: "" },
          ...roleBreakdown.map(r => ({ label: r.role + "s", value: r.count, icon: "⊛", cls: "" })),
        ].slice(0, 4).map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls === "accent-green" ? "green" : ""}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">User <em>Management</em></span>
          <div className="panel-actions">
            <button className="btn-sm" onClick={() => window.location.href = "/register"}>+ Add User</button>
          </div>
        </div>

        <div className="products-toolbar">
          <div className="pt-search">
            <span className="pt-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="pt-cat-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginLeft: "auto" }}>
            {filtered.length} of {users.length} users
          </span>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--ink-faint)", fontStyle: "italic" }}>No users match your search.</td></tr>
              ) : filtered.map((user, i) => (
                <tr key={user.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td>
                    <div className="u-name-cell">
                      <div className="u-avatar">{getInitials(user.userName)}</div>
                      <div>
                        <div className="u-name">{user.userName}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--ink-faint)", fontFamily: "'Courier New', monospace" }}>#{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="u-email">{user.email}</td>
                  <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                  <td style={{ color: "var(--ink-muted)", fontSize: "0.82rem" }}>{user.joinDate}</td>
                  <td>
                    <button
                      className={`status-pill ${user.status}`}
                      onClick={() => toggleStatus(user.id)}
                      style={{ cursor: "pointer", border: "none", fontFamily: "var(--font-body)" }}
                      title="Click to toggle status"
                    >
                      {user.status}
                    </button>
                  </td>
                  <td>
                    <div className="row-btns">
                      <button className="btn-row-edit" onClick={() => window.location.href = `/updateUser/${user.id}`}>Edit</button>
                      <button className="btn-row-del" onClick={() => handleDelete(user.id)}>✕</button>
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

// Analytics Page
function PageAnalytics({ inventory, users }) {
  const categories = [...new Set(inventory.map(i => i.itemCategory).filter(Boolean))].sort();
  const catData = categories.map(cat => {
    const items = inventory.filter(i => i.itemCategory === cat);
    return {
      name: cat,
      count: items.length,
      stock: items.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0),
      lowCount: items.filter(i => parseInt(i.itemQty) <= 5).length,
    };
  }).sort((a, b) => b.stock - a.stock);

  const maxStock = Math.max(...catData.map(c => c.stock), 1);
  const maxCount = Math.max(...catData.map(c => c.count), 1);

  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.itemQty) || 0), 0);
  const inStock = inventory.filter(i => parseInt(i.itemQty) > 5).length;
  const lowStock = inventory.filter(i => parseInt(i.itemQty) <= 5 && parseInt(i.itemQty) > 0).length;
  const outStock = inventory.filter(i => parseInt(i.itemQty) === 0).length;

  const roleCount = ["Admin", "Editor", "Viewer"].map(r => ({
    role: r,
    count: users.filter(u => u.role === r).length,
    pct: Math.round((users.filter(u => u.role === r).length / users.length) * 100),
  }));

  const stockDistribution = [
    { label: "In Stock", value: inStock, pct: Math.round(inStock / inventory.length * 100), color: "#2e7d52" },
    { label: "Low Stock", value: lowStock, pct: Math.round(lowStock / inventory.length * 100), color: "#b85c1a" },
    { label: "Out of Stock", value: outStock, pct: Math.round(outStock / inventory.length * 100), color: "#b83232" },
  ];

  return (
    <>
      {/* KPIs */}
      <div className="stats-row" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Inventory Health", value: `${Math.round(inStock / inventory.length * 100)}%`, sub: "items fully stocked", cls: "accent-green" },
          { label: "Avg. Stock / Item", value: Math.round(totalStock / inventory.length), sub: "units per item", cls: "" },
          { label: "Most Stocked Cat.", value: catData[0]?.name || "—", sub: `${catData[0]?.stock || 0} units`, cls: "" },
          { label: "Largest Category", value: [...catData].sort((a, b) => b.count - a.count)[0]?.name || "—", sub: `${[...catData].sort((a, b) => b.count - a.count)[0]?.count || 0} items`, cls: "" },
        ].map((s, i) => (
          <div className={`stat-card ${s.cls}`} key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
              <div className={`stat-icon ${s.cls === "accent-green" ? "green" : ""}`}>◈</div>
            </div>
            <div className="stat-value" style={{ fontSize: typeof s.value === "string" && s.value.length > 4 ? "1.3rem" : "2rem" }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Stock status distribution */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Stock <em>Distribution</em></span>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {stockDistribution.map(s => (
              <div key={s.label} style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--ink-muted)", fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: "0.82rem", color: s.color, fontWeight: 600 }}>{s.value} items <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>({s.pct}%)</span></span>
                </div>
                <div style={{ height: 10, background: "rgba(0,0,0,0.05)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 100, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </div>
              </div>
            ))}

            {/* Category stock bars */}
            <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "1rem" }}>
                Stock Units by Category
              </p>
              {catData.map(cat => (
                <div className="cat-bar-row" key={cat.name} style={{ marginBottom: "0.75rem" }}>
                  <span className="cat-bar-label">{cat.name}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${(cat.stock / maxStock) * 100}%` }} />
                  </div>
                  <span className="cat-bar-val">{cat.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Roles + Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">User <em>Roles</em></span>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {roleCount.map(r => (
                <div key={r.role}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span className={`role-badge ${r.role}`}>{r.role}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", fontWeight: 500 }}>{r.count} users ({r.pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${r.pct}%`, background: r.role === "Admin" ? "#c8a97a" : r.role === "Editor" ? "#4a5a9a" : "#9a9a8a", borderRadius: 100, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Category <em>Items</em></span>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {catData.map(cat => (
                <div key={cat.name} className="cat-bar-row">
                  <span className="cat-bar-label">{cat.name}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${(cat.count / maxCount) * 100}%`, background: "linear-gradient(90deg, #8a9abc, #4a5a9a)" }} />
                  </div>
                  <span className="cat-bar-val">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top items by qty */}
      <div className="panel" style={{ marginTop: "1rem" }}>
        <div className="panel-header">
          <span className="panel-title">Top Items by <em>Stock Volume</em></span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>ID</th>
                <th>Category</th>
                <th>Units</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...inventory].sort((a, b) => parseInt(b.itemQty) - parseInt(a.itemQty)).slice(0, 8).map((item, i) => {
                const st = qtyStatus(item.itemQty);
                return (
                  <tr key={item.id}>
                    <td style={{ color: "var(--ink-faint)", fontSize: "0.8rem", fontWeight: 600 }}>#{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{item.itemName}</td>
                    <td><span className="item-id-badge">{item.itemId}</span></td>
                    <td><span className="cat-tag">{item.itemCategory}</span></td>
                    <td><span className={`qty-cell ${st}`}>{item.itemQty}</span></td>
                    <td><span className={`stock-badge ${st}`}>{qtyLabel(item.itemQty)}</span></td>
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

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");

  const navItems = [
    { id: "overview", label: "Overview", icon: "⊞", section: null },
    { id: "analytics", label: "Analytics", icon: "◈", section: null },
    { id: "products", label: "Products", icon: "◼", section: "Management" },
    { id: "users", label: "Users", icon: "◉", section: "Management" },
  ];

  const pageTitles = {
    overview: ["Dashboard", "Overview"],
    analytics: ["Analytics", "Insights"],
    products: ["Products", "Management"],
    users: ["Users", "Management"],
  };

  const lowStockCount = inventory.filter(i => parseInt(i.itemQty) <= 5).length;
  const [title, subtitle] = pageTitles[activePage];

  return (
    <>
      <style>{styles}</style>
      <div className="ad-shell">

        {/* Sidebar */}
        <aside className="ad-sidebar">
          <div className="sidebar-brand">
            <div className="brand-name">Ely<em>Mon</em></div>
            <div className="brand-tag">Admin Console</div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item, i) => {
              const prevSection = i > 0 ? navItems[i - 1].section : null;
              return (
                <React.Fragment key={item.id}>
                  {item.section && item.section !== prevSection && (
                    <div className="nav-section-label">{item.section}</div>
                  )}
                  <button
                    className={`nav-item ${activePage === item.id ? "active" : ""}`}
                    onClick={() => setActivePage(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                    {item.id === "products" && lowStockCount > 0 && (
                      <span style={{ marginLeft: "auto", background: "rgba(184,92,26,0.2)", color: "#b85c1a", fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "100px" }}>
                        {lowStockCount}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}

            <div className="nav-section-label">System</div>
            <button className="nav-item" onClick={() => window.location.href = "/"}>
              <span className="nav-icon">⌂</span>
              Back to Site
            </button>
            <button className="nav-item" onClick={() => window.location.href = "/allItems"}>
              <span className="nav-icon">🏪</span>
              Shop View
            </button>
            <button className="nav-item" onClick={() => window.location.href = "/displayUsers"}>
              <span className="nav-icon">⊡</span>
              User Management
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-admin">
              <div className="admin-avatar">ES</div>
              <div className="admin-info">
                <div className="admin-name">Admin</div>
                <div className="admin-role">Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="ad-main">

          {/* Topbar */}
          <div className="ad-topbar">
            <div className="topbar-left">
              <div className="topbar-greeting">Saturday, 7 March 2026</div>
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
              <button className={`topbar-btn ${lowStockCount > 0 ? "notif-dot" : ""}`} title="Alerts">⚑</button>
              <button className="topbar-btn" onClick={() => window.location.href = "/admin/profile"} title="Profile">⊗</button>
              
            </div>
          </div>

          {/* Page */}
          <div className="ad-page">
            {activePage === "overview" && <PageOverview inventory={inventory} users={users} />}
            {activePage === "analytics" && <PageAnalytics inventory={inventory} users={users} />}
            {activePage === "products" && <PageProducts inventory={inventory} setInventory={setInventory} />}
            {activePage === "users" && <PageUsers users={users} setUsers={setUsers} />}
          </div>
        </div>
      </div>
    </>
  );
}