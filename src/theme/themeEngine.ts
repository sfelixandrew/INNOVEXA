/**
 * TypeScript Type-Safe Theme & Animation Engine for INNOVEXA-JARVIS EVENT
 */

export interface ThemeToken {
  primary: string;
  primaryHover: string;
  accent: string;
  bgDark: string;
  bgCard: string;
  glowColor: string;
  gradient: string;
  borderGlow: string;
  tagBg: string;
  tagText: string;
}

export interface RoleThemeConfig {
  role: "admin" | "coordinator" | "student";
  title: string;
  tokens: ThemeToken;
  animationClass: string;
  entranceEffect: string;
}

export const ROLE_THEMES: Record<"admin" | "coordinator" | "student", RoleThemeConfig> = {
  admin: {
    role: "admin",
    title: "J.A.R.V.I.S Executive Command Center",
    tokens: {
      primary: "#00F0FF",
      primaryHover: "#0284C7",
      accent: "#60A5FA",
      bgDark: "#030712",
      bgCard: "rgba(8, 14, 28, 0.9)",
      glowColor: "rgba(0, 240, 255, 0.45)",
      gradient: "linear-gradient(135deg, #00F0FF 0%, #2563EB 100%)",
      borderGlow: "rgba(0, 240, 255, 0.4)",
      tagBg: "rgba(0, 240, 255, 0.15)",
      tagText: "#38BDF8"
    },
    animationClass: "animate-jarvis-glow",
    entranceEffect: "fade-slide-down"
  },

  coordinator: {
    role: "coordinator",
    title: "J.A.R.V.I.S Tactical Operations & Game Track",
    tokens: {
      primary: "#38BDF8",
      primaryHover: "#0284C7",
      accent: "#00F0FF",
      bgDark: "#030712",
      bgCard: "rgba(8, 14, 28, 0.9)",
      glowColor: "rgba(56, 189, 248, 0.45)",
      gradient: "linear-gradient(135deg, #38BDF8 0%, #1D4ED8 100%)",
      borderGlow: "rgba(56, 189, 248, 0.4)",
      tagBg: "rgba(56, 189, 248, 0.15)",
      tagText: "#7DD3FC"
    },
    animationClass: "animate-coord-pulse",
    entranceEffect: "zoom-in-smooth"
  },

  student: {
    role: "student",
    title: "J.A.R.V.I.S Student Arena & Team Dashboard",
    tokens: {
      primary: "#60A5FA",
      primaryHover: "#3B82F6",
      accent: "#00F0FF",
      bgDark: "#030712",
      bgCard: "rgba(8, 14, 28, 0.9)",
      glowColor: "rgba(96, 165, 250, 0.45)",
      gradient: "linear-gradient(135deg, #60A5FA 0%, #0284C7 100%)",
      borderGlow: "rgba(96, 165, 250, 0.4)",
      tagBg: "rgba(96, 165, 250, 0.15)",
      tagText: "#93C5FD"
    },
    animationClass: "animate-student-bounce",
    entranceEffect: "bounce-in-soft"
  }
};

/**
 * Type-safe helper to apply role theme variables dynamically to DOM
 */
export function applyRoleTheme(role: "admin" | "coordinator" | "student"): RoleThemeConfig {
  const config = ROLE_THEMES[role] || ROLE_THEMES.admin;
  const root = document.documentElement;

  root.style.setProperty("--role-primary", config.tokens.primary);
  root.style.setProperty("--role-primary-hover", config.tokens.primaryHover);
  root.style.setProperty("--role-accent", config.tokens.accent);
  root.style.setProperty("--role-glow", config.tokens.glowColor);
  root.style.setProperty("--role-gradient", config.tokens.gradient);
  root.style.setProperty("--role-card-border", config.tokens.borderGlow);
  root.style.setProperty("--role-tag-bg", config.tokens.tagBg);
  root.style.setProperty("--role-tag-text", config.tokens.tagText);

  document.body.setAttribute("data-active-role", role);
  return config;
}

/**
 * Returns dynamic inline style object for role card glow
 */
export function getRoleGlowStyle(role: "admin" | "coordinator" | "student"): React.CSSProperties {
  const config = ROLE_THEMES[role] || ROLE_THEMES.admin;
  return {
    boxShadow: `0 10px 30px ${config.tokens.glowColor}`,
    borderColor: config.tokens.borderGlow
  };
}
