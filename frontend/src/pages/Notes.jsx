// ============================================================
// pages/Notes.jsx — Notes management page
// ============================================================

import React, { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import "../css/notes.css";

// Available categories for notes
const CATEGORIES = ["General", "React", "Node.js", "CSS", "JavaScript", "Math", "Science", "Other"];

// ── NoteFormModal ────────────────────────────────────────────
// Reusable modal for creating and editing notes
function NoteFormModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "General");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!note;

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = isEditing ? `/api/notes/${note.id}` : "/api/notes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), category }),
      });

      if (!res.ok) throw new Error("Save failed");

      const savedNote = await res.json();
      onSave(savedNote, isEditing);
      onClose();
    } catch {
      setError("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Close modal on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* ── Modal Header ─────────────────────────────── */}
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? "Edit Note" : "New Note"}</h2>
          <button className="btn-icon" onClick={onClose} title="Close">✕</button>
        </div>

        {/* ── Error ────────────────────────────────────── */}
        {error && <div className="error-msg">{error}</div>}

        {/* ── Form ─────────────────────────────────────── */}
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="e.g. React Hooks Overview"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-input"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notes Page ───────────────────────────────────────────────
function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create, object = edit

  // Fetch all notes from backend on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes(searchTerm = "") {
    try {
      setLoading(true);
      const url = searchTerm
        ? `/api/notes?search=${encodeURIComponent(searchTerm)}`
        : "/api/notes";
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotes(data);
    } catch {
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  // Debounce search: re-fetch after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Called when modal saves — update local state without re-fetching
  function handleSave(savedNote, isEditing) {
    if (isEditing) {
      setNotes((prev) =>
        prev.map((n) => (n.id === savedNote.id ? savedNote : n))
      );
    } else {
      setNotes((prev) => [...prev, savedNote]);
    }
  }

  // Delete a note by ID
  async function handleDelete(id) {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Failed to delete note.");
    }
  }

  function openCreate() {
    setEditingNote(null);
    setShowModal(true);
  }

  function openEdit(note) {
    setEditingNote(note);
    setShowModal(true);
  }

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1>📝 Notes</h1>
          <p>{notes.length} {notes.length === 1 ? "note" : "notes"} total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New Note
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && <div className="error-msg">⚠️ {error}</div>}

      {/* ── Search Bar ───────────────────────────────────── */}
      <div className="notes-controls">
        <div className="notes-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input notes-search"
            placeholder="Search notes by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Notes Grid ───────────────────────────────────── */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner"></div>
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>
            {search
              ? `No notes matching "${search}"`
              : "No notes yet. Create your first one!"}
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────── */}
      {showModal && (
        <NoteFormModal
          note={editingNote}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Notes;
