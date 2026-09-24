import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, ShieldCheck, UserCheck, GraduationCap, Cloud } from "lucide-react";

import RoleSelector from "./components/RoleSelector";
import LoginForm from "./components/LoginForm";
import OtpModal from "./components/OtpModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import TeamModal from "./components/TeamModal";
import ThemeToggle from "./components/ThemeToggle";

import AdminDashboard from "./dashboards/AdminDashboard";
import CoordinatorDashboard from "./dashboards/CoordinatorDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

import { 
  INITIAL_GAME_LOCKS, 
  INITIAL_GAME_TITLES, 
  INITIAL_COORDINATORS, 
  INITIAL_STUDENT_TEAMS,
  INITIAL_LEADERBOARD,
  ABBREVIATION_QUESTIONS,
  FACT_FINDER_QUESTIONS
} from "./data/mockUsers";

import { 
  isSupabaseConfigured, 
  updateGameLockState, 
  createCoordinatorInSupabase, 
  submitScoreToSupabase, 
  saveTeamToSupabase,
  syncBroadcastChannel,
  broadcastEvent,
  fetchInitialSupabaseState,
  saveGameResumeToSupabase,
  fetchGameResumesFromSupabase,
  updateGameResumeStatusInSupabase,
  saveGameConfigToSupabase,
  deleteCoordinatorFromSupabase,
  deleteTeamFromSupabase,
  saveQuizQuestionToSupabase,
  deleteQuizQuestionFromSupabase,
  saveFactQuestionToSupabase,
  deleteFactQuestionFromSupabase,
  saveLeaderboardToSupabase,
  clearLeaderboardInSupabase,
  deleteGameResumeInSupabase,
  supabase
} from "./lib/supabase";

export default function App() {
  const [activeRole, setActiveRole] = useState("admin");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  // Real-World Event State with localStorage Persistence
  const [gameLocks, setGameLocks] = useState(() => {
    const saved = localStorage.getItem("innovex_game_locks");
    return saved ? JSON.parse(saved) : INITIAL_GAME_LOCKS;
  });

  const [gameStartedStates, setGameStartedStates] = useState(() => {
    const saved = localStorage.getItem("innovex_game_started");
    return saved ? JSON.parse(saved) : { abbrev_quiz: true, real_fake_img: true };
  });

  const [gameTitles, setGameTitles] = useState(() => {
    const saved = localStorage.getItem("innovex_game_titles");
    return saved ? JSON.parse(saved) : INITIAL_GAME_TITLES;
  });

  const [coordinators, setCoordinators] = useState(() => {
    const saved = localStorage.getItem("innovex_coordinators");
    return saved ? JSON.parse(saved) : INITIAL_COORDINATORS;
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem("innovex_leaderboard");
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [studentTeams, setStudentTeams] = useState(() => {
    const saved = localStorage.getItem("innovex_student_teams");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_TEAMS;
  });

  const [studentTeam, setStudentTeam] = useState(() => {
    const saved = localStorage.getItem("innovex_student_team");
    return saved ? JSON.parse(saved) : null;
  });

  // Coordinator Questions Security Lock State (Can be broken by Admin)
  const [isQuestionsLocked, setIsQuestionsLocked] = useState(() => {
    const saved = localStorage.getItem("innovex_questions_locked");
    return saved ? JSON.parse(saved) : false;
  });

  const [securityPassword, setSecurityPassword] = useState(() => {
    return localStorage.getItem("innovex_security_password") || "";
  });

  // Coordinator Configurable Questions & Images
  const [quizQuestions, setQuizQuestions] = useState(() => {
    const saved = localStorage.getItem("innovex_quiz_questions");
    return saved ? JSON.parse(saved) : ABBREVIATION_QUESTIONS;
  });

  const [realFakeImages, setRealFakeImages] = useState(() => {
    const saved = localStorage.getItem("innovex_real_fake_images");
    if (saved) {
      const parsed = JSON.parse(saved);
      // If saved data is old image format (has imageUrl), reset to new fact format
      if (parsed.length > 0 && parsed[0].imageUrl !== undefined) {
        return FACT_FINDER_QUESTIONS;
      }
      return parsed;
    }
    return FACT_FINDER_QUESTIONS;
  });

  // Mid-Game Exit & Resume Tracking
  const [gameResumes, setGameResumes] = useState(() => {
    const saved = localStorage.getItem("innovex_game_resumes");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when states change
  useEffect(() => {
    localStorage.setItem("innovex_game_locks", JSON.stringify(gameLocks));
  }, [gameLocks]);

  useEffect(() => {
    localStorage.setItem("innovex_game_started", JSON.stringify(gameStartedStates));
  }, [gameStartedStates]);

  useEffect(() => {
    localStorage.setItem("innovex_game_titles", JSON.stringify(gameTitles));
  }, [gameTitles]);

  useEffect(() => {
    localStorage.setItem("innovex_coordinators", JSON.stringify(coordinators));
  }, [coordinators]);

  useEffect(() => {
    localStorage.setItem("innovex_leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem("innovex_student_teams", JSON.stringify(studentTeams));
  }, [studentTeams]);

  useEffect(() => {
    if (studentTeam) {
      localStorage.setItem("innovex_student_team", JSON.stringify(studentTeam));
    }
  }, [studentTeam]);

  useEffect(() => {
    localStorage.setItem("innovex_questions_locked", JSON.stringify(isQuestionsLocked));
  }, [isQuestionsLocked]);

  useEffect(() => {
    localStorage.setItem("innovex_security_password", securityPassword);
  }, [securityPassword]);

  useEffect(() => {
    localStorage.setItem("innovex_quiz_questions", JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  useEffect(() => {
    localStorage.setItem("innovex_real_fake_images", JSON.stringify(realFakeImages));
  }, [realFakeImages]);

  useEffect(() => {
    localStorage.setItem("innovex_game_resumes", JSON.stringify(gameResumes));
  }, [gameResumes]);

  // 120-User Real-Time Synchronization Listener (BroadcastChannel + Storage + Supabase)
  const applySyncedState = (type, payload) => {
    if (!type || !payload) return;
    switch (type) {
      case "GAME_LOCKS_SYNC":
        setGameLocks(payload);
        break;
      case "GAME_STARTED_SYNC":
        setGameStartedStates(payload);
        break;
      case "GAME_TITLES_SYNC":
        setGameTitles(payload);
        break;
      case "LEADERBOARD_SYNC":
        setLeaderboard(payload);
        break;
      case "STUDENT_TEAMS_SYNC":
        setStudentTeams(payload);
        break;
      case "QUIZ_QUESTIONS_SYNC":
        setQuizQuestions(payload);
        break;
      case "REAL_FAKE_IMAGES_SYNC":
        setRealFakeImages(payload);
        break;
      case "GAME_RESUMES_SYNC":
        setGameResumes(payload);
        break;
      case "QUESTIONS_LOCKED_SYNC":
        if (payload.isQuestionsLocked !== undefined) setIsQuestionsLocked(payload.isQuestionsLocked);
        if (payload.securityPassword !== undefined) setSecurityPassword(payload.securityPassword);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 1. Cross-Tab & Multi-Window BroadcastChannel Listener
    if (syncBroadcastChannel) {
      const handleBroadcast = (event) => {
        const { type, payload } = event.data || {};
        applySyncedState(type, payload);
      };
      syncBroadcastChannel.addEventListener("message", handleBroadcast);
      return () => {
        syncBroadcastChannel.removeEventListener("message", handleBroadcast);
      };
    }
  }, []);

  useEffect(() => {
    // 2. Storage event listener across tabs/windows
    const handleStorageChange = (e) => {
      if (!e.key || !e.newValue) return;
      try {
        const val = JSON.parse(e.newValue);
        if (e.key === "innovex_game_locks") setGameLocks(val);
        if (e.key === "innovex_game_started") setGameStartedStates(val);
        if (e.key === "innovex_game_titles") setGameTitles(val);
        if (e.key === "innovex_leaderboard") setLeaderboard(val);
        if (e.key === "innovex_student_teams") setStudentTeams(val);
        if (e.key === "innovex_quiz_questions") setQuizQuestions(val);
        if (e.key === "innovex_real_fake_images") setRealFakeImages(val);
        if (e.key === "innovex_game_resumes") setGameResumes(val);
        if (e.key === "innovex_questions_locked") setIsQuestionsLocked(val);
      } catch (err) {}
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // 3. Supabase Realtime Listener (when configured)
    if (!isSupabaseConfigured()) return;
    try {
      // Fetch initial DB state on load
      fetchInitialSupabaseState().then((dbState) => {
        if (!dbState) return;
        if (dbState.gameLocks) setGameLocks((prev) => ({ ...prev, ...dbState.gameLocks }));
        if (dbState.coordinators !== undefined) setCoordinators(dbState.coordinators);
        if (dbState.studentTeams !== undefined) setStudentTeams(dbState.studentTeams);
        if (dbState.quizQuestions) setQuizQuestions(dbState.quizQuestions);
        if (dbState.factQuestions) setRealFakeImages(dbState.factQuestions);
        if (dbState.leaderboard !== undefined) setLeaderboard(dbState.leaderboard);
      });

      fetchGameResumesFromSupabase().then((resumesData) => {
        if (resumesData && resumesData.length > 0) {
          setGameResumes(resumesData);
        }
      });

      const room = supabase.channel("innovex_live_room");
      room
        .on("broadcast", { event: "*" }, (payload) => {
          if (payload && payload.event && payload.payload) {
            applySyncedState(payload.event, payload.payload);
          }
        })
        .subscribe();

      // Direct Postgres Database Table Changes Realtime Subscription
      const dbChangesChannel = supabase
        .channel("db_changes_room")
        .on(
          "postgres_changes",
          { event: "*", schema: "public" },
          () => {
            fetchInitialSupabaseState().then((dbState) => {
              if (!dbState) return;
              if (dbState.gameLocks) setGameLocks((prev) => ({ ...prev, ...dbState.gameLocks }));
              if (dbState.coordinators !== undefined) setCoordinators(dbState.coordinators);
              if (dbState.studentTeams !== undefined) setStudentTeams(dbState.studentTeams);
              if (dbState.quizQuestions) setQuizQuestions(dbState.quizQuestions);
              if (dbState.factQuestions) setRealFakeImages(dbState.factQuestions);
              if (dbState.leaderboard !== undefined) setLeaderboard(dbState.leaderboard);
            });
            fetchGameResumesFromSupabase().then((resumesData) => {
              if (resumesData) setGameResumes(resumesData);
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(room);
        supabase.removeChannel(dbChangesChannel);
      };
    } catch (e) {
      console.warn("Supabase realtime subscribe error:", e);
    }
  }, []);

  // Modals
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingOtpUser, setPendingOtpUser] = useState(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-role", activeRole);
    if (theme === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  }, [activeRole, theme]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  const handleLoginSuccess = (userObj) => {
    setLoggedInUser(userObj);
    triggerConfetti();
    showToast(`Authenticated as ${userObj.role.toUpperCase()} (${userObj.name})!`);

    if (userObj.role === "student" && userObj.team) {
      const teamId = userObj.team.id;
      const memberName = userObj.name;

      // Update studentTeams activeLogins
      setStudentTeams((prev) => {
        const updated = prev.map((t) => {
          if (t.id === teamId || t.teamName.toLowerCase() === userObj.team.teamName.toLowerCase()) {
            const currentActive = t.activeLogins || t.active_logins || [];
            const newActive = Array.from(new Set([...currentActive, memberName]));
            const updatedTeam = { ...t, activeLogins: newActive, active_logins: newActive };
            saveTeamToSupabase(updatedTeam);
            return updatedTeam;
          }
          return t;
        });
        broadcastEvent("STUDENT_TEAMS_SYNC", updated);
        return updated;
      });

      // Update current student team state
      setStudentTeam((prev) => {
        const currentActive = (prev && (prev.activeLogins || prev.active_logins)) || userObj.team.activeLogins || [];
        const newActive = Array.from(new Set([...currentActive, memberName]));
        return {
          ...userObj.team,
          activeLogins: newActive,
          active_logins: newActive
        };
      });

      // Record Attendance & Active Logins on Leaderboard
      const teamObj = userObj.team;
      setLeaderboard((prev) => {
        const existingIdx = prev.findIndex(
          (t) => t.teamId === teamObj.id || t.teamName.toLowerCase() === teamObj.teamName.toLowerCase()
        );

        if (existingIdx !== -1) {
          const updated = [...prev];
          const currentItem = { ...updated[existingIdx] };
          const membersList = currentItem.members || teamObj.members || [userObj.name];
          const memberAtt = { ...(currentItem.memberAttendance || {}) };
          
          memberAtt[userObj.name] = "Present";
          currentItem.memberAttendance = memberAtt;

          const currentActive = currentItem.activeLogins || currentItem.active_logins || [];
          const newActive = Array.from(new Set([...currentActive, memberName]));
          currentItem.activeLogins = newActive;
          currentItem.active_logins = newActive;

          const presentCount = membersList.filter((m) => memberAtt[m] === "Present").length;

          if (presentCount === membersList.length) {
            currentItem.status = "All Members Present ✓";
          } else {
            currentItem.status = `${presentCount}/${membersList.length} Present`;
          }

          currentItem.lastPlayed = `Checked-in (${userObj.name})`;
          updated[existingIdx] = currentItem;
          broadcastEvent("LEADERBOARD_SYNC", updated);
          saveLeaderboardToSupabase(updated);
          return updated;
        } else {
          const membersList = Array.isArray(teamObj.members) && teamObj.members.length > 0 ? teamObj.members : [teamObj.leaderName || userObj.name];
          const memberAtt = {};
          membersList.forEach((m) => {
            memberAtt[m] = m === userObj.name ? "Present" : "Pending";
          });

          const newLeaderboardEntry = {
            sNo: prev.length + 1,
            rank: prev.length + 1,
            teamId: teamObj.id,
            teamName: teamObj.teamName,
            teamCode: teamObj.teamCode,
            leaderName: teamObj.leaderName,
            members: membersList,
            activeLogins: [memberName],
            memberAttendance: memberAtt,
            abbrevScore: 0,
            imageScore: 0,
            bonusScore: 0,
            totalScore: 0,
            timeSeconds: 0,
            lastPlayed: `Checked-in (${userObj.name})`,
            status: `1/${membersList.length} Present`,
            registrationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString()
          };
          const updated = [...prev, newLeaderboardEntry];
          broadcastEvent("LEADERBOARD_SYNC", updated);
          saveLeaderboardToSupabase(updated);
          return updated;
        }
      });
    }
  };

  const handleClearLeaderboard = async () => {
    if (window.confirm("Clear all entries from the Leaderboard & Attendance Sheet?\n\nThis will remove testing teams so only real event teams are recorded.")) {
      setLeaderboard([]);
      localStorage.removeItem("innovex_leaderboard");
      broadcastEvent("LEADERBOARD_SYNC", []);
      await clearLeaderboardInSupabase();
      showToast("Cleared event Leaderboard & Attendance Sheet!");
    }
  };

  const handleLogout = () => {
    if (loggedInUser && loggedInUser.role === "student" && loggedInUser.team) {
      const teamId = loggedInUser.team.id;
      const memberName = loggedInUser.name;

      setStudentTeams((prev) => {
        const updated = prev.map((t) => {
          if (t.id === teamId || t.teamName.toLowerCase() === loggedInUser.team.teamName.toLowerCase()) {
            const currentActive = t.activeLogins || t.active_logins || [];
            const newActive = currentActive.filter((m) => m !== memberName);
            const updatedTeam = { ...t, activeLogins: newActive, active_logins: newActive };
            saveTeamToSupabase(updatedTeam);
            return updatedTeam;
          }
          return t;
        });
        broadcastEvent("STUDENT_TEAMS_SYNC", updated);
        return updated;
      });

      setLeaderboard((prev) => {
        const existingIdx = prev.findIndex(
          (t) => t.teamId === teamId || t.teamName.toLowerCase() === loggedInUser.team.teamName.toLowerCase()
        );
        if (existingIdx !== -1) {
          const updated = [...prev];
          const item = { ...updated[existingIdx] };
          const active = (item.activeLogins || item.active_logins || []).filter((m) => m !== memberName);
          item.activeLogins = active;
          item.active_logins = active;
          updated[existingIdx] = item;
          broadcastEvent("LEADERBOARD_SYNC", updated);
          saveLeaderboardToSupabase(updated);
          return updated;
        }
        return prev;
      });
    }

    setLoggedInUser(null);
    showToast("Logged out successfully.");
  };

  const handleToggleGameLock = async (gameId) => {
    const newLockState = !gameLocks[gameId];
    const updated = { ...gameLocks, [gameId]: newLockState };
    setGameLocks(updated);
    await updateGameLockState(gameId, newLockState);
    broadcastEvent("GAME_LOCKS_SYNC", updated);
    const title = gameTitles[gameId] || gameId;
    showToast(`${title} is now ${newLockState ? "LOCKED BY ADMIN 🔒" : "UNLOCKED BY ADMIN 🟢"}.`);
  };

  const handleToggleGameStart = async (gameId) => {
    const isLockedByAdmin = gameLocks[gameId];
    if (isLockedByAdmin) {
      alert("⚠️ This game track is currently locked by the Event Admin / Director. Admin must unlock the game first before you can start it!");
      return;
    }

    const nextVal = !gameStartedStates[gameId];
    const updated = { ...gameStartedStates, [gameId]: nextVal };
    setGameStartedStates(updated);
    broadcastEvent("GAME_STARTED_SYNC", updated);
    await saveGameConfigToSupabase("game_started", updated);
    const title = gameTitles[gameId] || gameId;
    showToast(`${title} is now ${nextVal ? "STARTED & LIVE FOR PLAYERS 🚀" : "PAUSED BY COORDINATOR ⏸️"}`);
  };

  // ADMIN MASTER OVERRIDE: Break Question Security Lock
  const handleBreakQuestionsLock = async () => {
    setIsQuestionsLocked(false);
    setSecurityPassword("");
    broadcastEvent("QUESTIONS_LOCKED_SYNC", { isQuestionsLocked: false, securityPassword: "" });
    await saveGameConfigToSupabase("questions_locked", { isQuestionsLocked: false, securityPassword: "" });
    showToast("⚡ ADMIN MASTER OVERRIDE: Question Security Lock Broken & Unlocked!");
  };

  // Coordinator Toggles Question Security Lock
  const handleToggleQuestionLockState = async (pass) => {
    if (isQuestionsLocked) {
      if (pass === securityPassword) {
        setIsQuestionsLocked(false);
        setSecurityPassword("");
        broadcastEvent("QUESTIONS_LOCKED_SYNC", { isQuestionsLocked: false, securityPassword: "" });
        await saveGameConfigToSupabase("questions_locked", { isQuestionsLocked: false, securityPassword: "" });
        showToast("Question Security Lock Unlocked!");
      } else {
        alert("Incorrect security password!");
      }
    } else {
      setSecurityPassword(pass);
      setIsQuestionsLocked(true);
      broadcastEvent("QUESTIONS_LOCKED_SYNC", { isQuestionsLocked: true, securityPassword: pass });
      await saveGameConfigToSupabase("questions_locked", { isQuestionsLocked: true, securityPassword: pass });
      showToast("Question Security Lock Activated with Password!");
    }
  };

  const handleSaveGameTitles = async (updatedTitles) => {
    setGameTitles(updatedTitles);
    broadcastEvent("GAME_TITLES_SYNC", updatedTitles);
    await saveGameConfigToSupabase("game_titles", updatedTitles);
    showToast("Official Event Game Titles Updated!");
  };

  const handleCreateCoordinator = async (newCoord) => {
    setCoordinators((prev) => [newCoord, ...prev]);
    await createCoordinatorInSupabase(newCoord);
    showToast(`Created Coordinator: ${newCoord.name} (${newCoord.email})!`);
  };

  const handleDeleteCoordinator = async (coordId) => {
    const coordToDelete = coordinators.find((c) => c.id === coordId);
    if (!coordToDelete) return;

    if (window.confirm(`Revoke login credentials for Coordinator ${coordToDelete.name} (${coordToDelete.email})?\n\nNote: All created questions, options, marks, and security locks will remain 100% UNCHANGED and preserved in the Coordinator Panel.`)) {
      setCoordinators((prev) => prev.filter((c) => c.id !== coordId));
      await deleteCoordinatorFromSupabase(coordId);
      showToast(`Revoked credentials for ${coordToDelete.name}. Created questions & locks remain preserved!`);
    }
  };

  const handleCreateStudentTeam = async (newTeamObj) => {
    setStudentTeams((prev) => {
      const updated = [newTeamObj, ...prev];
      broadcastEvent("STUDENT_TEAMS_SYNC", updated);
      return updated;
    });

    await saveTeamToSupabase(newTeamObj);

    // Initialize team in leaderboard if not present
    setLeaderboard((prev) => {
      const exists = prev.some((t) => t.teamName.toLowerCase() === newTeamObj.teamName.toLowerCase());
      if (exists) return prev;

      const newLeaderboardEntry = {
        sNo: prev.length + 1,
        rank: prev.length + 1,
        teamId: newTeamObj.id,
        teamName: newTeamObj.teamName,
        teamCode: newTeamObj.teamCode,
        leaderName: newTeamObj.leaderName,
        members: newTeamObj.members,
        abbrevScore: 0,
        imageScore: 0,
        bonusScore: 0,
        totalScore: 0,
        timeSeconds: 0,
        lastPlayed: "Not Started",
        status: "Present",
        registrationTime: newTeamObj.createdTime
      };

      const updatedLb = [...prev, newLeaderboardEntry];
      broadcastEvent("LEADERBOARD_SYNC", updatedLb);
      saveLeaderboardToSupabase(updatedLb);
      return updatedLb;
    });

    triggerConfetti();
    showToast(`Generated Student Team "${newTeamObj.teamName}" (Code: ${newTeamObj.teamCode})!`);
  };

  const handleDeleteStudentTeam = async (teamId) => {
    const teamToDelete = studentTeams.find((t) => t.id === teamId);
    if (!teamToDelete) return;

    if (window.confirm(`Revoke credentials for Student Team "${teamToDelete.teamName}" (Code: ${teamToDelete.teamCode})?\n\nStudents will no longer be able to log in using this team passcode.`)) {
      setStudentTeams((prev) => {
        const updated = prev.filter((c) => c.id !== teamId);
        broadcastEvent("STUDENT_TEAMS_SYNC", updated);
        return updated;
      });
      await deleteTeamFromSupabase(teamId);
      showToast(`Revoked & Deleted Student Team credentials for "${teamToDelete.teamName}"!`);
    }
  };

  const handleBlockTeam = async (teamId) => {
    const targetTeam = studentTeams.find((t) => t.id === teamId);
    if (targetTeam) {
      const updatedTeam = { ...targetTeam, isBlocked: true };
      await saveTeamToSupabase(updatedTeam);
    }

    setStudentTeams((prev) => {
      const updated = prev.map((t) => (t.id === teamId ? { ...t, isBlocked: true } : t));
      broadcastEvent("STUDENT_TEAMS_SYNC", updated);
      return updated;
    });
    if (studentTeam && studentTeam.id === teamId) {
      setStudentTeam((prev) => (prev ? { ...prev, isBlocked: true } : null));
    }
  };

  const handleSaveGameResume = async (resumeRecord) => {
    setGameResumes((prev) => {
      const idx = prev.findIndex((r) => r.teamId === resumeRecord.teamId);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = resumeRecord;
      } else {
        updated = [resumeRecord, ...prev];
      }
      broadcastEvent("GAME_RESUMES_SYNC", updated);
      return updated;
    });
    await saveGameResumeToSupabase(resumeRecord);
    showToast(`🚨 Mid-game exit recorded for Team "${resumeRecord.teamName}". Coordinator notified!`);
  };

  const handleApproveResume = async (teamId) => {
    const targetResume = gameResumes.find((r) => r.teamId === teamId);
    const targetName = targetResume ? targetResume.teamName : "Student Team";

    setGameResumes((prev) => {
      const updated = prev.map((r) =>
        r.teamId === teamId ? { ...r, status: "approved" } : r
      );
      broadcastEvent("GAME_RESUMES_SYNC", updated);
      return updated;
    });

    await updateGameResumeStatusInSupabase(teamId, "approved");
    showToast(`▶️ Approved Mid-Game Quiz Resume for Team "${targetName}"!`);
  };

  const handleDisallowResume = async (teamId) => {
    const targetResume = gameResumes.find((r) => r.teamId === teamId);
    const targetName = targetResume ? targetResume.teamName : "Student Team";

    setGameResumes((prev) => {
      const updated = prev.map((r) =>
        r.teamId === teamId ? { ...r, status: "disallowed" } : r
      );
      broadcastEvent("GAME_RESUMES_SYNC", updated);
      return updated;
    });

    await handleBlockTeam(teamId);
    await updateGameResumeStatusInSupabase(teamId, "disallowed");
    showToast(`🚫 Disallowed resume & blocked Team "${targetName}" from playing.`);
  };

  const handleUnblockTeam = async (teamId, reason = "cheated") => {
    const targetTeam = studentTeams.find((t) => t.id === teamId);
    const targetName = targetTeam ? targetTeam.teamName : "";
    const penaltyPoints = reason === "cheated" ? 50 : 0;

    if (targetTeam) {
      const updatedTeam = {
        ...targetTeam,
        isBlocked: false,
        penalty: (targetTeam.penalty || 0) + penaltyPoints,
        unblockReason: reason
      };
      await saveTeamToSupabase(updatedTeam);
    }

    setStudentTeams((prev) => {
      const updated = prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              isBlocked: false,
              penalty: (t.penalty || 0) + penaltyPoints,
              unblockReason: reason
            }
          : t
      );
      broadcastEvent("STUDENT_TEAMS_SYNC", updated);
      return updated;
    });

    if (studentTeam && studentTeam.id === teamId) {
      setStudentTeam((prev) =>
        prev
          ? {
              ...prev,
              isBlocked: false,
              penalty: (prev.penalty || 0) + penaltyPoints,
              unblockReason: reason
            }
          : null
      );
    }

    // Clear session storage tab switch counters so student team can login & play again
    sessionStorage.removeItem(`tab_switches_${teamId}`);
    sessionStorage.removeItem("tab_switches_student");

    // Deduct penalty points from leaderboard score if reason is cheated
    setLeaderboard((prev) => {
      const updatedLb = prev
        .map((item) => {
          if (item.teamId === teamId || (targetName && item.teamName.toLowerCase() === targetName.toLowerCase())) {
            const newPenalty = (item.penalty || 0) + penaltyPoints;
            const newTotal = (item.abbrevScore || 0) + (item.imageScore || 0) + (item.bonusScore || 0) - newPenalty;
            return {
              ...item,
              penalty: newPenalty,
              totalScore: newTotal
            };
          }
          return item;
        })
        .sort((a, b) => b.totalScore - a.totalScore);
      broadcastEvent("LEADERBOARD_SYNC", updatedLb);
      saveLeaderboardToSupabase(updatedLb);
      return updatedLb;
    });

    if (reason === "cheated") {
      showToast(`🔓 Restored access for "${targetName || "Student Team"}" with a 50-point anti-cheat penalty deducted (Reason: Cheated)!`);
    } else {
      showToast(`🔓 Restored access for "${targetName || "Student Team"}" with 0 penalty applied (Reason: Technical/Other)!`);
    }
  };

  const handleSaveTeam = async (teamObj) => {
    setStudentTeam(teamObj);
    await saveTeamToSupabase(teamObj);
    showToast(`Team ${teamObj.teamName} (${teamObj.teamCode}) active!`);
  };

  // Coordinator Question / Image Handlers
  const handleSaveQuizQuestion = async (qObj) => {
    setQuizQuestions((prev) => {
      const idx = prev.findIndex((item) => item.id === qObj.id);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = qObj;
      } else {
        updated = [...prev, qObj];
      }
      broadcastEvent("QUIZ_QUESTIONS_SYNC", updated);
      return updated;
    });
    await saveQuizQuestionToSupabase(qObj);
    showToast("Quiz Question & Marks saved to database!");
  };

  const handleDeleteQuizQuestion = async (qId) => {
    setQuizQuestions((prev) => {
      const updated = prev.filter((item) => item.id !== qId);
      broadcastEvent("QUIZ_QUESTIONS_SYNC", updated);
      return updated;
    });
    await deleteQuizQuestionFromSupabase(qId);
    showToast("Quiz Question removed from database!");
  };

  const handleSaveImageChallenge = async (imgObj) => {
    setRealFakeImages((prev) => {
      const idx = prev.findIndex((item) => item.id === imgObj.id);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = imgObj;
      } else {
        updated = [...prev, imgObj];
      }
      broadcastEvent("REAL_FAKE_IMAGES_SYNC", updated);
      return updated;
    });
    await saveFactQuestionToSupabase(imgObj);
    showToast("Fact Finder Question saved to database!");
  };

  const handleDeleteImageChallenge = async (imgId) => {
    setRealFakeImages((prev) => {
      const updated = prev.filter((item) => item.id !== imgId);
      broadcastEvent("REAL_FAKE_IMAGES_SYNC", updated);
      return updated;
    });
    await deleteFactQuestionFromSupabase(imgId);
    showToast("Fact Finder Question removed from database!");
  };

  const handleScoreSubmitted = async ({ teamId, gameId, score, timeSeconds }) => {
    triggerConfetti();
    let updatedLeaderboardList = [];
    setLeaderboard((prev) => {
      const existingIdx = prev.findIndex((t) => t.teamId === teamId);
      let updated;
      if (existingIdx !== -1) {
        updated = [...prev];
        const teamItem = { ...updated[existingIdx] };
        if (gameId === "abbrev_quiz") {
          teamItem.abbrevScore = score;
          teamItem.abbrevCompleted = true;
        }
        if (gameId === "real_fake_img") {
          teamItem.imageScore = score;
          teamItem.imageCompleted = true;
        }

        // Finalize per-member attendance upon game completion
        const membersList = teamItem.members || [];
        const memberAtt = { ...(teamItem.memberAttendance || {}) };

        // Mark logged-in member who finished the game as Present
        if (loggedInUser?.name) {
          memberAtt[loggedInUser.name] = "Present";
        }

        // Any member who has not logged in / participated is marked as Absent upon game completion
        membersList.forEach((m) => {
          if (!memberAtt[m] || memberAtt[m] === "Pending") {
            memberAtt[m] = "Absent";
          }
        });

        teamItem.memberAttendance = memberAtt;

        const presentCount = membersList.filter((m) => memberAtt[m] === "Present").length;
        const absentCount = membersList.length - presentCount;

        if (presentCount === membersList.length) {
          teamItem.status = `All ${membersList.length} Members Present ✓`;
        } else if (presentCount > 0) {
          teamItem.status = `${presentCount}/${membersList.length} Present (${absentCount} Absent ❌)`;
        } else {
          teamItem.status = "Absent ❌";
        }

        const penalty = teamItem.penalty || 0;
        teamItem.totalScore = (teamItem.abbrevScore || 0) + (teamItem.imageScore || 0) + (teamItem.bonusScore || 0) - penalty;
        updated[existingIdx] = teamItem;
        updated.sort((a, b) => b.totalScore - a.totalScore);
      } else {
        const membersList = studentTeam?.members || [loggedInUser?.name || "Member"];
        const memberAtt = {};
        membersList.forEach((m) => {
          memberAtt[m] = m === loggedInUser?.name ? "Present" : "Absent";
        });
        const presentCount = membersList.filter((m) => memberAtt[m] === "Present").length;
        const absentCount = membersList.length - presentCount;

        const newTeamEntry = {
          sNo: prev.length + 1,
          rank: prev.length + 1,
          teamId,
          teamName: studentTeam?.teamName || "Real Student Team",
          teamCode: studentTeam?.teamCode || "ST-9000",
          leaderName: studentTeam?.leaderName || loggedInUser?.name || "Team Leader",
          members: membersList,
          memberAttendance: memberAtt,
          abbrevScore: gameId === "abbrev_quiz" ? score : 0,
          imageScore: gameId === "real_fake_img" ? score : 0,
          abbrevCompleted: gameId === "abbrev_quiz",
          imageCompleted: gameId === "real_fake_img",
          totalScore: score,
          timeSeconds: timeSeconds || 0,
          lastPlayed: "Just now",
          status: presentCount === membersList.length ? `All ${membersList.length} Members Present ✓` : `${presentCount}/${membersList.length} Present (${absentCount} Absent ❌)`,
          registrationTime: "Just now"
        };
        updated = [...prev, newTeamEntry];
        updated.sort((a, b) => b.totalScore - a.totalScore);
      }
      updatedLeaderboardList = updated;
      broadcastEvent("LEADERBOARD_SYNC", updated);
      return updated;
    });

    // Clear any active mid-game resume records since game is now officially finished
    setGameResumes((prev) => {
      const updated = prev.filter((r) => !(r.teamId === teamId && r.gameId === gameId));
      broadcastEvent("GAME_RESUMES_SYNC", updated);
      return updated;
    });
    await deleteGameResumeInSupabase(teamId, gameId);

    await submitScoreToSupabase({ team_id: teamId, game_id: gameId, score, time_seconds: timeSeconds });
    if (updatedLeaderboardList.length > 0) {
      await saveLeaderboardToSupabase(updatedLeaderboardList);
    }
    showToast("Game score submitted & automatically saved to live Leaderboard!");
  };

  const handleImportExcelPoints = async (importedList) => {
    triggerConfetti();
    let updatedLeaderboardList = [];
    setLeaderboard((prev) => {
      const updated = [...prev];

      importedList.forEach(({ teamName, points, mode }) => {
        if (!teamName) return;
        const normalizedName = teamName.trim().toLowerCase();
        const existingIdx = updated.findIndex(
          (t) => t.teamName?.trim().toLowerCase() === normalizedName
        );

        const pts = Number(points) || 0;

        if (existingIdx !== -1) {
          const teamItem = { ...updated[existingIdx] };
          if (mode === "set") {
            teamItem.totalScore = pts;
          } else {
            teamItem.bonusScore = (teamItem.bonusScore || 0) + pts;
            teamItem.totalScore = (teamItem.abbrevScore || 0) + (teamItem.imageScore || 0) + teamItem.bonusScore;
          }
          updated[existingIdx] = teamItem;
        } else {
          // Create new team from excel import if non-existent
          const newTeamEntry = {
            sNo: updated.length + 1,
            rank: updated.length + 1,
            teamId: `EXCEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            teamName: teamName.trim(),
            teamCode: `TM-${Math.floor(1000 + Math.random() * 9000)}`,
            leaderName: "Excel Imported Leader",
            members: ["Imported Member"],
            abbrevScore: 0,
            imageScore: 0,
            bonusScore: pts,
            totalScore: pts,
            timeSeconds: 0,
            lastPlayed: "Excel Points Added",
            status: "Present",
            registrationTime: "Just now"
          };
          updated.push(newTeamEntry);
        }
      });

      updated.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      updatedLeaderboardList = updated;
      broadcastEvent("LEADERBOARD_SYNC", updated);
      return updated;
    });

    if (updatedLeaderboardList.length > 0) {
      await saveLeaderboardToSupabase(updatedLeaderboardList);
    }
    showToast(`Updated team points from Excel file matching & synced to database!`);
  };

  return (
    <div className="app-container">
      {/* Dynamic Ambient Background Blobs & Grid */}
      <div className="bg-ambient">
        <div className="blob-1" />
        <div className="blob-2" />
        <div className="bg-grid-overlay" />
      </div>

      {/* Top Navigation Bar */}
      <header className="top-navbar">
        <div className="brand-logo" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="logo-icon" style={{ position: "relative", width: "42px", height: "42px", borderRadius: "50%", background: "radial-gradient(circle, #00f0ff 0%, #0284c7 100%)", boxShadow: "0 0 18px rgba(0, 240, 255, 0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={22} color="#ffffff" style={{ animation: "rotateArc 10s linear infinite" }} />
          </div>
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "0.05em", color: "#ffffff" }}>
            INNOVEXA-JARVIS <span style={{ color: "#00f0ff", textShadow: "0 0 10px rgba(0,240,255,0.7)" }}>EVENT</span>
          </span>
        </div>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "0.35rem 0.75rem", borderRadius: "20px", fontSize: "0.76rem", fontWeight: 700, color: "#34d399" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <span>120-User Live Sync Active</span>
          </div>

          {loggedInUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-dark-secondary)" }}>Signed in as:</span>
              <span style={{ fontWeight: 700, color: "var(--role-primary)" }}>{loggedInUser.name}</span>
            </div>
          ) : (
            <ThemeToggle
              theme={theme}
              onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          )}
        </div>
      </header>

      {/* Main Views */}
      {loggedInUser ? (
        <main style={{ flex: 1 }}>
          {loggedInUser.role === "admin" && (
            <AdminDashboard
              user={loggedInUser}
              onLogout={handleLogout}
              gameLocks={gameLocks}
              onToggleGameLock={handleToggleGameLock}
              isQuestionsLocked={isQuestionsLocked}
              onBreakQuestionsLock={handleBreakQuestionsLock}
              gameTitles={gameTitles}
              onSaveGameTitles={handleSaveGameTitles}
              coordinators={coordinators}
              onCreateCoordinator={handleCreateCoordinator}
              onDeleteCoordinator={handleDeleteCoordinator}
              studentTeams={studentTeams}
              onCreateStudentTeam={handleCreateStudentTeam}
              onDeleteStudentTeam={handleDeleteStudentTeam}
              leaderboardData={leaderboard}
              onImportPoints={handleImportExcelPoints}
              onClearLeaderboard={handleClearLeaderboard}
            />
          )}

          {loggedInUser.role === "coordinator" && (
            <CoordinatorDashboard
              user={loggedInUser}
              onLogout={handleLogout}
              leaderboardData={leaderboard}
              gameLocks={gameLocks}
              gameStartedStates={gameStartedStates}
              onToggleGameStart={handleToggleGameStart}
              gameTitles={gameTitles}
              isQuestionsLocked={isQuestionsLocked}
              onToggleQuestionLockState={handleToggleQuestionLockState}
              quizQuestions={quizQuestions}
              onSaveQuizQuestion={handleSaveQuizQuestion}
              onDeleteQuizQuestion={handleDeleteQuizQuestion}
              realFakeImages={realFakeImages}
              onSaveImageChallenge={handleSaveImageChallenge}
              onDeleteImageChallenge={handleDeleteImageChallenge}
              studentTeamsList={studentTeams}
              onUnblockTeam={handleUnblockTeam}
              gameResumes={gameResumes}
              onApproveResume={handleApproveResume}
              onDisallowResume={handleDisallowResume}
            />
          )}

          {loggedInUser.role === "student" && (
            <StudentDashboard
              user={loggedInUser}
              onLogout={handleLogout}
              gameLocks={gameLocks}
              gameStartedStates={gameStartedStates}
              gameTitles={gameTitles}
              activeTeam={studentTeam}
              onOpenTeamModal={() => setIsTeamModalOpen(true)}
              leaderboardData={leaderboard}
              quizQuestions={quizQuestions}
              realFakeImages={realFakeImages}
              onScoreSubmitted={handleScoreSubmitted}
              onBlockTeam={handleBlockTeam}
              gameResumes={gameResumes}
              onSaveGameResume={handleSaveGameResume}
            />
          )}
        </main>
      ) : (
        <main className="auth-wrapper">
          <div className="auth-container">
            {/* 3-Role Access Tab Switcher */}
            <RoleSelector
              activeRole={activeRole}
              onSelectRole={(role) => setActiveRole(role)}
            />

            {/* Interactive Login Card */}
            <LoginForm
              activeRole={activeRole}
              coordinatorsList={coordinators}
              studentTeamsList={studentTeams}
              onLoginSuccess={handleLoginSuccess}
              onOpenOtpModal={(user) => {
                setPendingOtpUser(user);
                setIsOtpModalOpen(true);
              }}
              onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            />
          </div>
        </main>
      )}

      {/* Modals */}
      <OtpModal
        isOpen={isOtpModalOpen}
        user={pendingOtpUser}
        onClose={() => setIsOtpModalOpen(false)}
        onVerifySuccess={(userObj) => {
          setIsOtpModalOpen(false);
          setPendingOtpUser(null);
          handleLoginSuccess(userObj);
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        activeRole={activeRole}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        user={loggedInUser || { name: "Student Player" }}
        onClose={() => setIsTeamModalOpen(false)}
        onSaveTeam={handleSaveTeam}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="toast-notice">
          <Sparkles size={18} color="#818cf8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
