import { createClient } from "@supabase/supabase-js";

// Retrieve environment variables or use safe fallback placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xyz-mock-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-anon-key-123456789";

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check if live Supabase environment variables are connected.
 * If not connected, the application gracefully falls back to interactive state management.
 */
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes("xyz-mock-project")
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
      const { data, error } = await supabase
        .from("coordinators")
        .insert([coordData]);
      if (error) console.error("Supabase createCoordinator error:", error);
      return data;
    } catch (e) {
      console.warn("Supabase createCoordinator fallback:", e);
    }
  }
  return coordData;
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
          members: teamRecord.members,
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

    if (gameLocksRes.data && gameLocksRes.data.length > 0) {
      const locksMap = {};
      gameLocksRes.data.forEach((row) => {
        locksMap[row.game_id] = row.is_locked;
      });
      state.gameLocks = locksMap;
    }

    if (coordinatorsRes.data && coordinatorsRes.data.length > 0) {
      state.coordinators = coordinatorsRes.data;
    }

    if (teamsRes.data && teamsRes.data.length > 0) {
      state.studentTeams = teamsRes.data.map((row) => ({
        id: row.id,
        teamName: row.team_name,
        teamCode: row.team_code,
        leaderName: row.leader_name,
        members: row.members || [],
        createdTime: row.created_time,
        status: row.status,
        isBlocked: row.is_blocked,
        penalty: row.penalty
      }));
    }

    if (quizQuestionsRes.data && quizQuestionsRes.data.length > 0) {
      state.quizQuestions = quizQuestionsRes.data;
    }

    if (factQuestionsRes.data && factQuestionsRes.data.length > 0) {
      state.factQuestions = factQuestionsRes.data.map((row) => ({
        id: row.id,
        question: row.question,
        realFact: row.real_fact,
        fakeFact1: row.fake_fact1,
        fakeFact2: row.fake_fact2,
        explanation: row.explanation,
        marks: row.marks,
        category: row.category
      }));
    }

    if (leaderboardRes.data && leaderboardRes.data.length > 0) {
      state.leaderboard = leaderboardRes.data.map((row) => ({
        sNo: 1,
        rank: 1,
        teamId: row.team_id,
        teamName: row.team_name,
        teamCode: row.team_code,
        leaderName: row.leader_name,
        members: row.members || [],
        abbrevScore: row.abbrev_score || 0,
        imageScore: row.image_score || 0,
        abbrevCompleted: row.abbrev_completed || false,
        imageCompleted: row.image_completed || false,
        bonusScore: row.bonus_score || 0,
        penalty: row.penalty || 0,
        totalScore: row.total_score || 0,
        timeSeconds: row.time_seconds || 0,
        lastPlayed: row.last_played,
        status: row.status,
        memberAttendance: row.member_attendance || {},
        registrationTime: row.registration_time
      }));
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
        .eq("id", coordId);
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


