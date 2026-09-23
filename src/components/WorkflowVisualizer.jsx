import React from "react";
import { ShieldCheck, UserCheck, GraduationCap, ArrowRight, CheckCircle2, Lock, Unlock, Zap, Trophy } from "lucide-react";

export default function WorkflowVisualizer({
  activeRole,
  coordinatorsCount,
  gameLocks,
  isQuestionsLocked,
  leaderboardCount
}) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem 1.75rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Zap size={22} color="var(--role-primary)" />
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Admin <span style={{ color: "var(--role-primary)" }}>↔</span> Coordinator Event Workflow Pipeline</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              Real-time operational workflow mapping across Admin, Coordinator, and Student stages.
            </p>
          </div>
        </div>

        <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.3rem 0.7rem", borderRadius: "8px", background: "var(--role-tag-bg)", color: "var(--role-tag-text)", border: "1px solid var(--role-card-border)" }}>
          Active View: {activeRole.toUpperCase()} PANEL
        </span>
      </div>

      {/* Workflow Pipeline Diagram */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
        {/* Stage 1: Admin Authority */}
        <div style={{ padding: "1.1rem", borderRadius: "14px", background: activeRole === "admin" ? "rgba(79, 70, 229, 0.15)" : "rgba(255,255,255,0.03)", border: activeRole === "admin" ? "2px solid #4F46E5" : "1px solid var(--border-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <ShieldCheck size={18} color="#818cf8" />
            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#fff" }}>1. Admin Control</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", lineHeight: 1.4 }}>
            • {coordinatorsCount} Coordinators Generated<br />
            • Master Game Locks Configured<br />
            • Attendance Sheet & Break Lock Ready
          </div>
        </div>

        <ArrowRight size={20} color="var(--role-primary)" />

        {/* Stage 2: Coordinator Operations */}
        <div style={{ padding: "1.1rem", borderRadius: "14px", background: activeRole === "coordinator" ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.03)", border: activeRole === "coordinator" ? "2px solid #10B981" : "1px solid var(--border-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <UserCheck size={18} color="#34d399" />
            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#fff" }}>2. Coordinator Operations</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", lineHeight: 1.4 }}>
            • Question & Image Builders Active<br />
            • Question Lock: <strong style={{ color: isQuestionsLocked ? "#f87171" : "#34d399" }}>{isQuestionsLocked ? "Locked 🔒" : "Unlocked 🟢"}</strong><br />
            • Point Marks Configured
          </div>
        </div>

        <ArrowRight size={20} color="var(--role-primary)" />

        {/* Stage 3: Student Competition */}
        <div style={{ padding: "1.1rem", borderRadius: "14px", background: activeRole === "student" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)", border: activeRole === "student" ? "2px solid #3B82F6" : "1px solid var(--border-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <GraduationCap size={18} color="#60a5fa" />
            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#fff" }}>3. Student Event Games</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", lineHeight: 1.4 }}>
            • Admin Team Passcode Auth<br />
            • {leaderboardCount} Teams Competing Live<br />
            • Real-Time Points Leaderboard
          </div>
        </div>
      </div>
    </div>
  );
}
