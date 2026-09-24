// Production Real-World Event Datasets & Admin Access Credentials

export const INITIAL_GAME_LOCKS = {
  abbrev_quiz: false,       // false = unlocked, true = locked by admin
  real_fake_img: false      // false = unlocked, true = locked by admin
};

export const INITIAL_GAME_TITLES = {
  abbrev_quiz: "Abbreviation Speed Quiz",
  real_fake_img: "Fact Finder"
};

export const PRESET_ACCOUNTS = {
  admin: {
    id: "ADM-9021",
    adminId: "jarvisadmin",
    role: "admin",
    roleTitle: "Event System Director",
    email: "jarvisadmin@innov",
    password: "2312",
    name: "INNOVEXA ADMIN",
    department: "Executive Event Operations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    badge: "Master Director",
    securityLevel: "Level 5 - Full Event Control",
    "2FA": true,
    lastLogin: "Today at 09:42 AM",
    stats: {
      totalTeams: 16,
      totalStudents: 48,
      activeGames: 2,
      managedCoordinators: 3
    }
  },

};

// Coordinators List (Empty initial state - generated dynamically by Admin)
export const INITIAL_COORDINATORS = [];

// Student Demo Accounts
export const DEMO_GOOGLE_STUDENT_ACCOUNTS = [];

// Student Event Teams Data (Empty initial state - registered dynamically by Admin)
export const INITIAL_STUDENT_TEAMS = [];

// Event Leaderboard & Attendance Data (Empty initial state - recorded live)
export const INITIAL_LEADERBOARD = [];

// Event Questions datasets (Empty initial state - created dynamically by Coordinators)
export const ABBREVIATION_QUESTIONS = [];
export const FACT_FINDER_QUESTIONS = [];
