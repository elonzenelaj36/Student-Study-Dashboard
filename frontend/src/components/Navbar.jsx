// ============================================================
// components/Navbar.jsx — Top navigation bar with live clock
// ============================================================

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/navbar.css";

// Map routes to human-readable page names
const PAGE_NAMES = {
  "/": "Dashboard",
  "/notes": "Notes",
  "/tasks": "Tasks",
  "/timer": "Study Timer",
};

function Navbar() {
  // Track current time for the live clock
  const [now, setNow] = useState(new Date());
  const location = useLocation();

  // Update the clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Format the date as "Monday, June 29, 2026"
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time as "14:35:02"
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const currentPage = PAGE_NAMES[location.pathname] || "Page";

  return (
    <header className="navbar">
      {/* ── Left: Breadcrumb ─────────────────────────────── */}
      <div className="navbar-breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>StudyHub</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span>{currentPage}</span>
      </div>

      {/* ── Right: Clock + Avatar ────────────────────────── */}
      <div className="navbar-right">
        <div className="navbar-datetime">
          <div className="navbar-time">{formattedTime}</div>
          <div className="navbar-date">{formattedDate}</div>
        </div>
        <div className="navbar-avatar" title="Student">S</div>
      </div>
    </header>
  );
}

export default Navbar;
