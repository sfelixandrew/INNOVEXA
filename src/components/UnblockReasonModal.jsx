import React, { useState } from "react";
import { Unlock, ShieldAlert, X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function UnblockReasonModal({
  isOpen,
  team,
  onClose,
  onConfirmUnblock
}) {
  const [reason, setReason] = useState("cheated"); // "cheated" | "other"

  if (!isOpen || !team) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirmUnblock(team.id, reason);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-card jarvis-hud-card" 
        style={{ maxWidth: "500px", width: "100%", padding: "2rem", color: "#f8fafc", position: "relative" }}
      >
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "radial-gradient(circle, #10b981 0%, #059669 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)", color: "#ffffff"
            }}>
              <Unlock size={24} />
            </div>
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                UNBLOCK STUDENT TEAM
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

        <form onSubmit={handleConfirm}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.4 }}>
            Please select the reason for unblocking this team. The selected reason determines whether an anti-cheat point penalty is applied:
          </p>

          {/* Reason Selection Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
            {/* Option 1: Cheated */}
            <div
              onClick={() => setReason("cheated")}
              style={{
                padding: "1rem 1.15rem",
                borderRadius: "14px",
                background: reason === "cheated" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.04)",
                border: reason === "cheated" ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    border: reason === "cheated" ? "5px solid #ef4444" : "2px solid #64748b",
                    background: reason === "cheated" ? "#030712" : "transparent"
                  }} />
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: reason === "cheated" ? "#f87171" : "#fff" }}>
                    1. Cheated / Tab-Switch Violation
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444" }}>
                  -50 PTS PENALTY
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", paddingLeft: "1.75rem", margin: 0 }}>
                Unblocks team access and deducts 50 points from their current leaderboard total score.
              </p>
            </div>

            {/* Option 2: Other */}
            <div
              onClick={() => setReason("other")}
              style={{
                padding: "1rem 1.15rem",
                borderRadius: "14px",
                background: reason === "other" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.04)",
                border: reason === "other" ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    border: reason === "other" ? "5px solid #10b981" : "2px solid #64748b",
                    background: reason === "other" ? "#030712" : "transparent"
                  }} />
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: reason === "other" ? "#34d399" : "#fff" }}>
                    2. Other (Accidental Glitch / Technical Issue)
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid #10b981" }}>
                  NO PENALTY (0 PTS)
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", paddingLeft: "1.75rem", margin: 0 }}>
                Unblocks team access with zero point reduction for non-cheating technical instances.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%", padding: "0.85rem",
              background: reason === "cheated" 
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff", fontWeight: 800, borderRadius: "12px", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}
          >
            <Unlock size={18} />
            <span>CONFIRM UNBLOCK ({reason === "cheated" ? "-50 PTS PENALTY" : "NO PENALTY"})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
