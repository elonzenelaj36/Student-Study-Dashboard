// ============================================================
// routes/notes.js — CRUD endpoints for Notes
// ============================================================

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to the JSON file that stores notes
const DATA_FILE = path.join(__dirname, "../data/notes.json");

// ── Helper: read notes from disk ─────────────────────────────
function readNotes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ── Helper: write notes to disk ──────────────────────────────
function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf-8");
}

// ── GET /api/notes ───────────────────────────────────────────
// Returns all notes (optionally filtered by ?search= query)
router.get("/", (req, res) => {
  try {
    let notes = readNotes();

    // Optional: filter by search term on title
    const { search } = req.query;
    if (search) {
      const term = search.toLowerCase();
      notes = notes.filter((n) => n.title.toLowerCase().includes(term));
    }

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ── POST /api/notes ──────────────────────────────────────────
// Creates a new note and saves it to the JSON file
router.post("/", (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const notes = readNotes();

    const newNote = {
      id: Date.now().toString(), // simple unique ID using timestamp
      title,
      content,
      category: category || "General",
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);
    writeNotes(notes);

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ── PUT /api/notes/:id ───────────────────────────────────────
// Updates an existing note by ID
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const notes = readNotes();
    const index = notes.findIndex((n) => n.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Merge updated fields into the existing note
    notes[index] = {
      ...notes[index],
      title: title ?? notes[index].title,
      content: content ?? notes[index].content,
      category: category ?? notes[index].category,
    };

    writeNotes(notes);
    res.json(notes[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ── DELETE /api/notes/:id ────────────────────────────────────
// Deletes a note by ID
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    let notes = readNotes();
    const before = notes.length;

    notes = notes.filter((n) => n.id !== id);

    if (notes.length === before) {
      return res.status(404).json({ error: "Note not found" });
    }

    writeNotes(notes);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
