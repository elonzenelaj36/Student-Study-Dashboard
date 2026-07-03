// ============================================================
// routes/tasks.js — CRUD endpoints for Tasks
// ============================================================

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to the JSON file that stores tasks
const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// ── Helper: read tasks from disk ─────────────────────────────
function readTasks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ── Helper: write tasks to disk ──────────────────────────────
function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// ── GET /api/tasks ───────────────────────────────────────────
// Returns all tasks (optionally filtered by ?status=completed|pending)
router.get("/", (req, res) => {
  try {
    let tasks = readTasks();

    const { status } = req.query;
    if (status === "completed") {
      tasks = tasks.filter((t) => t.completed === true);
    } else if (status === "pending") {
      tasks = tasks.filter((t) => t.completed === false);
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ── POST /api/tasks ──────────────────────────────────────────
// Creates a new task
router.post("/", (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const tasks = readTasks();

    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ── PUT /api/tasks/:id ───────────────────────────────────────
// Updates a task (title and/or completed status)
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const tasks = readTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Only update fields that were provided in the request
    tasks[index] = {
      ...tasks[index],
      title: title ?? tasks[index].title,
      completed: completed !== undefined ? completed : tasks[index].completed,
    };

    writeTasks(tasks);
    res.json(tasks[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ── DELETE /api/tasks/:id ────────────────────────────────────
// Deletes a task by ID
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    let tasks = readTasks();
    const before = tasks.length;

    tasks = tasks.filter((t) => t.id !== id);

    if (tasks.length === before) {
      return res.status(404).json({ error: "Task not found" });
    }

    writeTasks(tasks);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
