import React from "react";
import { Trophy, Award, Users, CheckCircle2, Flame, Activity } from "lucide-react";

export default function TeamProgressWidget({ leaderboardData, gameTitles = {} }) {
  const totalTeams = leaderboardData.length;
  const game1FinishedCount = leaderboardData.filter((t) => t.abbrevScore && t.abbrevScore > 0).length;
  const game2FinishedCount = leaderboardData.filter((t) => t.imageScore && t.imageScore > 0).length;
  const fullyCompletedCount = leaderboardData.filter((t) => t.abbrevScore > 0 && t.imageScore > 0).length;

  const game1Pct = totalTeams > 0 ? Math.round((game1FinishedCount / totalTeams) * 100) : 0;
  const game2Pct = totalTeams > 0 ? Math.round((game2FinishedCount / totalTeams) * 100) : 0;

  return (
    <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Activity size={22} color="var(--role-primary)" />
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Live Team Progress & Points Dashboard</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              Real-time tracking of team completion rates and points accumulated across event games.
            </p>
          </div>
        </div>

        <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
          ✓ {fullyCompletedCount} / {totalTeams || 0} Teams Completed Both Games
        </span>
      </div>

      <div className="responsive-grid-2">
        {/* Game 1 Progress Meter */}
        <div style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-dark)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>
              {gameTitles.abbrev_quiz || "Game 1: Abbreviation Speed Quiz"}
            </div>
            <span style={{ fontWeight: 800, color: "#818cf8", fontSize: "0.9rem" }}>{game1Pct}% Progress</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", marginBottom: "0.75rem" }}>
            {game1FinishedCount} of {totalTeams || 0} teams finished Game 1
          </div>
          <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.1)", overflow: "hidden" }}>
            <div style={{ width: `${game1Pct}%`, height: "100%", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Game 2 Progress Meter */}
        <div style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-dark)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>
              {gameTitles.real_fake_img || "Game 2: Fact Finder"}
            </div>
            <span style={{ fontWeight: 800, color: "#34d399", fontSize: "0.9rem" }}>{game2Pct}% Progress</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", marginBottom: "0.75rem" }}>
            {game2FinishedCount} of {totalTeams || 0} teams finished Game 2
          </div>
          <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.1)", overflow: "hidden" }}>
            <div style={{ width: `${game2Pct}%`, height: "100%", background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
