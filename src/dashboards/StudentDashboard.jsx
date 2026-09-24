import React, { useState, useEffect } from "react";
import { 
  GraduationCap, Users, UserPlus, Play, Lock, Trophy, 
  LogOut, CheckCircle2, Sparkles, Award, HelpCircle, Image as ImageIcon,
  ShieldAlert, Maximize, Minimize, AlertTriangle, ShieldOff, Unlock
} from "lucide-react";
import Scoreboard from "../components/Scoreboard";
import AbbreviationQuiz from "../games/AbbreviationQuiz";
import FactFinderGame from "../games/FactFinderGame";
import TeamProgressWidget from "../components/TeamProgressWidget";

export default function StudentDashboard({
  user,
  onLogout,
  gameLocks = {},
  gameStartedStates = {},
  gameTitles = {},
  activeTeam,
  onOpenTeamModal,
  leaderboardData,
  quizQuestions = [],
  realFakeImages = [],
  onScoreSubmitted,
  onBlockTeam,
  gameResumes = [],
  onSaveGameResume
}) {
  const [activeGame, setActiveGame] = useState(null); // null | 'abbrev_quiz' | 'real_fake_img'
  const [resumeData, setResumeData] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(() => {
    const saved = sessionStorage.getItem(`tab_switches_${activeTeam?.id || "student"}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [warningToast, setWarningToast] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentResume = gameResumes.find((r) => r.teamId === activeTeam?.id);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Anti-Cheat Tab-Switch Detection (2 Switches Max) - ONLY ACTIVE WHILE PLAYING A GAME
  useEffect(() => {
    // Cheat system ONLY works when the game is actively launched and played by students
    if (!activeGame) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Record mid-game exit request to coordinator
        if (onSaveGameResume && activeTeam?.id) {
          onSaveGameResume({
            teamId: activeTeam.id,
            teamName: activeTeam.teamName,
            gameId: activeGame,
            gameTitle: gameTitles[activeGame] || "Event Game",
            currentIndex: 0,
            score: 0,
            status: "pending_resume"
          });
        }

        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          sessionStorage.setItem(`tab_switches_${activeTeam?.id || "student"}`, nextCount);

          if (nextCount >= 2) {
            if (onBlockTeam && activeTeam?.id) {
              onBlockTeam(activeTeam.id);
            }
          } else {
            setWarningToast("⚠️ ANTI-CHEAT WARNING: Tab switch detected while playing game (1/2)! Switching tabs one more time will automatically block your team account.");
          }
          return nextCount;
        });
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [activeGame, activeTeam, onBlockTeam, onSaveGameResume, gameTitles]);

  const teamLbEntry = leaderboardData.find(
    (t) => t.teamId === activeTeam?.id || t.teamName?.toLowerCase() === activeTeam?.teamName?.toLowerCase()
  );

  const handleLaunchGame = (gameId, resumeObj = null) => {
    if (gameId === "abbrev_quiz" && (teamLbEntry?.abbrevCompleted || (teamLbEntry && teamLbEntry.abbrevScore > 0))) {
      alert("⚠️ You have already completed Game 1! Replaying completed games is strictly not allowed.");
      return;
    }
    if (gameId === "real_fake_img" && (teamLbEntry?.imageCompleted || (teamLbEntry && teamLbEntry.imageScore > 0))) {
      alert("⚠️ You have already completed Game 2! Replaying completed games is strictly not allowed.");
      return;
    }
    setResumeData(resumeObj);
    setActiveGame(gameId);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleGame1Complete = (results) => {
    onScoreSubmitted({
      teamId: activeTeam?.id || "TEAM-4892",
      gameId: "abbrev_quiz",
      score: results.score,
      timeSeconds: results.timeSeconds
    });
  };

  const handleGame2Complete = (results) => {
    onScoreSubmitted({
      teamId: activeTeam?.id || "TEAM-4892",
      gameId: "real_fake_img",
      score: results.score,
      timeSeconds: results.timeSeconds
    });
  };

  const handlePauseMidGame = (pauseInfo) => {
    if (onSaveGameResume && activeTeam?.id) {
      onSaveGameResume({
        teamId: activeTeam.id,
        teamName: activeTeam.teamName,
        gameId: pauseInfo.gameId,
        gameTitle: pauseInfo.gameTitle,
        currentIndex: pauseInfo.currentIndex,
        score: pauseInfo.score,
        savedState: pauseInfo.savedState,
        status: "pending_resume"
      });
    }
    setActiveGame(null);
  };

  const isTeamBlocked = activeTeam?.isBlocked || tabSwitchCount >= 2 || currentResume?.status === "disallowed";

  // BLOCK SCREEN OVERLAY (If student team is blocked due to anti-cheat violation or disallowed by coordinator)
  if (isTeamBlocked) {
    return (
      <div className="dashboard-container" style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card jarvis-hud-card" style={{ maxWidth: "560px", padding: "2.5rem", textAlign: "center", border: "2px solid #ef4444", position: "relative" }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.2)", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "#f87171" }}>
            <ShieldOff size={36} />
          </div>

          <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.8rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            ANTI-CHEAT PROTOCOL VIOLATION
          </span>

          <h2 className="jarvis-text-glow" style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "0.75rem", color: "#f87171" }}>
            ACCOUNT & TEAM BLOCKED
          </h2>

          <p style={{ fontSize: "0.9rem", color: "#cbd5e1", margin: "1rem 0 1.5rem", lineHeight: 1.5 }}>
            Your team <strong style={{ color: "#00f0ff" }}>{activeTeam?.teamName || "Student Team"}</strong> ({activeTeam?.teamCode}) has been <strong>BLOCKED</strong> by the Event Coordinator / System.
          </p>

          <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(3, 7, 18, 0.7)", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
            <div style={{ color: "#94a3b8", marginBottom: "0.4rem" }}>📋 <strong>Team Details:</strong></div>
            <div style={{ color: "#fff" }}>Member: <strong>{user.name}</strong></div>
            <div style={{ color: "#7dd3fc" }}>Leader: <strong>{activeTeam?.leaderName || user.name}</strong></div>
          </div>

          <div style={{ padding: "0.85rem", borderRadius: "10px", background: "rgba(251, 191, 36, 0.12)", border: "1px solid #fbbf24", color: "#fbbf24", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
            🔑 <strong>UNBLOCK REQUIRED:</strong> Only an <strong>Event Coordinator</strong> can unblock your team from their Coordinator Panel.
          </div>

          <button type="button" className="btn-logout" onClick={onLogout} style={{ margin: "0 auto" }}>
            <LogOut size={16} />
            <span>Exit Arena</span>
          </button>
        </div>
      </div>
    );
  }

  // PENDING RESUME OVERLAY (If student left mid-game and is waiting for coordinator decision)
  if (currentResume && currentResume.status === "pending_resume" && !activeGame) {
    return (
      <div className="dashboard-container" style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card jarvis-hud-card" style={{ maxWidth: "600px", padding: "2.5rem", textAlign: "center", border: "2px solid #fbbf24", position: "relative" }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "rgba(251, 191, 36, 0.15)", border: "2px solid #fbbf24", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "#fbbf24" }}>
            <AlertTriangle size={36} />
          </div>

          <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.8rem", borderRadius: "8px", background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", border: "1px solid #fbbf24", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            MID-GAME EXIT DETECTED
          </span>

          <h2 className="jarvis-text-glow" style={{ fontSize: "1.65rem", fontWeight: 800, marginTop: "0.75rem", color: "#fbbf24" }}>
            Waiting for Coordinator Decision
          </h2>

          <p style={{ fontSize: "0.92rem", color: "#cbd5e1", margin: "1rem 0 1.5rem", lineHeight: 1.5 }}>
            You left <strong>{currentResume.gameTitle}</strong> while playing at <strong>Question #{currentResume.currentIndex + 1}</strong> with <strong>{currentResume.score} Pts</strong>.
            <br />A live notification has been sent to the Event Coordinator.
          </p>

          <div style={{ padding: "1.25rem", borderRadius: "14px", background: "rgba(3, 7, 18, 0.85)", border: "1px solid rgba(251, 191, 36, 0.3)", textAlign: "left", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ color: "#94a3b8" }}>Game:</span>
              <strong style={{ color: "#00f0ff" }}>{currentResume.gameTitle}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ color: "#94a3b8" }}>Saved Progress:</span>
              <strong style={{ color: "#34d399" }}>Question #{currentResume.currentIndex + 1}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ color: "#94a3b8" }}>Accumulated Score:</span>
              <strong style={{ color: "#a78bfa" }}>{currentResume.score} Pts</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", padding: "0.5rem 0.75rem", borderRadius: "8px", background: "rgba(251, 191, 36, 0.1)", border: "1px solid #fbbf24", color: "#fbbf24", fontWeight: 700, fontSize: "0.8rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
              <span>Status: Waiting for Coordinator Response (Real-Time)...</span>
            </div>
          </div>

          <p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
            Once the Coordinator clicks <strong>"Resume Quiz"</strong>, your game will automatically resume from Question #{currentResume.currentIndex + 1}!
          </p>
        </div>
      </div>
    );
  }

  // If currently playing a game, render full-screen game view with top exit bar
  if (activeGame === "abbrev_quiz") {
    return (
      <div className="dashboard-container" style={{ position: "relative" }}>
        <AbbreviationQuiz
          team={activeTeam}
          questionsList={quizQuestions}
          onCompleteQuiz={handleGame1Complete}
          onPauseGame={handlePauseMidGame}
          resumeData={resumeData || currentResume}
          onBack={() => {
            setActiveGame(null);
            setResumeData(null);
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
          }}
        />
      </div>
    );
  }

  if (activeGame === "real_fake_img") {
    return (
      <div className="dashboard-container" style={{ position: "relative" }}>
        <FactFinderGame
          team={activeTeam}
          factsList={realFakeImages}
          onCompleteGame={handleGame2Complete}
          onPauseGame={handlePauseMidGame}
          resumeData={resumeData || currentResume}
          onBack={() => {
            setActiveGame(null);
            setResumeData(null);
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Anti-Cheat Unblock Penalty Alert */}
      {activeTeam?.penalty > 0 && (
        <div style={{
          marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "14px",
          background: "rgba(239, 68, 68, 0.12)", border: "1px solid #ef4444",
          color: "#f87171", fontSize: "0.88rem", display: "flex", alignItems: "center",
          gap: "0.75rem", fontWeight: 700
        }}>
          <ShieldAlert size={22} />
          <div>
            <div>🔓 <strong>ACCESS RESTORED BY EVENT COORDINATOR</strong></div>
            <div style={{ fontSize: "0.8rem", color: "#fca5a5", marginTop: "0.15rem", fontWeight: 500 }}>
              Your team was unblocked. A <strong>-{activeTeam.penalty} Point Anti-Cheat Penalty</strong> has been applied to your total leaderboard score. You may now freely play your event games.
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Tab Switch Warning Toast */}
      {warningToast && (
        <div style={{
          marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "14px",
          background: "rgba(251, 191, 36, 0.15)", border: "1px solid #fbbf24",
          color: "#fbbf24", fontSize: "0.88rem", display: "flex", alignItems: "center",
          justify: "space-between", gap: "1rem", fontWeight: 600
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <AlertTriangle size={20} />
            <span>{warningToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarningToast("")}
            style={{ background: "transparent", border: "none", color: "#fbbf24", cursor: "pointer", fontWeight: 800 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="dashboard-header glass-card jarvis-hud-card" style={{ padding: "1.5rem 2rem", marginBottom: "2rem", position: "relative" }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="user-profile-badge">
          <img src={user.picture || user.avatar} alt={user.name} className="user-avatar" style={{ border: "2px solid #00f0ff", boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h2 className="jarvis-text-glow" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
                INNOVEXA-JARVIS STUDENT ARENA
              </h2>
              <span className="role-badge" style={{ margin: 0, background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", border: "1px solid #00f0ff" }}>
                STUDENT PLAYER
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#7dd3fc", marginTop: "0.2rem" }}>
              Player: <strong style={{ color: "#ffffff" }}>{user.name}</strong> ({user.email}) • Team Code: <strong style={{ color: "#00f0ff" }}>{user.studentId || "STU-2026"}</strong>
            </p>
          </div>
        </div>

        <button type="button" className="btn-logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Exit Event Portal</span>
        </button>
      </div>

      {/* Student Team Banner */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                YOUR COMPETITION TEAM
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "#fff", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span>{activeTeam ? activeTeam.teamName : "Real Student Team"}</span>
                <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", borderRadius: "8px", background: "var(--role-gradient)", color: "#fff", fontWeight: 700 }}>
                  Code: {activeTeam ? activeTeam.teamCode : "ST-9000"}
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)", marginTop: "0.2rem" }}>
                Leader: {activeTeam?.leaderName || user.name} • Members: {activeTeam ? activeTeam.members.join(", ") : user.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Progress & Points Dashboard */}
      <TeamProgressWidget
        leaderboardData={leaderboardData}
        gameTitles={gameTitles}
      />

      {/* Event Games Section */}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Trophy size={22} color="var(--role-primary)" />
        <span>Playable Event Competitions</span>
      </h3>

      <div className="responsive-grid-2" style={{ marginBottom: "2rem" }}>
        {/* Game 1 Card */}
        {(() => {
          const isLockedByAdmin = gameLocks.abbrev_quiz;
          const isStartedByCoord = gameStartedStates.abbrev_quiz;
          const isCompleted = teamLbEntry?.abbrevCompleted || (teamLbEntry && teamLbEntry.abbrevScore > 0);
          const canPlay = !isLockedByAdmin && isStartedByCoord && !isCompleted;

          return (
            <div className="glass-card jarvis-hud-card" style={{ padding: "1.75rem", position: "relative" }}>
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(0, 240, 255, 0.15)", color: "#00f0ff", border: "1px solid #00f0ff" }}>
                  GAME 1 • SPEED QUIZ
                </span>
                
                {isCompleted ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={12} /> GAME COMPLETED ({teamLbEntry?.abbrevScore || 0} Pts)
                  </span>
                ) : isLockedByAdmin ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Lock size={12} /> Admin locked the game
                  </span>
                ) : !isStartedByCoord ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", border: "1px solid #fbbf24", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    ⏳ Waiting for Coordinator to start
                  </span>
                ) : (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={12} /> LIVE & READY TO PLAY
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                {gameTitles.abbrev_quiz || "Abbreviation Speed Quiz"}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "#7dd3fc", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                Test your knowledge in a sprint with {quizQuestions.length} questions configured by event coordinators.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={() => handleLaunchGame("abbrev_quiz")}
                disabled={!canPlay}
                style={{
                  background: isCompleted ? "rgba(16, 185, 129, 0.15)" : canPlay ? "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)" : "rgba(255, 255, 255, 0.08)",
                  color: isCompleted ? "#34d399" : canPlay ? "#030712" : "#94a3b8",
                  opacity: canPlay ? 1 : 0.6,
                  cursor: canPlay ? "pointer" : "not-allowed",
                  border: isCompleted ? "1px solid #10b981" : canPlay ? "1px solid #00f0ff" : "none",
                  fontWeight: 800
                }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>COMPLETED ✓ (REPLAY NOT ALLOWED)</span>
                  </>
                ) : isLockedByAdmin ? (
                  <>
                    <Lock size={18} />
                    <span>Admin locked the game 🔒</span>
                  </>
                ) : !isStartedByCoord ? (
                  <>
                    <Lock size={18} />
                    <span>Waiting for Coordinator to start ⏳</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>START GAME 1 NOW</span>
                  </>
                )}
              </button>
            </div>
          );
        })()}

        {/* Game 2 Card */}
        {(() => {
          const isLockedByAdmin = gameLocks.real_fake_img;
          const isStartedByCoord = gameStartedStates.real_fake_img;
          const isCompleted = teamLbEntry?.imageCompleted || (teamLbEntry && teamLbEntry.imageScore > 0);
          const canPlay = !isLockedByAdmin && isStartedByCoord && !isCompleted;

          return (
            <div className="glass-card jarvis-hud-card" style={{ padding: "1.75rem", position: "relative" }}>
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid #a78bfa" }}>
                  GAME 2 • FACT FINDER
                </span>
                
                {isCompleted ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={12} /> GAME COMPLETED ({teamLbEntry?.imageScore || 0} Pts)
                  </span>
                ) : isLockedByAdmin ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Lock size={12} /> Admin locked the game
                  </span>
                ) : !isStartedByCoord ? (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", border: "1px solid #fbbf24", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    ⏳ Waiting for Coordinator to start
                  </span>
                ) : (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={12} /> LIVE & READY TO PLAY
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                {gameTitles.real_fake_img || "Fact Finder"}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "#7dd3fc", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                Read 3 statements and identify which one is the REAL fact — {realFakeImages.length} questions configured by coordinators.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={() => handleLaunchGame("real_fake_img")}
                disabled={!canPlay}
                style={{
                  background: isCompleted ? "rgba(16, 185, 129, 0.15)" : canPlay ? "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)" : "rgba(255, 255, 255, 0.08)",
                  color: isCompleted ? "#34d399" : canPlay ? "#030712" : "#94a3b8",
                  opacity: canPlay ? 1 : 0.6,
                  cursor: canPlay ? "pointer" : "not-allowed",
                  border: isCompleted ? "1px solid #10b981" : canPlay ? "1px solid #00f0ff" : "none",
                  fontWeight: 800
                }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>COMPLETED ✓ (REPLAY NOT ALLOWED)</span>
                  </>
                ) : isLockedByAdmin ? (
                  <>
                    <Lock size={18} />
                    <span>Admin locked the game 🔒</span>
                  </>
                ) : !isStartedByCoord ? (
                  <>
                    <Lock size={18} />
                    <span>Waiting for Coordinator to start ⏳</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>START GAME 2 NOW</span>
                  </>
                )}
              </button>
            </div>
          );
        })()}
      </div>

      {/* Live Event Leaderboard */}
      <Scoreboard leaderboardData={leaderboardData} />
    </div>
  );
}
