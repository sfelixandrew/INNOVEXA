import React, { useState } from "react";
import { 
  ShieldCheck, Lock, Unlock, UserPlus, Users, Trophy, 
  LogOut, Activity, Database, CheckCircle2, Layers, AlertCircle, 
  FileSpreadsheet, Edit3, Award, Sparkles, Printer, Download, KeyRound, Zap, Trash2 
} from "lucide-react";
import Scoreboard from "../components/Scoreboard";
import CreateCoordinatorModal from "../components/CreateCoordinatorModal";
import CreateStudentTeamModal from "../components/CreateStudentTeamModal";
import AttendanceSheetModal from "../components/AttendanceSheetModal";
import EditGameModal from "../components/EditGameModal";
import AddTeamPointsModal from "../components/AddTeamPointsModal";
import WorkflowVisualizer from "../components/WorkflowVisualizer";
import TeamProgressWidget from "../components/TeamProgressWidget";

export default function AdminDashboard({
  user,
  onLogout,
  gameLocks,
  onToggleGameLock,
  isQuestionsLocked,
  onBreakQuestionsLock,
  gameTitles,
  onSaveGameTitles,
  coordinators,
  onCreateCoordinator,
  onDeleteCoordinator,
  studentTeams = [],
  onCreateStudentTeam,
  onDeleteStudentTeam,
  leaderboardData,
  onImportPoints,
  onClearLeaderboard
}) {
  const [isCreateCoordOpen, setIsCreateCoordOpen] = useState(false);
  const [isCreateStudentTeamOpen, setIsCreateStudentTeamOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [isAddPointsOpen, setIsAddPointsOpen] = useState(false);

  return (
    <div className="dashboard-container" style={{ color: "#F8FAFC" }}>
      {/* Top Header */}
      <div className="dashboard-header glass-card jarvis-hud-card" style={{ padding: "1.5rem 2rem", marginBottom: "2rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="user-profile-badge">
          {/* Authority Badge Icon Container */}
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #00f0ff 0%, #0284c7 100%)",
            border: "2px solid #00f0ff",
            boxShadow: "0 0 20px rgba(0, 240, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#030712"
          }}>
            <ShieldCheck size={30} style={{ animation: "rotateArc 12s linear infinite" }} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h2 className="jarvis-text-glow" style={{ fontSize: "1.45rem", fontWeight: 800 }}>
                INNOVEXA-JARVIS EVENT DIRECTORY
              </h2>
              <span className="role-badge" style={{ margin: 0, background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", border: "1px solid #00f0ff" }}>
                J.A.R.V.I.S ADMIN HUD
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#7dd3fc", marginTop: "0.2rem" }}>
              Master Admin ID: <strong style={{ color: "#ffffff" }}>INNOVEXAADMINGP</strong> • {user.department || "Executive J.A.R.V.I.S Operations"}
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="responsive-action-row">
          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)", color: "#030712", fontWeight: 800, border: "1px solid #00f0ff", boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)" }}
            onClick={() => setIsAddPointsOpen(true)}
          >
            <Sparkles size={16} />
            <span>Add Points (Excel / Manual)</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)" }}
            onClick={() => setIsAttendanceOpen(true)}
          >
            <FileSpreadsheet size={16} />
            <span>Generate Attendance Sheet</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)" }}
            onClick={() => setIsEditGameOpen(true)}
          >
            <Edit3 size={16} />
            <span>Edit Game Titles</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)", color: "#030712", fontWeight: 800 }}
            onClick={() => setIsCreateStudentTeamOpen(true)}
          >
            <Users size={16} />
            <span>Generate Student Team & Code</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem" }}
            onClick={() => setIsCreateCoordOpen(true)}
          >
            <UserPlus size={16} />
            <span>Generate Coordinator</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ height: "42px", padding: "0 1.1rem", fontSize: "0.85rem", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#ffffff", fontWeight: 800, border: "1px solid #ef4444", boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}
            onClick={() => onClearLeaderboard && onClearLeaderboard()}
          >
            <Trash2 size={16} />
            <span>Clear Leaderboard List</span>
          </button>

          <button type="button" className="btn-logout" style={{ height: "42px", padding: "0 1.1rem" }} onClick={onLogout}>
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Admin <-> Coordinator Event Workflow Visualizer */}
      <WorkflowVisualizer
        activeRole="admin"
        coordinatorsCount={coordinators.length}
        gameLocks={gameLocks}
        isQuestionsLocked={isQuestionsLocked}
        leaderboardCount={leaderboardData.length}
      />

      {/* Team Progress & Points Dashboard */}
      <TeamProgressWidget
        leaderboardData={leaderboardData}
        gameTitles={gameTitles}
      />

      {/* PROMINENT COORDINATOR QUESTION LOCK STATUS & BREAK LOCK BOX ON ADMIN PAGE */}
      <div style={{
        marginBottom: "2rem",
        padding: "1.5rem 1.75rem",
        borderRadius: "20px",
        background: isQuestionsLocked ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.12)",
        border: isQuestionsLocked ? "2px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(16, 185, 129, 0.35)",
        boxShadow: isQuestionsLocked ? "0 10px 30px rgba(239, 68, 68, 0.25)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.25rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: isQuestionsLocked ? "#EF4444" : "#10B981",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isQuestionsLocked ? "0 6px 18px rgba(239, 68, 68, 0.4)" : "none"
          }}>
            <KeyRound size={26} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Coordinator Question Lock Status:</h3>
              <span style={{
                fontSize: "0.82rem",
                fontWeight: 800,
                padding: "0.3rem 0.75rem",
                borderRadius: "8px",
                background: isQuestionsLocked ? "rgba(239, 68, 68, 0.25)" : "rgba(16, 185, 129, 0.2)",
                color: isQuestionsLocked ? "#F87171" : "#34D399",
                border: isQuestionsLocked ? "1px solid #EF4444" : "1px solid #10B981"
              }}>
                {isQuestionsLocked ? "🔒 LOCKED WITH PASSWORD BY COORDINATOR" : "🟢 UNLOCKED / OPEN FOR EDITING"}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.3rem" }}>
              {isQuestionsLocked
                ? "A coordinator has locked the questions and marks with a security password. As Admin, click below to break the lock."
                : "Questions, options, and point marks are currently unlocked and editable by coordinators."}
            </p>
          </div>
        </div>

        {isQuestionsLocked && (
          <button
            type="button"
            className="btn-primary"
            onClick={onBreakQuestionsLock}
            style={{
              height: "46px",
              padding: "0 1.4rem",
              fontSize: "0.9rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <Zap size={18} />
            <span>⚡ Break Coordinator Question Lock (Reset Security Password)</span>
          </button>
        )}
      </div>

      {/* Game Name Customization & Master Student Lock Controls */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Lock size={22} color="#6366F1" />
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Master Game Student Access Controls</h3>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                Admin controls to lock/unlock game participation for students in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="fill-preset-btn"
            onClick={() => setIsEditGameOpen(true)}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", background: "rgba(99, 102, 241, 0.2)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.4)" }}
          >
            ✏️ Edit Official Game Names
          </button>
        </div>

        <div className="responsive-grid-2">
          {/* Game 1 Lock Box */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "16px",
              background: gameLocks.abbrev_quiz ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
              border: gameLocks.abbrev_quiz ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem" }}>Game 1: {gameTitles.abbrev_quiz}</div>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                Status: <strong style={{ color: gameLocks.abbrev_quiz ? "#F87171" : "#34D399" }}>{gameLocks.abbrev_quiz ? "LOCKED (Students disabled)" : "UNLOCKED (Live play)"}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleGameLock("abbrev_quiz")}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                border: "none",
                background: gameLocks.abbrev_quiz ? "#10B981" : "#EF4444",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              {gameLocks.abbrev_quiz ? <Unlock size={16} /> : <Lock size={16} />}
              <span>{gameLocks.abbrev_quiz ? "Unlock Game 1" : "Lock Game 1"}</span>
            </button>
          </div>

          {/* Game 2 Lock Box */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "16px",
              background: gameLocks.real_fake_img ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
              border: gameLocks.real_fake_img ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem" }}>Game 2: {gameTitles.real_fake_img}</div>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                Status: <strong style={{ color: gameLocks.real_fake_img ? "#F87171" : "#34D399" }}>{gameLocks.real_fake_img ? "LOCKED (Students disabled)" : "UNLOCKED (Live play)"}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleGameLock("real_fake_img")}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                border: "none",
                background: gameLocks.real_fake_img ? "#10B981" : "#EF4444",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              {gameLocks.real_fake_img ? <Unlock size={16} /> : <Lock size={16} />}
              <span>{gameLocks.real_fake_img ? "Unlock Game 2" : "Lock Game 2"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coordinators Provisioning Table */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShieldCheck size={22} color="#6366F1" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Coordinator Credentials & Allocations</h3>
          </div>
          <button
            type="button"
            className="fill-preset-btn"
            onClick={() => setIsCreateCoordOpen(true)}
          >
            + Generate New Coordinator
          </button>
        </div>

        {coordinators.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed var(--border-dark)", borderRadius: "12px", color: "#94A3B8", fontSize: "0.88rem" }}>
            No coordinator accounts provisioned yet. Click "Generate New Coordinator" to create credentials.
          </div>
        ) : (
          <div className="responsive-table-container">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-dark)", color: "#94A3B8", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "0.85rem 1rem" }}>Coordinator Name</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Generated Credentials</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Allocated Event Track</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Creation Date</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Revoke / Delete</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.85rem", color: "#818CF8", fontWeight: 600 }}>ID: {c.email}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Pass: {c.password}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", fontWeight: 700 }}>
                        {c.assignedGameTitle || "All Event Games"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#94A3B8" }}>
                      {c.createdTime}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onDeleteCoordinator && onDeleteCoordinator(c.id)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: "8px",
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete Credential</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provisioned Student Teams & Access Credentials Table */}
      <div className="glass-card jarvis-hud-card" style={{ padding: "1.75rem", marginBottom: "2rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Users size={22} color="#00f0ff" />
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Provisioned Student Teams & Access Codes
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
                Admin-generated Student Teams, Leaders, Members & Unique Passcodes
              </p>
            </div>
          </div>
          <button
            type="button"
            className="fill-preset-btn"
            onClick={() => setIsCreateStudentTeamOpen(true)}
            style={{ background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", border: "1px solid #00f0ff" }}
          >
            + Generate Student Team & Code
          </button>
        </div>

        {studentTeams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed rgba(0, 240, 255, 0.3)", borderRadius: "12px", color: "#7dd3fc", fontSize: "0.88rem" }}>
            No student teams provisioned yet. Click "+ Generate Student Team & Code" to create team credentials.
          </div>
        ) : (
          <div className="responsive-table-container">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0, 240, 255, 0.2)", color: "#7dd3fc", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "0.85rem 1rem" }}>Team Name</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Team Passcode / Code</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Leader & Members</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Creation Date</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Revoke Credentials</th>
                </tr>
              </thead>
              <tbody>
                {studentTeams.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#ffffff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Users size={16} color="#00f0ff" />
                        <span>{t.teamName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", padding: "0.3rem 0.75rem", borderRadius: "8px", background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", fontWeight: 800, border: "1px solid #00f0ff", letterSpacing: "0.05em" }}>
                        🔑 {t.teamCode}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>Leader: {t.leaderName}</div>
                      <div style={{ fontSize: "0.78rem", color: "#7dd3fc" }}>
                        Members: {Array.isArray(t.members) ? t.members.join(", ") : t.members}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#94A3B8" }}>
                      {t.createdTime}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onDeleteStudentTeam && onDeleteStudentTeam(t.id)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: "8px",
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete Team Credentials</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team Points Showcase & Leaderboard */}
      <Scoreboard 
        leaderboardData={leaderboardData} 
        onOpenAddPointsModal={() => setIsAddPointsOpen(true)} 
      />

      {/* Modals */}
      <CreateStudentTeamModal
        isOpen={isCreateStudentTeamOpen}
        onClose={() => setIsCreateStudentTeamOpen(false)}
        onCreateStudentTeam={onCreateStudentTeam}
      />

      <AddTeamPointsModal
        isOpen={isAddPointsOpen}
        onClose={() => setIsAddPointsOpen(false)}
        leaderboardData={leaderboardData}
        onImportPoints={onImportPoints}
      />

      <CreateCoordinatorModal
        isOpen={isCreateCoordOpen}
        onClose={() => setIsCreateCoordOpen(false)}
        onCreateCoordinator={onCreateCoordinator}
      />

      <AttendanceSheetModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        leaderboardData={leaderboardData}
      />

      <EditGameModal
        isOpen={isEditGameOpen}
        onClose={() => setIsEditGameOpen(false)}
        gameTitles={gameTitles}
        onSaveTitles={onSaveGameTitles}
      />
    </div>
  );
}
