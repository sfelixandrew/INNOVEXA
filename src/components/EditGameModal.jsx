import React, { useState } from "react";
import { Edit3, X, Save, Sparkles, Layers } from "lucide-react";

export default function EditGameModal({ isOpen, onClose, gameTitles, onSaveTitles }) {
  const [g1Title, setG1Title] = useState(gameTitles.abbrev_quiz || "Abbreviation Speed Quiz");
  const [g2Title, setG2Title] = useState(gameTitles.real_fake_img || "Fact Finder");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTitles({
      abbrev_quiz: g1Title.trim() || "Abbreviation Speed Quiz",
      real_fake_img: g2Title.trim() || "Fact Finder"
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
            <Edit3 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Edit Event Game Titles</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              Customize official titles for Game 1 and Game 2 across the platform.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Game 1 Title (Quiz Engine)</label>
            <input
              type="text"
              required
              className="form-input"
              value={g1Title}
              onChange={(e) => setG1Title(e.target.value)}
              placeholder="e.g. Tech Acronym Sprint"
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Game 2 Title (Fact Finder Arena Engine)</label>
            <input
              type="text"
              required
              className="form-input"
              value={g2Title}
              onChange={(e) => setG2Title(e.target.value)}
              placeholder="e.g. Fact Finder Challenge"
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
            <Save size={18} />
            <span>Save Updated Game Titles</span>
          </button>
        </form>
      </div>
    </div>
  );
}
