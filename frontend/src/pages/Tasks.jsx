// ============================================================
// pages/Tasks.jsx — Task management page
// ============================================================

import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import "../css/tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "completed"
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch tasks on mount and when filter changes
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const url =
        filter === "all" ? "/api/tasks" : `/api/tasks?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTasks(data);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  // Add a new task via the quick-add input
  async function handleAddTask() {
    const title = newTitle.trim();
    if (!title) return;

    setAdding(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();

      // Only add to list if current filter shows it
      if (filter === "all" || filter === "pending") {
        setTasks((prev) => [created, ...prev]);
      }
      setNewTitle("");
    } catch {
      setError("Failed to add task.");
    } finally {
      setAdding(false);
    }
  }

  // Toggle completed status
  async function handleToggle(id, completed) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();

      // If filter is "all", update in place; otherwise remove from filtered list
      if (filter === "all") {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      setError("Failed to update task.");
    }
  }

  // Edit task title inline
  async function handleEdit(id, title) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to update task.");
    }
  }

  // Delete a task
  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  }

  // Allow pressing Enter to add task
  function handleKeyDown(e) {
    if (e.key === "Enter") handleAddTask();
  }

  // For progress bar: always fetch all tasks count
  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setAllTasks)
      .catch(() => {});
  }, [tasks]);

  const completedCount = allTasks.filter((t) => t.completed).length;
  const totalCount = allTasks.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1>✅ Tasks</h1>
          <p>{totalCount} total · {completedCount} completed</p>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && <div className="error-msg">⚠️ {error}</div>}

      {/* ── Progress bar ─────────────────────────────────── */}
      {totalCount > 0 && (
        <div className="tasks-progress">
          <div className="tasks-progress-label">
            <span className="tasks-progress-text">
              Overall progress — {completedCount} of {totalCount} tasks done
            </span>
            <span className="tasks-progress-pct">{progressPct}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Controls: quick-add + filter tabs ────────────── */}
      <div className="tasks-controls">
        {/* Quick-add input */}
        <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}>
          <input
            className="form-input"
            placeholder="Add a new task and press Enter..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddTask}
            disabled={adding || !newTitle.trim()}
          >
            {adding ? "..." : "+ Add"}
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Task List ────────────────────────────────────── */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner"></div>
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {filter === "completed" ? "🎉" : "📋"}
          </div>
          <p>
            {filter === "completed"
              ? "No completed tasks yet. Keep going!"
              : filter === "pending"
              ? "No pending tasks. You're all caught up!"
              : "No tasks yet. Add your first one above!"}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
