// ============================================================
// App.jsx — Root component with layout and routing
// ============================================================

import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import StudyTimer from "./pages/StudyTimer";
import "../src/css/app.css";

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main content area: navbar + page content + footer */}
      <div className="main-area">
        <Navbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/timer" element={<StudyTimer />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
