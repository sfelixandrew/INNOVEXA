import React, { useState } from "react";
import { Users, UserPlus, LogIn, Sparkles, X, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TeamModal({ isOpen, onClose, user, onSaveTeam }) {
  const [tab, setTab] = useState("create"); // 'create' | 'join'
  const [teamName, setTeamName] = useState("");
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError("Please enter a valid Team Name.");
      return;
    }

    const generatedCode = `${teamName.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const teamObj = {
      teamId: `TEAM-${Math.floor(1000 + Math.random() * 9000)}`,
      teamName: teamName.trim(),
      teamCode: generatedCode,
      role: "Team Leader",
      members: [user?.name || "Team Member"]
    };

    onSaveTeam(teamObj);
    onClose();
  };

  const handleJoinTeam = (e) => {
    e.preventDefault();
    if (!teamCodeInput.trim()) {
      setError("Please enter a 6-digit Team Code.");
      return;
    }

    const teamObj = {
      teamId: `TEAM-JOINED-${Math.floor(1000 + Math.random() * 9000)}`,
      teamName: `Team ${teamCodeInput.toUpperCase()}`,
      teamCode: teamCodeInput.trim().toUpperCase(),
      role: "Member",
      members: ["Team Leader", user?.name || "Team Member"]
    };

    onSaveTeam(teamObj);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", color: "#60a5fa" }}>
            <Users size={28} />
          </div>

          <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Welcome to the Event Portal!</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)", marginTop: "0.2rem" }}>
            To compete in games & earn scores, please <strong>Create a Team</strong> or <strong>Join an Existing Team</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.6)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-dark)", marginBottom: "1.25rem" }}>
          <button
            type="button"
            onClick={() => { setTab("create"); setError(""); }}
            style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: tab === "create" ? "var(--role-gradient)" : "transparent", color: tab === "create" ? "#fff" : "var(--text-dark-secondary)", fontWeight: 700, cursor: "pointer" }}
          >
            Create New Team
          </button>
          <button
            type="button"
            onClick={() => { setTab("join"); setError(""); }}
            style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: tab === "join" ? "var(--role-gradient)" : "transparent", color: tab === "join" ? "#fff" : "var(--text-dark-secondary)", fontWeight: 700, cursor: "pointer" }}
          >
            Join via Team Code
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {tab === "create" ? (
          <form onSubmit={handleCreateTeam}>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cyber Samurai"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{ paddingLeft: "1rem" }}
              />
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", marginBottom: "1.25rem" }}>
              💡 Creating a team makes you Team Leader and generates a unique shareable Team Code for your teammates.
            </p>

            <button type="submit" className="btn-primary">
              <UserPlus size={18} />
              <span>Create Team & Start Event</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinTeam}>
            <div className="form-group">
              <label className="form-label">Enter 6-Digit Team Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. NN-4892"
                value={teamCodeInput}
                onChange={(e) => setTeamCodeInput(e.target.value)}
                style={{ paddingLeft: "1rem", textTransform: "uppercase" }}
              />
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", marginBottom: "1.25rem" }}>
              Ask your Team Leader for the 6-character Team Code.
            </p>

            <button type="submit" className="btn-primary">
              <LogIn size={18} />
              <span>Join Team & Enter Event</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
