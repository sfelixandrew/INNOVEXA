import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Toggle Dark / Light Theme"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid var(--border-dark)",
        color: theme === "dark" ? "#fcd34d" : "#0f172a",
        padding: "0.6rem",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
