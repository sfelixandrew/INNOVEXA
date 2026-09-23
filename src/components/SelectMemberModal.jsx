import React, { useState } from "react";
import { Users, UserCheck, Sparkles, LogIn, X, ShieldAlert } from "lucide-react";

export default function SelectMemberModal({
  isOpen,
  team,
  onClose,
  onConfirmMember
}) {
  const [selectedMember, setSelectedMember] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !team) return null;

  // Extract all team members (guaranteed 3 members: Leader + Member 2 + Member 3)
  const membersList = Array.isArray(team.members) && team.members.length > 0 
    ? team.members 
    : [team.leaderName || "Team Leader"];

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedMember) {
      setError("Please select your name from the team member list to proceed.");
      return;
    }

    setError("");
    onConfirmMember(selectedMember);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-card jarvis-hud-card" 
        style={{ maxWidth: "480px", width: "100%", padding: "2rem", color: "#f8fafc", position: "relative" }}
      >
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "radial-gradient(circle, #00f0ff 0%, #0284c7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)", color: "#030712"
            }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                SELECT YOUR MEMBER NAME
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
                Team: <strong style={{ color: "#fff" }}>{team.teamName}</strong> ({team.teamCode})
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: "0.75rem 1rem", borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444",
            color: "#f87171", fontSize: "0.82rem", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleConfirm}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem", lineHeight: 1.4 }}>
            Verification successful! Please select your name below to enter the competition arena:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {membersList.map((mName, idx) => {
              const isLeader = mName === team.leaderName;
              const isSelected = selectedMember === mName;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedMember(mName);
                    setError("");
                  }}
                  style={{
                    padding: "0.85rem 1.1rem",
                    borderRadius: "12px",
                    background: isSelected 
                      ? "rgba(0, 240, 255, 0.15)" 
                      : "rgba(255, 255, 255, 0.04)",
                    border: isSelected 
                      ? "1px solid #00f0ff" 
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 0 15px rgba(0, 240, 255, 0.3)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      border: isSelected ? "6px solid #00f0ff" : "2px solid #64748b",
                      background: isSelected ? "#030712" : "transparent"
                    }} />
                    <div>
                      <span style={{ fontWeight: isSelected ? 800 : 600, fontSize: "0.95rem", color: isSelected ? "#00f0ff" : "#fff" }}>
                        {mName}
                      </span>
                      {isLeader && (
                        <span style={{
                          fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                          borderRadius: "6px", background: "rgba(251, 191, 36, 0.2)",
                          color: "#fbbf24", marginLeft: "0.6rem", border: "1px solid rgba(251, 191, 36, 0.4)"
                        }}>
                          TEAM LEADER
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Member #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%", padding: "0.85rem",
              background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
              color: "#030712", fontWeight: 800, borderRadius: "12px", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}
          >
            <LogIn size={18} />
            <span>CONFIRM NAME & ENTER ARENA</span>
          </button>
        </form>
      </div>
    </div>
  );
}
