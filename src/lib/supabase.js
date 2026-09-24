import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_COORDINATORS,
  INITIAL_STUDENT_TEAMS,
  ABBREVIATION_QUESTIONS,
  FACT_FINDER_QUESTIONS,
  INITIAL_LEADERBOARD
} from "../data/mockUsers";

// Production Supabase central project configuration
const DEFAULT_SUPABASE_URL = "https://rlixjwtndpxvrnxbnjfg.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXhqd3RuZHB4dnJueGJuamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDU5ODksImV4cCI6MjEwNTU4MTk4OX0.GYm495IMh1gseuz16YViGEjQpw_d0RSfGuxblSy5WBE";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check if live Supabase environment variables are connected.
 */
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("xyz-mock-project")
  );
};

/* -------------------------------------------------------------------------- */
/*                        SUPABASE DATABASE HELPER METHODS                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetch Game Lock States from Supabase or fallback memory
 */
export async function fetchGameLocks() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("game_locks").select("*");
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetchGameLocks fallback:", e);
    }
  }
  return null;
}

/**
 * Update Game Lock State in Supabase
 */
export async function updateGameLockState(gameId, isLocked) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_locks")
        .upsert({ game_id: gameId, is_locked: isLocked, updated_at: new Date() });
      if (error) console.error("Supabase updateGameLockState error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase updateGameLockState fallback:", e);
    }
  }
  return { game_id: gameId, is_locked: isLocked };
}

/**
 * Register a new Coordinator in Supabase
 */
export async function createCoordinatorInSupabase(coordData) {
  if (isSupabaseConfigured()) {
    try {
      const rowToInsert = {
        id: coordData.id,
        name: coordData.name,
        email: coordData.email,
        password: coordData.password,
        department: coordData.department || '',
        assigned_games: coordData.assignedGames || coordData.assigned_games || ["abbrev_quiz", "real_fake_img"],
        assigned_game_title: coordData.assignedGameTitle || coordData.assigned_game_title || "All Event Games",
        role: "coordinator"
      };

      const { data, error } = await supabase
        .from("coordinators")
        .upsert([rowToInsert]);

      if (error) console.error("Supabase createCoordinator error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase createCoordinator fallback:", e);
    }
  }
  return coordData;
}

/**
 * Authenticate Coordinator against Supabase central database
 */
export async function authenticateCoordinatorInSupabase(loginId, password) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("coordinators")
        .select("*");

      if (!error && data) {
        const cleanLoginId = loginId.trim().toLowerCase();
        const cleanPassword = password.trim();

        const matched = data.find((row) => {
          const matchEmail = row.email && row.email.trim().toLowerCase() === cleanLoginId;
          const matchId = row.id && row.id.trim().toLowerCase() === cleanLoginId;
          const matchPass = row.password && row.password.trim() === cleanPassword;
          return (matchEmail || matchId) && matchPass;
        });

        if (matched) {
          return {
            id: matched.id,
            role: "coordinator",
            roleTitle: "Event Coordinator",
            name: matched.name,
            email: matched.email,
            password: matched.password,
            department: matched.department,
            assignedGames: matched.assigned_games || matched.assignedGames || ["abbrev_quiz", "real_fake_img"],
            assignedGameTitle: matched.assigned_game_title || matched.assignedGameTitle || "All Event Games",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(matched.name)}`
          };
        }
      }
    } catch (e) {
      console.warn("Supabase authenticateCoordinator error:", e);
    }
  }
  return null;
}

/**
 * Submit Game Score to Supabase
 */
export async function submitScoreToSupabase(scoreRecord) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_scores")
        .insert([scoreRecord]);
      if (error) console.error("Supabase submitScore error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase submitScore fallback:", e);
    }
  }
  return scoreRecord;
}

/**
 * BroadcastChannel API for high-speed local multi-tab/multi-window synchronization
 */
export const syncBroadcastChannel = typeof window !== "undefined" && window.BroadcastChannel 
  ? new BroadcastChannel("innovex_event_sync_channel")
  : null;

/**
 * Broadcast an event to all connected clients (via Supabase Realtime Channel or BroadcastChannel)
 */
export function broadcastEvent(eventType, payload) {
  // 1. Broadcast locally across tabs/windows
  if (syncBroadcastChannel) {
    try {
      syncBroadcastChannel.postMessage({ type: eventType, payload });
    } catch (e) {
      // ignore channel errors
    }
  }

  // 2. Broadcast via Supabase Realtime if configured
  if (isSupabaseConfigured()) {
    try {
      const channel = supabase.channel("innovex_live_room");
      channel.send({
        type: "broadcast",
        event: eventType,
        payload
      });
    } catch (e) {
      console.warn("Supabase broadcast error:", e);
    }
  }
}

/**
 * Create or Join Team in Supabase
 */
export async function saveTeamToSupabase(teamRecord) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("teams")
        .upsert([{
          id: teamRecord.id,
          team_name: teamRecord.teamName,
          team_code: teamRecord.teamCode,
          leader_name: teamRecord.leaderName,
          members: teamRecord.members || [],
          active_logins: teamRecord.activeLogins || teamRecord.active_logins || [],
          created_time: teamRecord.createdTime || new Date().toISOString(),
          status: teamRecord.status || 'Active',
          is_blocked: teamRecord.isBlocked || false,
          penalty: teamRecord.penalty || 0
        }]);
      if (error) console.error("Supabase saveTeam error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveTeam fallback:", e);
    }
  }
  return teamRecord;
}

/**
 * Fetch initial database state from Supabase on App load
 */
export async function fetchInitialSupabaseState() {
  if (!isSupabaseConfigured()) return null;

  try {
    const [
      gameLocksRes,
      coordinatorsRes,
      teamsRes,
      quizQuestionsRes,
      factQuestionsRes,
      leaderboardRes
    ] = await Promise.all([
      supabase.from("game_locks").select("*"),
      supabase.from("coordinators").select("*"),
      supabase.from("teams").select("*"),
      supabase.from("quiz_questions").select("*"),
      supabase.from("fact_finder_questions").select("*"),
      supabase.from("leaderboard").select("*")
    ]);

    const state = {};

    // Auto-seed Coordinators if empty in Supabase
    let coordList = coordinatorsRes.data || [];
    if (coordList.length === 0 && INITIAL_COORDINATORS.length > 0) {
      await supabase.from("coordinators").upsert(INITIAL_COORDINATORS);
      coordList = INITIAL_COORDINATORS;
    }
    state.coordinators = coordList.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      department: row.department,
      assignedGames: row.assigned_games || row.assignedGames || ["abbrev_quiz", "real_fake_img"],
      assignedGameTitle: row.assigned_game_title || row.assignedGameTitle || "All Event Games",
      createdTime: row.created_at || row.createdTime || "Just now"
    }));

    // Auto-seed Teams if empty in Supabase
    let teamsList = teamsRes.data || [];
    if (teamsList.length === 0 && INITIAL_STUDENT_TEAMS.length > 0) {
      const rowsToInsert = INITIAL_STUDENT_TEAMS.map((t) => ({
        id: t.id,
        team_name: t.teamName,
        team_code: t.teamCode,
        leader_name: t.leaderName,
        members: t.members,
        active_logins: t.activeLogins || [],
        created_time: t.createdTime || new Date().toISOString(),
        status: t.status || 'Active',
        is_blocked: t.isBlocked || false,
        penalty: t.penalty || 0
      }));
      await supabase.from("teams").upsert(rowsToInsert);
      teamsList = rowsToInsert;
    }
    state.studentTeams = teamsList.map((row) => ({
      id: row.id,
      teamName: row.team_name || row.teamName,
      teamCode: row.team_code || row.teamCode,
      leaderName: row.leader_name || row.leaderName,
      members: row.members || [],
      activeLogins: row.active_logins || row.activeLogins || [],
      createdTime: row.created_time || row.createdTime,
      status: row.status,
      isBlocked: row.is_blocked || row.isBlocked || false,
      penalty: row.penalty || 0
    }));

    // Auto-seed Quiz Questions if empty in Supabase
    let quizList = quizQuestionsRes.data || [];
    if (quizList.length === 0 && ABBREVIATION_QUESTIONS.length > 0) {
      const rowsToInsert = ABBREVIATION_QUESTIONS.map((q) => ({
        id: String(q.id),
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
        marks: q.marks || 10
      }));
      await supabase.from("quiz_questions").upsert(rowsToInsert);
      quizList = rowsToInsert;
    }
    state.quizQuestions = quizList.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      marks: q.marks
    }));

    // Auto-seed Fact Questions if empty in Supabase
    let factList = factQuestionsRes.data || [];
    if (factList.length === 0 && FACT_FINDER_QUESTIONS.length > 0) {
      const rowsToInsert = FACT_FINDER_QUESTIONS.map((f) => ({
        id: String(f.id),
        question: f.question,
        real_fact: f.realFact,
        fake_fact1: f.fakeFact1,
        fake_fact2: f.fakeFact2,
        explanation: f.explanation,
        marks: f.marks || 10,
        category: f.category || 'General'
      }));
      await supabase.from("fact_finder_questions").upsert(rowsToInsert);
      factList = rowsToInsert;
    }
    state.factQuestions = factList.map((row) => ({
      id: row.id,
      question: row.question,
      realFact: row.real_fact || row.realFact,
      fakeFact1: row.fake_fact1 || row.fakeFact1,
      fakeFact2: row.fake_fact2 || row.fakeFact2,
      explanation: row.explanation,
      marks: row.marks,
      category: row.category
    }));

    // Auto-seed Leaderboard if empty in Supabase
    let lbList = leaderboardRes.data || [];
    if (lbList.length === 0 && INITIAL_LEADERBOARD.length > 0) {
      const rowsToInsert = INITIAL_LEADERBOARD.map((t) => ({
        team_id: t.teamId,
        team_name: t.teamName,
        team_code: t.teamCode,
        leader_name: t.leaderName,
        members: t.members,
        active_logins: t.activeLogins || [],
        abbrev_score: t.abbrevScore || 0,
        image_score: t.imageScore || 0,
        abbrev_completed: t.abbrevCompleted || false,
        image_completed: t.imageCompleted || false,
        bonus_score: t.bonusScore || 0,
        penalty: t.penalty || 0,
        total_score: t.totalScore || 0,
        time_seconds: t.timeSeconds || 0,
        last_played: t.lastPlayed || 'Just now',
        status: t.status || 'Present',
        member_attendance: t.memberAttendance || {},
        registration_time: t.registrationTime || 'Just now',
        updated_at: new Date().toISOString()
      }));
      await supabase.from("leaderboard").upsert(rowsToInsert);
      lbList = rowsToInsert;
    }
    state.leaderboard = lbList.map((row, idx) => ({
      sNo: idx + 1,
      rank: idx + 1,
      teamId: row.team_id || row.teamId,
      teamName: row.team_name || row.teamName,
      teamCode: row.team_code || row.teamCode,
      leaderName: row.leader_name || row.leaderName,
      members: row.members || [],
      activeLogins: row.active_logins || row.activeLogins || [],
      abbrevScore: row.abbrev_score !== undefined ? row.abbrev_score : row.abbrevScore || 0,
      imageScore: row.image_score !== undefined ? row.image_score : row.imageScore || 0,
      abbrevCompleted: row.abbrev_completed !== undefined ? row.abbrev_completed : row.abbrevCompleted || false,
      imageCompleted: row.image_completed !== undefined ? row.image_completed : row.imageCompleted || false,
      bonusScore: row.bonus_score !== undefined ? row.bonus_score : row.bonusScore || 0,
      penalty: row.penalty !== undefined ? row.penalty : row.penalty || 0,
      totalScore: row.total_score !== undefined ? row.total_score : row.totalScore || 0,
      timeSeconds: row.time_seconds !== undefined ? row.time_seconds : row.timeSeconds || 0,
      lastPlayed: row.last_played || row.lastPlayed || 'Just now',
      status: row.status || 'Present',
      memberAttendance: row.member_attendance || row.memberAttendance || {},
      registrationTime: row.registration_time || row.registrationTime || 'Just now'
    }));

    if (gameLocksRes.data && gameLocksRes.data.length > 0) {
      const locksMap = {};
      gameLocksRes.data.forEach((row) => {
        locksMap[row.game_id] = row.is_locked;
      });
      state.gameLocks = locksMap;
    }

    return state;
  } catch (e) {
    console.warn("Error fetching initial Supabase state:", e);
    return null;
  }
}

/**
 * Save / Update Mid-Game Resume Request in Supabase
 */
export async function saveGameResumeToSupabase(resumeRecord) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_resumes")
        .upsert([{
          team_id: resumeRecord.teamId,
          team_name: resumeRecord.teamName,
          game_id: resumeRecord.gameId,
          game_title: resumeRecord.gameTitle,
          current_index: resumeRecord.currentIndex || 0,
          score: resumeRecord.score || 0,
          saved_state: resumeRecord.savedState || {},
          status: resumeRecord.status || 'pending_resume',
          updated_at: new Date().toISOString()
        }]);
      if (error) console.error("Supabase saveGameResume error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveGameResume fallback:", e);
    }
  }
  return resumeRecord;
}

/**
 * Fetch All Mid-Game Resume Requests from Supabase
 */
export async function fetchGameResumesFromSupabase() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_resumes")
        .select("*");
      if (!error && data) {
        return data.map((row) => ({
          teamId: row.team_id,
          teamName: row.team_name,
          gameId: row.game_id,
          gameTitle: row.game_title,
          currentIndex: row.current_index,
          score: row.score,
          savedState: row.saved_state,
          status: row.status,
          updatedAt: row.updated_at
        }));
      }
    } catch (e) {
      console.warn("Supabase fetchGameResumes fallback:", e);
    }
  }
  return [];
}

/**
 * Update Mid-Game Resume Request Status in Supabase
 */
export async function updateGameResumeStatusInSupabase(teamId, status) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_resumes")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("team_id", teamId);
      if (error) console.error("Supabase updateGameResumeStatus error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase updateGameResumeStatus fallback:", e);
    }
  }
  return { teamId, status };
}

/**
 * Save Global Game Config (Started States, Titles, Question Locks) in Supabase
 */
export async function saveGameConfigToSupabase(key, value) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_config")
        .upsert([{ key, value, updated_at: new Date().toISOString() }]);
      if (error) console.error("Supabase saveGameConfig error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveGameConfig fallback:", e);
    }
  }
  return { key, value };
}

/**
 * Delete Coordinator from Supabase
 */
export async function deleteCoordinatorFromSupabase(coordId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("coordinators")
        .delete()
        .or(`id.eq.${coordId},email.eq.${coordId}`);
      if (error) console.error("Supabase deleteCoordinator error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase deleteCoordinator fallback:", e);
    }
  }
}

/**
 * Delete Team from Supabase
 */
export async function deleteTeamFromSupabase(teamId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);
      if (error) console.error("Supabase deleteTeam error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase deleteTeam fallback:", e);
    }
  }
}

/**
 * Save Quiz Question to Supabase
 */
export async function saveQuizQuestionToSupabase(qObj) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .upsert([{
          id: qObj.id,
          question: qObj.question,
          options: qObj.options,
          correct: qObj.correct,
          explanation: qObj.explanation,
          marks: qObj.marks || 10
        }]);
      if (error) console.error("Supabase saveQuizQuestion error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveQuizQuestion fallback:", e);
    }
  }
}

/**
 * Delete Quiz Question from Supabase
 */
export async function deleteQuizQuestionFromSupabase(qId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("id", qId);
      if (error) console.error("Supabase deleteQuizQuestion error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase deleteQuizQuestion fallback:", e);
    }
  }
}

/**
 * Save Fact Finder Question to Supabase
 */
export async function saveFactQuestionToSupabase(factObj) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("fact_finder_questions")
        .upsert([{
          id: factObj.id,
          question: factObj.question,
          real_fact: factObj.realFact,
          fake_fact1: factObj.fakeFact1,
          fake_fact2: factObj.fakeFact2,
          explanation: factObj.explanation,
          marks: factObj.marks || 10,
          category: factObj.category || 'General'
        }]);
      if (error) console.error("Supabase saveFactQuestion error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveFactQuestion fallback:", e);
    }
  }
}

/**
 * Delete Fact Finder Question from Supabase
 */
export async function deleteFactQuestionFromSupabase(factId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("fact_finder_questions")
        .delete()
        .eq("id", factId);
      if (error) console.error("Supabase deleteFactQuestion error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase deleteFactQuestion fallback:", e);
    }
  }
}

/**
 * Save Leaderboard Entries to Supabase
 */
export async function saveLeaderboardToSupabase(leaderboardList) {
  if (isSupabaseConfigured()) {
    try {
      const rows = leaderboardList.map((t) => ({
        team_id: t.teamId,
        team_name: t.teamName,
        team_code: t.teamCode,
        leader_name: t.leaderName,
        members: t.members,
        active_logins: t.activeLogins || t.active_logins || [],
        abbrev_score: t.abbrevScore || 0,
        image_score: t.imageScore || 0,
        abbrev_completed: t.abbrevCompleted || false,
        image_completed: t.imageCompleted || false,
        bonus_score: t.bonusScore || 0,
        penalty: t.penalty || 0,
        total_score: t.totalScore || 0,
        time_seconds: t.timeSeconds || 0,
        last_played: t.lastPlayed || 'Just now',
        status: t.status || 'Present',
        member_attendance: t.memberAttendance || {},
        registration_time: t.registrationTime || 'Just now',
        updated_at: new Date().toISOString()
      }));
      const { data, error } = await supabase
        .from("leaderboard")
        .upsert(rows);
      if (error) console.error("Supabase saveLeaderboard error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase saveLeaderboard fallback:", e);
    }
  }
}

/**
 * Delete Mid-Game Resume Record from Supabase
 */
export async function deleteGameResumeInSupabase(teamId, gameId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("game_resumes")
        .delete()
        .eq("team_id", teamId)
        .eq("game_id", gameId);
      if (error) console.error("Supabase deleteGameResume error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase deleteGameResume fallback:", e);
    }
  }
}

/**
 * Clear Leaderboard Table in Supabase
 */
export async function clearLeaderboardInSupabase() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .delete()
        .neq("team_id", "DUMMY_NEQ");
      if (error) console.error("Supabase clearLeaderboard error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase clearLeaderboard fallback:", e);
    }
  }
}


