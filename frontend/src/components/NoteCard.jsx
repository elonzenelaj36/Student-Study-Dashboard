// ============================================================
// components/NoteCard.jsx — Displays a single note
// ============================================================

import React from "react";

function NoteCard({ note, onEdit, onDelete }) {
  // Format the creation date nicely
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="note-card">
      {/* ── Card Header: title + action buttons ─────────── */}
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>

        {/* Edit and Delete buttons (visible on hover via CSS) */}
        <div className="note-card-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            ✏️
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(note.id)}
            title="Delete note"
            style={{ color: "var(--danger)" }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ── Content preview (truncated via CSS) ─────────── */}
      <p className="note-card-content">{note.content}</p>

      {/* ── Footer: category badge + date ───────────────── */}
      <div className="note-card-footer">
        <span className="badge badge-accent">{note.category}</span>
        <span className="note-card-date">{formattedDate}</span>
      </div>
    </div>
  );
}

export default NoteCard;
