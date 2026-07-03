// ============================================================
// components/TaskCard.jsx — Displays a single task row
// ============================================================

import React, { useState } from "react";

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  // Local state for inline title editing
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Confirm inline edit and send to parent
  function handleEditSave() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  }

  // Allow pressing Enter to save, Escape to cancel
  function handleKeyDown(e) {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") {
      setEditValue(task.title);
      setIsEditing(false);
    }
  }

  return (
    <div className={`task-card${task.completed ? " completed" : ""}`}>
      {/* ── Custom checkbox (circle) ─────────────────────── */}
      <button
        className={`task-checkbox${task.completed ? " checked" : ""}`}
        onClick={() => onToggle(task.id, !task.completed)}
        title={task.completed ? "Mark as pending" : "Mark as completed"}
      >
        {task.completed ? "✓" : ""}
      </button>

      {/* ── Task body: title or inline editor ────────────── */}
      <div className="task-card-body">
        {isEditing ? (
          <input
            className="task-edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <>
            <div className="task-card-title">{task.title}</div>
            <div className="task-card-date">Added {formattedDate}</div>
          </>
        )}
      </div>

      {/* ── Action buttons (visible on hover) ────────────── */}
      {!isEditing && (
        <div className="task-card-actions">
          <button
            className="btn-icon"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            style={{ color: "var(--danger)" }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
