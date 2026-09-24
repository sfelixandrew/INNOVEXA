import React, { useState } from "react";
import { Trophy, Award, Search, Users, Clock, Flame, Sparkles, Inbox } from "lucide-react";

export default function Scoreboard({ leaderboardData, onOpenAddPointsModal }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = leaderboardData.filter(
    (t) =>
      t.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teamCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.members?.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-card jarvis-hud-card" style={{ padding: "1.75rem", position: "relative" }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Scoreboard Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Trophy size={24} color="#00f0ff" />
          <div>
            <h3 className="jarvis-text-glow" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              INNOVEXA-JARVIS Master Leaderboard
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
              Live rankings based on Total Game Points (Quiz + AI Image + Excel / Bonus Points)
            </p>
          </div>
        </div>

        {/* Action Controls & Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {onOpenAddPointsModal && (
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenAddPointsModal}
              style={{
                padding: "0.5rem 1rem", fontSize: "0.82rem",
                background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
                color: "#030712", fontWeight: 800, border: "1px solid #00f0ff",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)", borderRadius: "10px"
              }}
            >
              <Sparkles size={16} />
              <span>Add Team Points (Excel / Manual)</span>
            </button>
          )}

          {leaderboardData.length > 0 && (
            <div className="input-wrapper" style={{ width: "220px" }}>
              <Search className="input-icon" size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "0.55rem 0.8rem 0.55rem 2.4rem", fontSize: "0.82rem" }}
              />
            </div>
          )}
        </div>
      </div>

      {leaderboardData.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: "center", padding: "3rem 1.5rem", border: "1px dashed var(--border-dark)", borderRadius: "16px", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#818cf8" }}>
            <Inbox size={28} />
          </div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem" }}>
            No Registered Teams Yet
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)", maxWidth: "420px", margin: "0 auto" }}>
            As students log in with their Team Name & Code and play event games, live scores and rankings will appear here automatically!
          </p>
        </div>
      ) : (
        /* Leaderboard Table */
        <div className="responsive-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dark)", color: "var(--text-dark-secondary)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 0.5rem", width: "70px" }}>Rank</th>
                <th style={{ padding: "0.85rem 1rem" }}>Team & Members</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "center" }}>Abbrev Quiz</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "center" }}>Fact Finder</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((t, idx) => {
                const rank = idx + 1;
                let rankBadge = `#${rank}`;
                let rankStyle = { background: "rgba(255,255,255,0.05)", color: "var(--text-dark-secondary)" };

                if (rank === 1) {
                  rankBadge = "🥇 1st";
                  rankStyle = { background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", fontWeight: 800 };
                } else if (rank === 2) {
                  rankBadge = "🥈 2nd";
                  rankStyle = { background: "rgba(226, 232, 240, 0.2)", color: "#e2e8f0", fontWeight: 800 };
                } else if (rank === 3) {
                  rankBadge = "🥉 3rd";
                  rankStyle = { background: "rgba(217, 119, 6, 0.2)", color: "#f59e0b", fontWeight: 800 };
                }

                return (
                  <tr
                    key={t.teamId || idx}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <span style={{ ...rankStyle, padding: "0.3rem 0.6rem", borderRadius: "8px", fontSize: "0.78rem", display: "inline-block" }}>
                        {rankBadge}
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>{t.teamName}</span>
                        <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", fontWeight: 600 }}>
                          {t.teamCode}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", marginTop: "0.2rem" }}>
                        Leader: {t.leaderName || t.members[0]} • Members: {t.members.join(", ")}
                      </div>
                    </td>

                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span style={{ fontWeight: 700, color: "#818cf8" }}>{t.abbrevScore || 0} pts</span>
                    </td>

                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span style={{ fontWeight: 700, color: "#34d399" }}>{t.imageScore || 0} pts</span>
                    </td>

                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#f59e0b" }}>
                        {t.totalScore || 0} Pts
                      </div>
                      {t.penalty > 0 && (
                        <div style={{ fontSize: "0.72rem", color: "#f87171", fontWeight: 700 }}>
                          (-{t.penalty} Pts Anti-Cheat Penalty)
                        </div>
                      )}
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dark-secondary)" }}>
                        Time: {t.timeSeconds ? `${Math.floor(t.timeSeconds / 60)}m ${t.timeSeconds % 60}s` : t.lastPlayed || "Just now"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
