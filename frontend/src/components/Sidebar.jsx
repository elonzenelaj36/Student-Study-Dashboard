// ============================================================
// components/Sidebar.jsx — Fixed left navigation panel
// ============================================================

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../css/sidebar.css";

// Navigation items with emoji icons and route paths
const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/notes", label: "Notes", icon: "📝" },
  { path: "/tasks", label: "Tasks", icon: "✅" },
  { path: "/timer", label: "Study Timer", icon: "⏱️" },
];

function Sidebar() {
  const location = useLocation();

  // Get the current page label for display
  const currentPage =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.label ||
    "Dashboard";

  return (
    <aside className="sidebar">
      {/* ── Logo / Branding ─────────────────────────────── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📚</div>
        <div>
          <div className="sidebar-logo-text">StudyHub</div>
          <div className="sidebar-logo-sub">Student Dashboard</div>
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────────── */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            // NavLink gives us the `isActive` prop automatically
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            // Exact match for the home route
            end={item.path === "/"}
          >
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* ── Sidebar Footer ───────────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          <strong>Student Study Dashboard</strong>
          <br />
          Built with React + Node.js
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
