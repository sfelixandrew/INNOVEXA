import React, { useState } from "react";
import { Users, KeyRound, Sparkles, X, UserCheck, ShieldCheck, RefreshCw } from "lucide-react";

export default function CreateStudentTeamModal({
  isOpen,
  onClose,
  onCreateStudentTeam
}) {
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [teamCode, setTeamCode] = useState(() => `JARVIS-${Math.floor(1000 + Math.random() * 9000)}`);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerateNewCode = () => {
    setTeamCode(`JARVIS-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!teamName.trim()) {
      setError("Please enter a Team Name.");
      return;
    }

    if (!leaderName.trim()) {
      setError("Please enter Team Leader (Member 1) Name.");
      return;
    }

    if (!member2Name.trim()) {
      setError("Please enter Member 2 Name. A team must contain 3 members.");
      return;
    }

    if (!member3Name.trim()) {
      setError("Please enter Member 3 Name. A team must contain 3 members.");
      return;
    }

    if (!teamCode.trim()) {
      setError("Please generate or enter a Team Code.");
      return;
    }

    const membersList = [
      leaderName.trim(),
      member2Name.trim(),
      member3Name.trim()
    ];

    const newTeamObj = {
      id: `TEAM-${Date.now()}`,
      teamName: teamName.trim(),
      teamCode: teamCode.trim().toUpperCase(),
      leaderName: leaderName.trim(),
      members: membersList,
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString(),
      status: "Active"
    };

    onCreateStudentTeam(newTeamObj);
    
    // Reset form
    setTeamName("");
    setLeaderName("");
    setMember2Name("");
    setMember3Name("");
    setTeamCode(`JARVIS-${Math.floor(1000 + Math.random() * 9000)}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content glass-card jarvis-hud-card" 
        style={{ maxWidth: "520px", width: "100%", padding: "2rem", color: "#f8fafc", position: "relative" }}
      >
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "radial-gradient(circle, #00f0ff 0%, #0284c7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)", color: "#030712"
            }}>
              <Users size={24} />
            </div>
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                GENERATE STUDENT TEAM & CODE
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
                Provision Team Credentials & Access Passcode for Student Login
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: "0.75rem 1rem", borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444",
            color: "#f87171", fontSize: "0.82rem", marginBottom: "1.25rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Team Name */}
          <div className="form-group">
            <label className="form-label">Team Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Quantum Racers, Cyber Knights"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {/* Leader / Member 1 Name */}
          <div className="form-group">
            <label className="form-label">Team Leader (Member 1) Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Alex Stark (Leader)"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
            />
          </div>

          {/* Member 2 Name */}
          <div className="form-group">
            <label className="form-label">Member 2 Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Elena Rostova"
              value={member2Name}
              onChange={(e) => setMember2Name(e.target.value)}
            />
          </div>

          {/* Member 3 Name */}
          <div className="form-group">
            <label className="form-label">Member 3 Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Marcus Brody"
              value={member3Name}
              onChange={(e) => setMember3Name(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "#00f0ff", display: "block", marginTop: "0.3rem" }}>
              👥 Every competition team requires exactly 3 student members.
            </span>
          </div>

          {/* Generated Team Passcode / Code */}
          <div className="form-group">
            <label className="form-label">Generated Team Passcode / Code *</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div className="input-wrapper" style={{ flex: 1 }}>
                <KeyRound className="input-icon" size={18} color="#00f0ff" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="JARVIS-8924"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  style={{ fontWeight: 800, letterSpacing: "0.08em", color: "#00f0ff" }}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateNewCode}
                title="Regenerate Code"
                style={{
                  padding: "0 1rem", borderRadius: "12px",
                  background: "rgba(0, 240, 255, 0.15)", border: "1px solid #00f0ff",
                  color: "#00f0ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#34d399", display: "block", marginTop: "0.3rem" }}>
              🔑 Students will enter this <strong>Team Name</strong> & <strong>Team Code</strong> to log in.
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%", padding: "0.85rem", marginTop: "1rem",
              background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
              color: "#030712", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer"
            }}
          >
            Generate & Activate Student Team Code
          </button>
        </form>
      </div>
    </div>
  );
}
