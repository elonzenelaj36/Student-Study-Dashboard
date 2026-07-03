// ============================================================
// pages/StudyTimer.jsx — Pomodoro-style 25-minute study timer
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import "../css/timer.css";

const TOTAL_SECONDS = 25 * 60; // 25 minutes in seconds

function StudyTimer() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0); // completed sessions count
  const intervalRef = useRef(null); // store interval ID so we can clear it

  // ── Tick logic ─────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer finished — stop and record a session
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setSessions((s) => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Not running — clear the interval
      clearInterval(intervalRef.current);
    }

    // Cleanup when component unmounts or effect re-runs
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ── Controls ──────────────────────────────────────────────
  function handleStart() {
    if (secondsLeft === 0) return; // prevent starting on finished timer
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
  }

  // ── Time formatting ────────────────────────────────────────
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  // ── SVG Ring Progress ─────────────────────────────────────
  const RADIUS = 88; // circle radius
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // full circle length
  const progress = secondsLeft / TOTAL_SECONDS; // 1.0 → 0.0 as timer counts down
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress); // how much of the stroke to hide

  // Progress ring color state
  const ringClass =
    secondsLeft === 0
      ? "done"
      : !isRunning && secondsLeft < TOTAL_SECONDS
      ? "paused"
      : "";

  // Timer card class for ambient glow effect
  const cardClass = `timer-card${isRunning ? " running" : ""}`;

  // Status label under the time
  const statusLabel =
    secondsLeft === 0
      ? "Session Complete!"
      : isRunning
      ? "Studying..."
      : secondsLeft === TOTAL_SECONDS
      ? "Ready"
      : "Paused";

  return (
    <div className="timer-page">
      <div className="page-header" style={{ width: "100%", maxWidth: "480px" }}>
        <div>
          <h1>⏱️ Study Timer</h1>
          <p>25-minute Pomodoro sessions to boost focus</p>
        </div>
      </div>

      {/* ── Timer Card ────────────────────────────────────── */}
      <div className={cardClass}>
        {/* ── SVG Progress Ring ─────────────────────────── */}
        <div className="timer-ring-wrap">
          <svg className="timer-ring" width="220" height="220" viewBox="0 0 220 220">
            {/* Background circle */}
            <circle
              className="timer-ring-bg"
              cx="110"
              cy="110"
              r={RADIUS}
            />
            {/* Animated progress arc */}
            <circle
              className={`timer-ring-progress ${ringClass}`}
              cx="110"
              cy="110"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Time display overlaid on the ring */}
          <div className="timer-display">
            <div className="timer-time">{minutes}:{seconds}</div>
            <div className="timer-label">{statusLabel}</div>
          </div>
        </div>

        {/* ── Control Buttons ───────────────────────────── */}
        <div className="timer-controls">
          {/* Show Start or Pause depending on state */}
          {!isRunning ? (
            <button
              className="timer-btn timer-btn-start"
              onClick={handleStart}
              disabled={secondsLeft === 0}
            >
              ▶ {secondsLeft === TOTAL_SECONDS ? "Start" : "Resume"}
            </button>
          ) : (
            <button className="timer-btn timer-btn-pause" onClick={handlePause}>
              ⏸ Pause
            </button>
          )}

          <button
            className="timer-btn timer-btn-reset"
            onClick={handleReset}
            title="Reset timer to 25:00"
          >
            ↺ Reset
          </button>
        </div>

        {/* ── Done message ──────────────────────────────── */}
        {secondsLeft === 0 && (
          <div className="timer-done-msg">
            🎉 Great work! Take a 5-minute break.
          </div>
        )}

        {/* ── Session stats ─────────────────────────────── */}
        <div className="timer-info">
          <div className="timer-stat">
            <div className="timer-stat-value">{sessions}</div>
            <div className="timer-stat-label">Sessions</div>
          </div>
          <div className="timer-stat">
            <div className="timer-stat-value">{sessions * 25}</div>
            <div className="timer-stat-label">Min Studied</div>
          </div>
          <div className="timer-stat">
            <div className="timer-stat-value">
              {Math.floor(((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100)}%
            </div>
            <div className="timer-stat-label">This Session</div>
          </div>
        </div>
      </div>

      {/* ── Pomodoro Tips ─────────────────────────────────── */}
      <div className="timer-tips">
        <h3>💡 Pomodoro Tips</h3>
        <div className="timer-tip-item">
          <span className="timer-tip-dot">◆</span>
          Work for 25 minutes with full focus — no distractions.
        </div>
        <div className="timer-tip-item">
          <span className="timer-tip-dot">◆</span>
          After each session, take a short 5-minute break.
        </div>
        <div className="timer-tip-item">
          <span className="timer-tip-dot">◆</span>
          After 4 sessions, reward yourself with a 15–30 minute break.
        </div>
        <div className="timer-tip-item">
          <span className="timer-tip-dot">◆</span>
          Keep your notes open so you can jot down ideas instantly.
        </div>
      </div>
    </div>
  );
}

export default StudyTimer;
