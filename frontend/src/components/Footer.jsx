// ============================================================
// components/Footer.jsx — Simple bottom footer
// ============================================================

import React from "react";
import "../css/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        <strong>Student Study Dashboard</strong> — Built with React &amp; Node.js
      </p>
      <div className="footer-right">v1.0.0 · {year}</div>
    </footer>
  );
}

export default Footer;
