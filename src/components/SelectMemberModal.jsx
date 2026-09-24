import React, { useState } from "react";
import { Users, UserCheck, Sparkles, LogIn, X, ShieldAlert, Lock, Check } from "lucide-react";

export default function SelectMemberModal({
  isOpen,
  team,
  onClose,
  onConfirmMember
}) {
  const [selectedMember, setSelectedMember] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !team) return null;

  // Extract all team members (exactly 3 members per team)
  const membersList = Array.isArray(team.members) && team.members.length > 0 
    ? team.members 
    : [team.leaderName || "Team Leader"];

  const activeLogins = team.activeLogins || team.active_logins || [];

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedMember) {
      setError("Please select your name from the team member list to proceed.");
      return;
    }

    if (activeLogins.includes(selectedMember)) {
      setError(`⛔ ACCESS DENIED: "${selectedMember}" has already logged in! A single person can only have a single login under their user name (max 3 logins per team).`);
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

        {/* 3 Logins Info Alert */}
        <div style={{
          padding: "0.6rem 0.85rem",
          borderRadius: "8px",
          background: "rgba(0, 240, 255, 0.08)",
          border: "1px solid rgba(0, 240, 255, 0.25)",
          color: "#7dd3fc",
          fontSize: "0.78rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Sparkles size={16} color="#00f0ff" />
          <span>Each team has exactly 3 member logins. Single person = 1 single login under their user name.</span>
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
              const isAlreadyLoggedIn = activeLogins.includes(mName);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isAlreadyLoggedIn) {
                      setError(`⛔ ACCESS DENIED: "${mName}" has already logged in! Single person can only have a single login under their user name.`);
                      return;
                    }
                    setSelectedMember(mName);
                    setError("");
                  }}
                  style={{
                    padding: "0.85rem 1.1rem",
                    borderRadius: "12px",
                    background: isAlreadyLoggedIn
                      ? "rgba(239, 68, 68, 0.08)"
                      : isSelected 
                        ? "rgba(0, 240, 255, 0.15)" 
                        : "rgba(255, 255, 255, 0.04)",
                    border: isAlreadyLoggedIn
                      ? "1px solid rgba(239, 68, 68, 0.3)"
                      : isSelected 
                        ? "1px solid #00f0ff" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: isAlreadyLoggedIn ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    opacity: isAlreadyLoggedIn ? 0.75 : 1,
                    boxShadow: isSelected ? "0 0 15px rgba(0, 240, 255, 0.3)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      border: isAlreadyLoggedIn
                        ? "2px solid #ef4444"
                        : isSelected 
                          ? "6px solid #00f0ff" 
                          : "2px solid #64748b",
                      background: isSelected ? "#030712" : "transparent"
                    }} />
                    <div>
                      <span style={{ 
                        fontWeight: isSelected ? 800 : 600, 
                        fontSize: "0.95rem", 
                        color: isAlreadyLoggedIn ? "#f87171" : isSelected ? "#00f0ff" : "#fff" 
                      }}>
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

                  {isAlreadyLoggedIn ? (
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.5rem",
                      borderRadius: "6px", background: "rgba(239, 68, 68, 0.2)",
                      color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)",
                      display: "flex", alignItems: "center", gap: "0.3rem"
                    }}>
                      <Lock size={12} /> Logged In
                    </span>
                  ) : (
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.5rem",
                      borderRadius: "6px", background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)"
                    }}>
                      Available ({idx + 1}/3)
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!selectedMember || activeLogins.includes(selectedMember)}
            style={{
              width: "100%", padding: "0.85rem",
              background: !selectedMember || activeLogins.includes(selectedMember)
                ? "rgba(100, 116, 139, 0.3)"
                : "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
              color: !selectedMember || activeLogins.includes(selectedMember) ? "#94a3b8" : "#030712",
              fontWeight: 800, borderRadius: "12px", border: "none",
              cursor: !selectedMember || activeLogins.includes(selectedMember) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
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

