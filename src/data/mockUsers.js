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
    adminId: "INNOVEXAADMINGP",
    role: "admin",
    roleTitle: "Event System Director",
    email: "INNOVEXAADMINGP",
    password: "GP2K26",
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

  coordinator: {
    id: "CRD-4089",
    role: "coordinator",
    roleTitle: "Event Operations Coordinator",
    email: "coordinator@innov.edu",
    password: "Coord@123",
    name: "Prof. Marcus Sterling",
    department: "Tech Quiz & AI Track",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    badge: "Track Lead",
    assignedGames: ["abbrev_quiz", "real_fake_img"],
    assignedGameTitles: ["Abbreviation Speed Quiz", "AI vs Real Image Detector"],
    securityLevel: "Level 3 - Event Monitor",
    "2FA": false,
    lastLogin: "Today at 08:15 AM",
    stats: {
      activeTeamsMonitored: 16,
      completedSubmissions: 24,
      flaggedEntries: 0
    }
  }
};

// Coordinators List
export const INITIAL_COORDINATORS = [
  {
    id: "CRD-4089",
    name: "Prof. Marcus Sterling",
    email: "coordinator@innov.edu",
    password: "Coord@123",
    department: "Computer Science & AI",
    assignedGames: ["abbrev_quiz", "real_fake_img"],
    assignedGameTitle: "All Event Games",
    createdTime: "2026-09-21 08:00 AM"
  },
  {
    id: "CRD-5102",
    name: "Dr. Aris Thorne",
    email: "aris.thorne@innov.edu",
    password: "Aris@2026",
    department: "Cybersecurity & Media",
    assignedGames: ["real_fake_img"],
    assignedGameTitle: "AI vs Real Image Detector",
    createdTime: "2026-09-21 09:15 AM"
  },
  {
    id: "CRD-6330",
    name: "Prof. Sarah Jenkins",
    email: "sarah.jenkins@innov.edu",
    password: "Sarah@2026",
    department: "Information Technology",
    assignedGames: ["abbrev_quiz"],
    assignedGameTitle: "Abbreviation Speed Quiz",
    createdTime: "2026-09-21 10:00 AM"
  }
];

// Student Demo Accounts
export const DEMO_GOOGLE_STUDENT_ACCOUNTS = [
  {
    googleId: "goog_8912371",
    email: "alex.rivera.student@gmail.com",
    name: "Alex Rivera",
    givenName: "Alex",
    familyName: "Rivera",
    picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    studentId: "STU-2026-8942",
    verifiedGoogleAccount: true,
    team: {
      teamId: "TEAM-4892",
      teamName: "Neural Ninjas",
      teamCode: "NN-4892",
      leaderName: "Alex Rivera",
      members: ["Alex Rivera", "Maya Patel", "David Chen"]
    }
  },
  {
    googleId: "goog_4491823",
    email: "maya.patel.ai@gmail.com",
    name: "Maya Patel",
    givenName: "Maya",
    familyName: "Patel",
    picture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    studentId: "STU-2026-4411",
    verifiedGoogleAccount: true,
    team: {
      teamId: "TEAM-4892",
      teamName: "Neural Ninjas",
      teamCode: "NN-4892",
      leaderName: "Alex Rivera",
      members: ["Alex Rivera", "Maya Patel", "David Chen"]
    }
  }
];

// Event Leaderboard & Attendance Data
export const INITIAL_LEADERBOARD = [
  {
    sNo: 1,
    rank: 1,
    teamId: "TEAM-4892",
    teamName: "Neural Ninjas",
    teamCode: "NN-4892",
    leaderName: "Alex Rivera",
    members: ["Alex Rivera", "Maya Patel", "David Chen"],
    abbrevScore: 95,
    imageScore: 90,
    totalScore: 185,
    timeSeconds: 215,
    lastPlayed: "10 mins ago",
    status: "Present",
    registrationTime: "09:00 AM"
  },
  {
    sNo: 2,
    rank: 2,
    teamId: "TEAM-3021",
    teamName: "Cyber Alliance",
    teamCode: "CA-3021",
    leaderName: "Jordan Miller",
    members: ["Jordan Miller", "Elena Rostova"],
    abbrevScore: 90,
    imageScore: 80,
    totalScore: 170,
    timeSeconds: 240,
    lastPlayed: "25 mins ago",
    status: "Present",
    registrationTime: "09:15 AM"
  },
  {
    sNo: 3,
    rank: 3,
    teamId: "TEAM-1109",
    teamName: "Quantum Hackers",
    teamCode: "QH-1109",
    leaderName: "Liam Vance",
    members: ["Liam Vance", "Sophia Martinez", "Noah Kim"],
    abbrevScore: 85,
    imageScore: 80,
    totalScore: 165,
    timeSeconds: 260,
    lastPlayed: "40 mins ago",
    status: "Present",
    registrationTime: "09:30 AM"
  },
  {
    sNo: 4,
    rank: 4,
    teamId: "TEAM-9014",
    teamName: "Binary Bosses",
    teamCode: "BB-9014",
    leaderName: "Ethan Hunt",
    members: ["Ethan Hunt", "Chloe Zhang"],
    abbrevScore: 70,
    imageScore: 85,
    totalScore: 155,
    timeSeconds: 280,
    lastPlayed: "1 hour ago",
    status: "Present",
    registrationTime: "09:45 AM"
  },
  {
    sNo: 5,
    rank: 5,
    teamId: "TEAM-7712",
    teamName: "Algorithmic Titans",
    teamCode: "AT-7712",
    leaderName: "Priya Sharma",
    members: ["Priya Sharma", "Rohan Gupta", "Karan Patel"],
    abbrevScore: 75,
    imageScore: 75,
    totalScore: 150,
    timeSeconds: 300,
    lastPlayed: "1 hour ago",
    status: "Present",
    registrationTime: "10:00 AM"
  }
];

export const ABBREVIATION_QUESTIONS = [
  {
    id: 1,
    question: "What does API stand for in software engineering?",
    options: [
      "Application Programming Interface",
      "Automated Processing Integration",
      "Applied Protocol Implementation",
      "Advanced Program Instruction"
    ],
    correct: 0,
    explanation: "API stands for Application Programming Interface, which allows distinct applications to communicate with each other."
  },
  {
    id: 2,
    question: "In Cloud Computing & DevOps, what does SaaS stand for?",
    options: [
      "System as a Service",
      "Software as a Service",
      "Storage as a Service",
      "Security as a Service"
    ],
    correct: 1,
    explanation: "SaaS (Software as a Service) delivers cloud-based applications over the internet (e.g., Gmail, Office 365)."
  },
  {
    id: 3,
    question: "What does CUDA stand for in GPU Acceleration & AI Hardware?",
    options: [
      "Centralized Universal Digital Architecture",
      "Computer Unit Data Accelerator",
      "Compute Unified Device Architecture",
      "Core Utility Data Engine"
    ],
    correct: 2,
    explanation: "CUDA (Compute Unified Device Architecture) is NVIDIA's parallel computing platform and API model."
  },
  {
    id: 4,
    question: "In Modern AI Models, what does LLM stand for?",
    options: [
      "Logic Layer Model",
      "Large Language Model",
      "Linear Learning Matrix",
      "Latent Language Mechanism"
    ],
    correct: 1,
    explanation: "LLM stands for Large Language Model, trained on vast textual datasets to generate human-like text."
  },
  {
    id: 5,
    question: "In Computer Networks, what does HTTP / HTTPS stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transmission Terminal Program",
      "Hyperlink Text Transfer Engine",
      "Host Terminal Transfer Protocol"
    ],
    correct: 0,
    explanation: "HTTP stands for HyperText Transfer Protocol (HTTPS adding SSL/TLS Security)."
  }
];

// Fact Finder Event Questions dataset
export const FACT_FINDER_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following statements about the speed of light is correct?",
    realFact: "Light travels at approximately 299,792 kilometres per second in a vacuum.",
    fakeFact1: "Light travels faster through water than through a vacuum due to particle density.",
    fakeFact2: "The speed of light is exactly 300,000 km/s and has no margin of variability.",
    category: "Physics",
    explanation: "The exact measured speed of light in a vacuum is 299,792,458 m/s. Light slows down (not speeds up) when passing through denser media like water.",
    marks: 10
  },
  {
    id: 2,
    question: "Identify the real fact about Artificial Intelligence and Machine Learning.",
    realFact: "Machine learning models learn patterns from data without being explicitly programmed for every scenario.",
    fakeFact1: "AI systems have achieved full human-level consciousness and emotional understanding.",
    fakeFact2: "Deep learning neural networks can only process text data, not images or audio.",
    category: "Technology / AI",
    explanation: "ML models train on datasets to generalise patterns. AI has not achieved consciousness, and deep learning handles images, audio, and multimodal data.",
    marks: 10
  },
  {
    id: 3,
    question: "Which fact about the human brain is accurate?",
    realFact: "The human brain contains approximately 86 billion neurons connected by trillions of synapses.",
    fakeFact1: "Humans only use about 10% of their brain capacity at any given time.",
    fakeFact2: "Brain cells (neurons) cannot survive beyond 7 years and are constantly replaced by new ones.",
    category: "Biology",
    explanation: "The '10% myth' is scientifically false — brain imaging shows most of the brain is active. Neurons can last a lifetime; most are not replaced after birth.",
    marks: 10
  },
  {
    id: 4,
    question: "Pick the real fact about the Internet and the World Wide Web.",
    realFact: "The World Wide Web was invented by Tim Berners-Lee in 1989 and is distinct from the Internet itself.",
    fakeFact1: "The Internet and the World Wide Web are two different names for the exact same technology.",
    fakeFact2: "Tim Berners-Lee invented the Internet at ARPA in 1969 as a military communication tool.",
    category: "Technology / History",
    explanation: "The Internet is the global network infrastructure; the Web is an application running on it. ARPANET preceded the Internet but Berners-Lee invented the WWW in 1989 at CERN.",
    marks: 10
  },
  {
    id: 5,
    question: "Which statement about DNA and genetics is a verified scientific fact?",
    realFact: "DNA (Deoxyribonucleic acid) is a double-helix molecule that encodes genetic instructions for all living organisms.",
    fakeFact1: "DNA was discovered by Gregor Mendel in 1866 using X-ray crystallography techniques.",
    fakeFact2: "Identical twins have completely identical DNA with absolutely no genetic differences whatsoever.",
    category: "Biology / Genetics",
    explanation: "DNA's double-helix structure was described by Watson and Crick in 1953. Mendel studied heredity but didn't discover DNA. Identical twins can have minor somatic mutations.",
    marks: 10
  }
];
