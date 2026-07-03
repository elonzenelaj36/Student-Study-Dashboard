// ============================================================
// pages/Dashboard.jsx — Homepage with stats and previews
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/dashboard.css";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch both notes and tasks on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [notesRes, tasksRes] = await Promise.all([
          fetch("/api/notes"),
          fetch("/api/tasks"),
        ]);

        if (!notesRes.ok || !tasksRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const notesData = await notesRes.json();
        const tasksData = await tasksRes.json();

        setNotes(notesData);
        setTasks(tasksData);
      } catch (err) {
        setError("Could not load data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Derived counts for the stats cards
  const totalNotes = notes.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Get hour for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* ── Welcome Banner ───────────────────────────────── */}
      <div className="welcome-banner">
        <div>
          <h2>{greeting}, Student! 👋</h2>
          <p>Here's what's happening with your studies today.</p>
        </div>
        <div className="welcome-banner-emoji">🎓</div>
      </div>

      {/* ── Error message ─────────────────────────────────── */}
      {error && <div className="error-msg">⚠️ {error}</div>}

      {/* ── Stats Grid ───────────────────────────────────── */}
      <div className="stats-grid">
        {/* Total Notes */}
        <div
          className="stat-card"
          style={{ "--stat-color": "#4f46e5", "--stat-bg": "rgba(79,70,229,0.12)" }}
        >
          <div className="stat-card-top">
            <span className="stat-card-label">Total Notes</span>
            <div className="stat-card-icon">📝</div>
          </div>
          <div className="stat-card-value">{totalNotes}</div>
          <div className="stat-card-sub">
            {totalNotes === 1 ? "1 note created" : `${totalNotes} notes created`}
          </div>
        </div>

        {/* Total Tasks */}
        <div
          className="stat-card"
          style={{ "--stat-color": "#f59e0b", "--stat-bg": "rgba(245,158,11,0.12)" }}
        >
          <div className="stat-card-top">
            <span className="stat-card-label">Total Tasks</span>
            <div className="stat-card-icon">📋</div>
          </div>
          <div className="stat-card-value">{totalTasks}</div>
          <div className="stat-card-sub">{pendingTasks} pending</div>
        </div>

        {/* Completed Tasks */}
        <div
          className="stat-card"
          style={{ "--stat-color": "#22c55e", "--stat-bg": "rgba(34,197,94,0.12)" }}
        >
          <div className="stat-card-top">
            <span className="stat-card-label">Completed</span>
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value">{completedTasks}</div>
          <div className="stat-card-sub">
            {totalTasks > 0
              ? `${Math.round((completedTasks / totalTasks) * 100)}% done`
              : "No tasks yet"}
          </div>
        </div>

        {/* Study Sessions hint */}
        <div
          className="stat-card"
          style={{ "--stat-color": "#ec4899", "--stat-bg": "rgba(236,72,153,0.12)" }}
        >
          <div className="stat-card-top">
            <span className="stat-card-label">Pomodoro</span>
            <div className="stat-card-icon">⏱️</div>
          </div>
          <div className="stat-card-value">25</div>
          <div className="stat-card-sub">min per session</div>
        </div>
      </div>

      {/* ── Recent Notes + Recent Tasks ───────────────────── */}
      <div className="dashboard-sections">
        {/* Recent Notes preview */}
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-title">📝 Recent Notes</span>
            <Link to="/notes" className="dash-section-link">
              View all →
            </Link>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <div className="empty-icon">📭</div>
              <p>No notes yet. Go create one!</p>
            </div>
          ) : (
            notes.slice(-4).reverse().map((note) => (
              <div key={note.id} className="dash-item">
                <div style={{ minWidth: 0 }}>
                  <div className="dash-item-title">{note.title}</div>
                  <div className="dash-item-sub">{note.category}</div>
                </div>
                <span className="badge badge-accent" style={{ flexShrink: 0 }}>
                  {note.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Tasks preview */}
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-title">✅ Recent Tasks</span>
            <Link to="/tasks" className="dash-section-link">
              View all →
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <div className="empty-icon">📭</div>
              <p>No tasks yet. Add one!</p>
            </div>
          ) : (
            tasks.slice(-4).reverse().map((task) => (
              <div key={task.id} className="dash-item">
                <div style={{ minWidth: 0 }}>
                  <div
                    className="dash-item-title"
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed
                        ? "var(--text-muted)"
                        : "var(--text-primary)",
                    }}
                  >
                    {task.title}
                  </div>
                </div>
                <span className="dash-item-check">
                  {task.completed ? "✅" : "⬜"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
