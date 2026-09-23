import React, { useState } from "react";
import { 
  UserCheck, Layers, Users, LogOut, Activity, 
  CheckCircle2, AlertCircle, ShieldCheck, Flame, Award, 
  Plus, Edit, Trash2, Lock, Unlock, HelpCircle, Lightbulb, ShieldOff 
} from "lucide-react";
import Scoreboard from "../components/Scoreboard";
import QuestionEditorModal from "../components/QuestionEditorModal";
import FactEditorModal from "../components/FactEditorModal";
import LockQuestionsModal from "../components/LockQuestionsModal";
import UnblockReasonModal from "../components/UnblockReasonModal";
import WorkflowVisualizer from "../components/WorkflowVisualizer";
import TeamProgressWidget from "../components/TeamProgressWidget";

export default function CoordinatorDashboard({
  user,
  onLogout,
  leaderboardData,
  gameLocks = {},
  gameStartedStates = {},
  onToggleGameStart,
  gameTitles = {},
  isQuestionsLocked,
  onToggleQuestionLockState,
  quizQuestions,
  onSaveQuizQuestion,
  onDeleteQuizQuestion,
  realFakeImages,
  onSaveImageChallenge,
  onDeleteImageChallenge,
  studentTeamsList = [],
  onUnblockTeam,
  gameResumes = [],
  onApproveResume,
  onDisallowResume
}) {
  const assignedGames = user.assignedGames || ["abbrev_quiz", "real_fake_img"];
  const hasQuiz = assignedGames.includes("abbrev_quiz");
  const hasImg = assignedGames.includes("real_fake_img");

  const [activeTab, setActiveTab] = useState(hasQuiz ? "quiz" : "img");

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [editingFact, setEditingFact] = useState(null);

  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isUnblockReasonOpen, setIsUnblockReasonOpen] = useState(false);
  const [unblockTargetTeam, setUnblockTargetTeam] = useState(null);

  const pendingResumes = gameResumes.filter((r) => r.status === "pending_resume");

  const verifyLockBeforeEdit = (callback) => {
    if (isQuestionsLocked) {
      setIsLockModalOpen(true);
    } else {
      callback();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <div className="dashboard-header glass-card jarvis-hud-card" style={{ padding: "1.5rem 2rem", marginBottom: "2rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="user-profile-badge">
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "radial-gradient(circle, #38bdf8 0%, #1d4ed8 100%)", border: "2px solid #38bdf8", boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#030712" }}>
            <UserCheck size={26} style={{ animation: "rotateArc 10s linear infinite" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h2 className="jarvis-text-glow" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                INNOVEXA-JARVIS COORDINATOR HUD
              </h2>
              <span className="role-badge" style={{ margin: 0, background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid #38bdf8" }}>
                COORDINATOR CONTROL
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#7dd3fc", marginTop: "0.2rem" }}>
              Coordinator: <strong style={{ color: "#ffffff" }}>{user.name}</strong> • Allocated Track: <strong style={{ color: "#00f0ff" }}>{user.assignedGameTitle || "All Event Games"}</strong>
            </p>
          </div>
        </div>

        <button type="button" className="btn-logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Exit Coordinator</span>
        </button>
      </div>

      {/* LIVE MID-GAME RESUME REQUESTS NOTIFICATION CARD */}
      {pendingResumes.length > 0 && (
        <div className="glass-card jarvis-hud-card" style={{ padding: "1.5rem", marginBottom: "2rem", border: "2px solid #fbbf24", background: "rgba(251, 191, 36, 0.08)", position: "relative" }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(251, 191, 36, 0.2)", border: "1px solid #fbbf24", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24" }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fbbf24" }}>
                🚨 {pendingResumes.length} Pending Mid-Game Exit & Resume Request{pendingResumes.length > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#7dd3fc" }}>
                A student team left or closed the tab while playing. Choose whether to approve resuming from where they left off or disallow play.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {pendingResumes.map((req) => (
              <div
                key={req.teamId}
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  background: "rgba(3, 7, 18, 0.8)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "#ffffff" }}>
                    Team: <strong style={{ color: "#00f0ff" }}>{req.teamName}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                    Game: <span style={{ color: "#a78bfa", fontWeight: 700 }}>{req.gameTitle}</span> • Left at <strong>Question #{req.currentIndex + 1}</strong> ({req.score} Pts accumulated)
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => onApproveResume && onApproveResume(req.teamId)}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      boxShadow: "0 0 12px rgba(16, 185, 129, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>▶️ Resume Quiz</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDisallowResume && onDisallowResume(req.teamId)}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.2)",
                      color: "#f87171",
                      border: "1px solid #ef4444",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <ShieldOff size={16} />
                    <span>🚫 Don't Let Play / Block</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin <-> Coordinator Event Workflow Visualizer */}
      <WorkflowVisualizer
        activeRole="coordinator"
        coordinatorsCount={1}
        gameLocks={gameLocks}
        isQuestionsLocked={isQuestionsLocked}
        leaderboardCount={leaderboardData.length}
      />

      {/* Team Progress & Points Dashboard */}
      <TeamProgressWidget
        leaderboardData={leaderboardData}
        gameTitles={gameTitles}
      />

      {/* Security Question Lock Status Banner */}
      <div style={{
        marginBottom: "1.75rem",
        padding: "1.25rem 1.5rem",
        borderRadius: "20px",
        background: isQuestionsLocked ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
        border: isQuestionsLocked ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: isQuestionsLocked ? "#ef4444" : "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isQuestionsLocked ? <Lock size={24} /> : <Unlock size={24} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
              Question Security Lock: <span style={{ color: isQuestionsLocked ? "#f87171" : "#34d399" }}>{isQuestionsLocked ? "LOCKED WITH PASSWORD" : "UNLOCKED FOR EDITING"}</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)", marginTop: "0.2rem" }}>
              {isQuestionsLocked ? "Question definitions, answers & marks are frozen to prevent tampering during event. Admin can override this lock." : "Coordinator can freely add/edit questions, options, answers, and marks."}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsLockModalOpen(true)}
          style={{
            padding: "0.6rem 1.1rem",
            fontSize: "0.85rem",
            background: isQuestionsLocked ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          }}
        >
          {isQuestionsLocked ? <Unlock size={16} /> : <Lock size={16} />}
          <span>{isQuestionsLocked ? "Unlock Questions" : "Lock Questions with Password"}</span>
        </button>
      </div>

      {/* Coordinator Game Track Start Controls */}
      <div className="glass-card jarvis-hud-card" style={{ padding: "1.5rem 1.75rem", marginBottom: "1.75rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <Flame size={22} color="#00f0ff" />
          <div>
            <h3 className="jarvis-text-glow" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              COORDINATOR GAME TRACK START CONTROLS
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
              Admin unlocks master event access • Coordinator clicks START to launch game for students
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
          {assignedGames.map((gameId) => {
            const title = gameTitles[gameId] || (gameId === "abbrev_quiz" ? "Abbreviation Speed Quiz" : "AI vs Real Image Detector");
            const isLockedByAdmin = gameLocks[gameId];
            const isStartedByCoord = gameStartedStates[gameId];

            return (
              <div 
                key={gameId}
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  background: "rgba(3, 7, 18, 0.7)",
                  border: isLockedByAdmin 
                    ? "1px solid rgba(239, 68, 68, 0.4)" 
                    : isStartedByCoord 
                    ? "1px solid #00f0ff" 
                    : "1px solid rgba(251, 191, 36, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem"
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "0.3rem" }}>
                    {title}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.78rem" }}>
                    {/* Admin Lock Badge */}
                    <span style={{
                      padding: "0.2rem 0.6rem", borderRadius: "6px",
                      background: isLockedByAdmin ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: isLockedByAdmin ? "#f87171" : "#34d399",
                      border: isLockedByAdmin ? "1px solid #ef4444" : "1px solid #10b981",
                      fontWeight: 700
                    }}>
                      {isLockedByAdmin ? "🔒 Locked by Admin" : "🟢 Unlocked by Admin"}
                    </span>

                    {/* Coordinator Start Badge */}
                    <span style={{
                      padding: "0.2rem 0.6rem", borderRadius: "6px",
                      background: isStartedByCoord ? "rgba(0, 240, 255, 0.15)" : "rgba(251, 191, 36, 0.15)",
                      color: isStartedByCoord ? "#00f0ff" : "#fbbf24",
                      border: isStartedByCoord ? "1px solid #00f0ff" : "1px solid #fbbf24",
                      fontWeight: 700
                    }}>
                      {isStartedByCoord ? "🚀 LIVE FOR PLAYERS" : "⏳ PAUSED BY COORDINATOR"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleGameStart && onToggleGameStart(gameId)}
                  disabled={isLockedByAdmin}
                  style={{
                    padding: "0.6rem 1.1rem",
                    borderRadius: "10px",
                    border: "none",
                    background: isLockedByAdmin 
                      ? "rgba(255, 255, 255, 0.08)" 
                      : isStartedByCoord 
                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                      : "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
                    color: isLockedByAdmin ? "#94a3b8" : "#030712",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: isLockedByAdmin ? "not-allowed" : "pointer",
                    boxShadow: isLockedByAdmin ? "none" : "0 0 15px rgba(0, 240, 255, 0.4)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {isLockedByAdmin 
                    ? "Admin Locked 🔒" 
                    : isStartedByCoord 
                    ? "⏸️ PAUSE GAME TRACK" 
                    : "▶️ START GAME TRACK"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Student Teams Monitor (Anti-Cheat Security) */}
      <div className="glass-card jarvis-hud-card" style={{ padding: "1.5rem 1.75rem", marginBottom: "1.75rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShieldOff size={22} color="#f87171" />
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f87171" }}>
                BLOCKED STUDENT TEAMS MONITOR (ANTI-CHEAT SYSTEM)
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
                Teams automatically blocked due to 2 tab switches during gameplay • Unblocking applies a <strong>-50 Pts Anti-Cheat Penalty</strong>
              </p>
            </div>
          </div>

          <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444" }}>
            {studentTeamsList.filter(t => t.isBlocked).length} Teams Blocked
          </span>
        </div>

        {(() => {
          const blockedTeams = studentTeamsList.filter(t => t.isBlocked);

          if (blockedTeams.length === 0) {
            return (
              <div style={{ padding: "1.25rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={20} />
                <span>🟢 All student teams active. No tab-switching anti-cheat violations reported.</span>
              </div>
            );
          }

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {blockedTeams.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "1.1rem 1.25rem",
                    borderRadius: "14px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#ffffff" }}>
                        {t.teamName}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "6px", background: "#ef4444", color: "#ffffff" }}>
                        CODE: {t.teamCode}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f87171" }}>
                        ⛔ BLOCKED (2/2 Tab Switches)
                      </span>
                    </div>

                    <div style={{ fontSize: "0.82rem", color: "#7dd3fc" }}>
                      Leader: <strong>{t.leaderName}</strong> • Members: {Array.isArray(t.members) ? t.members.join(", ") : t.leaderName}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUnblockTargetTeam(t);
                      setIsUnblockReasonOpen(true);
                    }}
                    style={{
                      padding: "0.65rem 1.2rem",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Unlock size={16} />
                    <span>🔓 UNBLOCK STUDENT TEAM</span>
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Track Tab Switcher */}
      {hasQuiz && hasImg && (
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setActiveTab("quiz")}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.9rem",
              background: activeTab === "quiz" ? "var(--role-gradient)" : "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-dark)"
            }}
          >
            <HelpCircle size={18} />
            <span>Manage {gameTitles.abbrev_quiz}</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setActiveTab("img")}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.9rem",
              background: activeTab === "img" ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" : "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-dark)"
            }}
          >
            <Lightbulb size={18} />
            <span>Manage {gameTitles.real_fake_img}</span>
          </button>
        </div>
      )}

      {/* QUIZ QUESTION MANAGEMENT SECTION */}
      {(activeTab === "quiz" || (hasQuiz && !hasImg)) && (
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {gameTitles.abbrev_quiz} - Question Bank & Marks Builder
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)" }}>
                Add/edit questions, set correct options, and configure custom mark allocations.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => verifyLockBeforeEdit(() => { setEditingQuestion(null); setIsQuestionModalOpen(true); })}
              style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
            >
              <Plus size={16} />
              <span>Add New Question</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {quizQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                style={{
                  padding: "1.25rem",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-dark)"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", marginRight: "0.5rem" }}>
                      Q{idx + 1}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                      {q.marks || 10} Marks
                    </span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.4rem" }}>
                      {q.question}
                    </h4>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => verifyLockBeforeEdit(() => { setEditingQuestion(q); setIsQuestionModalOpen(true); })}
                      style={{ background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#818cf8", padding: "0.4rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                    >
                      <Edit size={14} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => verifyLockBeforeEdit(() => onDeleteQuizQuestion(q.id))}
                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "0.4rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.85rem" }}>
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      style={{
                        padding: "0.6rem 0.85rem",
                        borderRadius: "8px",
                        background: oIdx === q.correct ? "rgba(16, 185, 129, 0.15)" : "rgba(15, 23, 42, 0.5)",
                        border: oIdx === q.correct ? "1px solid #10b981" : "1px solid var(--border-dark)",
                        color: oIdx === q.correct ? "#34d399" : "var(--text-dark-secondary)",
                        fontWeight: oIdx === q.correct ? 700 : 500
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correct && "✓ (Correct Answer)"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FACT FINDER QUESTION MANAGEMENT SECTION */}
      {(activeTab === "img" || (hasImg && !hasQuiz)) && (
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {gameTitles.real_fake_img} - Fact Question Bank Builder
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)" }}>
                Add/edit fact questions. Each question has 1 real fact + 2 fake facts. Students identify the real one.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => verifyLockBeforeEdit(() => { setEditingFact(null); setIsFactModalOpen(true); })}
              style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
            >
              <Plus size={16} />
              <span>Add New Fact Question</span>
            </button>
          </div>

          {/* Fact questions list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {(realFakeImages || []).length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed rgba(167,139,250,0.3)", borderRadius: "12px", color: "#a78bfa", fontSize: "0.88rem" }}>
                No fact questions added yet. Click "Add New Fact Question" to create the first question.
              </div>
            ) : (
              (realFakeImages || []).map((factItem, idx) => (
                <div
                  key={factItem.id || idx}
                  style={{
                    padding: "1.25rem",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-dark)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                          Q{idx + 1}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px", background: "rgba(16,185,129,0.2)", color: "#34d399" }}>
                          {factItem.marks || 10} Marks
                        </span>
                        {factItem.category && (
                          <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "6px", background: "rgba(56,189,248,0.12)", color: "#38bdf8", fontWeight: 600 }}>
                            {factItem.category}
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.65rem" }}>{factItem.question}</h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.83rem" }}>
                        <div style={{ padding: "0.45rem 0.75rem", borderRadius: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                          <span style={{ fontWeight: 800, flexShrink: 0 }}>✓ REAL:</span>
                          <span>{factItem.realFact}</span>
                        </div>
                        <div style={{ padding: "0.45rem 0.75rem", borderRadius: "8px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                          <span style={{ fontWeight: 800, flexShrink: 0 }}>✗ FAKE 1:</span>
                          <span>{factItem.fakeFact1}</span>
                        </div>
                        <div style={{ padding: "0.45rem 0.75rem", borderRadius: "8px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                          <span style={{ fontWeight: 800, flexShrink: 0 }}>✗ FAKE 2:</span>
                          <span>{factItem.fakeFact2}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem", marginLeft: "1rem", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => verifyLockBeforeEdit(() => { setEditingFact(factItem); setIsFactModalOpen(true); })}
                        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", padding: "0.4rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => verifyLockBeforeEdit(() => onDeleteImageChallenge(factItem.id))}
                        style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.4rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Live Student Event Leaderboard */}
      <Scoreboard leaderboardData={leaderboardData} />

      {/* Modals */}
      <QuestionEditorModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        editingQuestion={editingQuestion}
        onSaveQuestion={onSaveQuizQuestion}
      />

      <FactEditorModal
        isOpen={isFactModalOpen}
        onClose={() => setIsFactModalOpen(false)}
        editingFact={editingFact}
        onSaveFact={onSaveImageChallenge}
      />

      <LockQuestionsModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        isCurrentlyLocked={isQuestionsLocked}
        onToggleLock={onToggleQuestionLockState}
      />

      <UnblockReasonModal
        isOpen={isUnblockReasonOpen}
        team={unblockTargetTeam}
        onClose={() => setIsUnblockReasonOpen(false)}
        onConfirmUnblock={(teamId, reason) => {
          setIsUnblockReasonOpen(false);
          if (onUnblockTeam) {
            onUnblockTeam(teamId, reason);
          }
        }}
      />
    </div>
  );
}
