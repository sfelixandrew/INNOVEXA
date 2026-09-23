import React, { useState } from "react";
import { UserCheck, Key, Mail, X, Check, Layers, ShieldCheck } from "lucide-react";

export default function CreateCoordinatorModal({ isOpen, onClose, onCreateCoordinator }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science & AI Track");
  const [selectedGame, setSelectedGame] = useState("both"); // 'abbrev_quiz' | 'real_fake_img' | 'both'
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGeneratePreset = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setEmail(`coord.${randomNum}@innov.edu`);
    setPassword(`Coord@${randomNum}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all coordinator details.");
      return;
    }

    let assignedGames = [];
    let assignedGameTitle = "";

    if (selectedGame === "both") {
      assignedGames = ["abbrev_quiz", "real_fake_img"];
      assignedGameTitle = "All Event Games (Quiz & AI Image)";
    } else if (selectedGame === "abbrev_quiz") {
      assignedGames = ["abbrev_quiz"];
      assignedGameTitle = "Abbreviation Speed Quiz";
    } else {
      assignedGames = ["real_fake_img"];
      assignedGameTitle = "AI vs Real Image Detector";
    }

    const newCoordObj = {
      id: `CRD-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      password,
      department,
      assignedGames,
      assignedGameTitle,
      createdTime: "Just now"
    };

    onCreateCoordinator(newCoordObj);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
            <UserCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Generate Coordinator Credential</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              Admin power: Provision Coordinator ID & allocate event games to manage.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Coordinator Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Prof. David Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-group">
            <div>
              <label className="form-label">Generated Email ID</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="coord@innov.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "1rem" }}
              />
            </div>

            <div>
              <label className="form-label">Generated Password</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Coord@123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={handleGeneratePreset}
              style={{ background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#818cf8", padding: "0.3rem 0.75rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
            >
              ⚡ Auto-Generate Random ID & Pass
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Allocate Event Game to Manage</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { id: "both", label: "Allocate All Event Games (Speed Quiz & Fact Finder)", icon: Layers },
                { id: "abbrev_quiz", label: "Allocate Abbreviation Speed Quiz Only", icon: ShieldCheck },
                { id: "real_fake_img", label: "Allocate Fact Finder Only", icon: UserCheck }
              ].map((g) => (
                <label
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    background: selectedGame === g.id ? "rgba(99, 102, 241, 0.15)" : "rgba(15, 23, 42, 0.4)",
                    border: selectedGame === g.id ? "1px solid var(--role-primary)" : "1px solid var(--border-dark)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "#fff"
                  }}
                >
                  <input
                    type="radio"
                    name="assigned_game"
                    checked={selectedGame === g.id}
                    onChange={() => setSelectedGame(g.id)}
                    style={{ accentColor: "var(--role-primary)" }}
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
            <UserCheck size={18} />
            <span>Create & Provision Coordinator</span>
          </button>
        </form>
      </div>
    </div>
  );
}
