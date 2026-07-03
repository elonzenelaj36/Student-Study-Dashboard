// ============================================================
// server.js — Main entry point for the Study Dashboard API
// ============================================================

const express = require("express");
const cors = require("cors");
const notesRouter = require("./routes/notes");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = 5000;

// ── Middleware ──────────────────────────────────────────────
// Allow requests from the React dev server (port 5173)
app.use(cors({ origin: "http://localhost:5173" }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/notes", notesRouter);
app.use("/api/tasks", tasksRouter);

// ── Health check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Study Dashboard API is running ✅" });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
