# 📚 Student Study Dashboard

A full-stack web application for students to manage notes, track tasks, and stay focused with a Pomodoro study timer.

**Tech Stack:** React (Vite) · Plain CSS · Node.js · Express · JSON file storage

---

## 🚀 Quick Start

You need **two terminals** — one for the backend, one for the frontend.

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
# Server runs at http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 📁 Project Structure

```
student-study-dashboard/
├── backend/
│   ├── server.js           # Express entry point
│   ├── routes/
│   │   ├── notes.js        # GET / POST / PUT / DELETE /api/notes
│   │   └── tasks.js        # GET / POST / PUT / DELETE /api/tasks
│   ├── data/
│   │   ├── notes.json      # Notes stored here (JSON file)
│   │   └── tasks.json      # Tasks stored here (JSON file)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx     # Fixed left navigation
    │   │   ├── Navbar.jsx      # Top bar with live clock
    │   │   ├── Footer.jsx      # Bottom footer
    │   │   ├── NoteCard.jsx    # Single note display
    │   │   └── TaskCard.jsx    # Single task row (inline edit)
    │   ├── pages/
    │   │   ├── Dashboard.jsx   # Stats overview + recent items
    │   │   ├── Notes.jsx       # Full CRUD for notes
    │   │   ├── Tasks.jsx       # Full CRUD for tasks + filter
    │   │   └── StudyTimer.jsx  # 25-min Pomodoro timer
    │   ├── css/
    │   │   ├── global.css      # Design tokens + shared styles
    │   │   ├── app.css         # Shell layout
    │   │   ├── sidebar.css
    │   │   ├── navbar.css
    │   │   ├── dashboard.css
    │   │   ├── notes.css
    │   │   ├── tasks.css
    │   │   ├── timer.css
    │   │   └── footer.css
    │   ├── App.jsx             # Router + layout shell
    │   └── main.jsx            # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Reference

### Notes — `/api/notes`

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | `/api/notes`       | Get all notes         |
| GET    | `/api/notes?search=react` | Search by title |
| POST   | `/api/notes`       | Create a new note     |
| PUT    | `/api/notes/:id`   | Update a note         |
| DELETE | `/api/notes/:id`   | Delete a note         |

**Note object:**
```json
{
  "id": "1718870400000",
  "title": "React Hooks Overview",
  "content": "useState manages local state...",
  "category": "React",
  "createdAt": "2026-06-20T09:00:00.000Z"
}
```

### Tasks — `/api/tasks`

| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| GET    | `/api/tasks`              | Get all tasks              |
| GET    | `/api/tasks?status=pending` | Filter by status         |
| POST   | `/api/tasks`              | Create a new task          |
| PUT    | `/api/tasks/:id`          | Update title or completed  |
| DELETE | `/api/tasks/:id`          | Delete a task              |

**Task object:**
```json
{
  "id": "1718870400000",
  "title": "Study for algorithms exam",
  "completed": false,
  "createdAt": "2026-06-20T09:00:00.000Z"
}
```

---

## 🎨 Design System

All colors and sizes are CSS variables in `global.css`:

```css
--bg-primary:   #121212   /* Page background */
--bg-card:      #1e1e1e   /* Card background */
--accent:       #4f46e5   /* Indigo accent */
--text-primary: #ffffff   /* Main text */
--text-muted:   #71717a   /* Subtle text */
```

---

## ✨ Features

- **Dashboard** — Stats cards (notes, tasks, completed), recent items preview, live greeting
- **Notes** — Create / edit / delete notes, search by title, assign category, modal form
- **Tasks** — Add tasks inline, toggle complete, inline title edit, filter all/pending/completed, progress bar
- **Study Timer** — 25-minute Pomodoro with animated SVG ring, start/pause/reset, session counter

---

## 🛠️ Built With

- [React 18](https://react.dev/) with Hooks (`useState`, `useEffect`, `useRef`)
- [React Router v6](https://reactrouter.com/) for client-side routing
- [Vite](https://vitejs.dev/) for fast development
- [Express](https://expressjs.com/) REST API
- Node.js `fs` module for JSON file persistence
- Pure CSS (no frameworks)

---

*Built as a portfolio project — UBT, Pristina*
