import React, { useState } from "react";
import { 
  Mail, Lock, Eye, EyeOff, LogIn, ShieldAlert, Sparkles, 
  ShieldCheck, UserCheck, GraduationCap, Users, KeyRound
} from "lucide-react";
import { PRESET_ACCOUNTS } from "../data/mockUsers";
import { authenticateCoordinatorInSupabase } from "../lib/supabase";
import SelectMemberModal from "./SelectMemberModal";

export default function LoginForm({
  activeRole,
  onLoginSuccess,
  onOpenOtpModal,
  onOpenForgotPassword,
  coordinatorsList = [],
  studentTeamsList = []
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentTeamName, setStudentTeamName] = useState("");
  const [studentTeamCode, setStudentTeamCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student Member Name Selection Modal State
  const [isSelectMemberOpen, setIsSelectMemberOpen] = useState(false);
  const [pendingStudentTeam, setPendingStudentTeam] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Student Authentication (Team Name + Admin-Generated Team Code)
    if (activeRole === "student") {
      if (!studentTeamName.trim() || !studentTeamCode.trim()) {
        setError("Please enter both Team Name and Team Code.");
        return;
      }

      const matchedTeam = studentTeamsList.find(
        (t) =>
          t.teamName.trim().toLowerCase() === studentTeamName.trim().toLowerCase() &&
          t.teamCode.trim().toLowerCase() === studentTeamCode.trim().toLowerCase()
      );

      if (!matchedTeam) {
        setError("Invalid Team Name or Team Code. This team credential may have been revoked by Admin or does not exist.");
        return;
      }

      // Check if team is blocked due to anti-cheat violation
      if (matchedTeam.isBlocked) {
        setError("⛔ ACCESS DENIED: Your Student Team has been BLOCKED by Anti-Cheat System (Tab Switching). Contact Event Coordinator to unlock.");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        // Open Member Selection Pop-up Modal
        setPendingStudentTeam(matchedTeam);
        setIsSelectMemberOpen(true);
      }, 500);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.");
      return;
    }

    // Exact Admin Credentials Validation (INNOVEXAADMINGP / GP2K26)
    if (activeRole === "admin") {
      const isValidAdmin = (email.trim() === "adminjarvis" || email.toLowerCase() === "admin@innov.edu") && password === "12345678";
      if (!isValidAdmin) {
        setError("Invalid Admin User ID or Password.");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        if (PRESET_ACCOUNTS.admin["2FA"]) {
          onOpenOtpModal(PRESET_ACCOUNTS.admin);
        } else {
          onLoginSuccess(PRESET_ACCOUNTS.admin);
        }
      }, 600);
      return;
    }

    // STRICT Coordinator Credentials Validation (Only Admin-Generated Coordinators Permitted)
    if (activeRole === "coordinator") {
      setIsSubmitting(true);
      setError("");

      authenticateCoordinatorInSupabase(email, password).then((supabaseUser) => {
        if (supabaseUser) {
          setIsSubmitting(false);
          onLoginSuccess(supabaseUser);
          return;
        }

        // Fallback check against in-memory coordinatorsList
        const cleanLoginId = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        const matchedCoord = coordinatorsList.find((c) => {
          const matchEmail = c.email && c.email.trim().toLowerCase() === cleanLoginId;
          const matchId = c.id && c.id.trim().toLowerCase() === cleanLoginId;
          const matchPass = c.password && c.password.trim() === cleanPassword;
          return (matchEmail || matchId) && matchPass;
        });

        if (matchedCoord) {
          setIsSubmitting(false);
          onLoginSuccess({
            id: matchedCoord.id,
            role: "coordinator",
            roleTitle: "Event Coordinator",
            name: matchedCoord.name,
            email: matchedCoord.email,
            password: matchedCoord.password,
            department: matchedCoord.department,
            assignedGames: matchedCoord.assignedGames || ["abbrev_quiz", "real_fake_img"],
            assignedGameTitle: matchedCoord.assignedGameTitle || "Allocated Event Games",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(matchedCoord.name)}`
          });
          return;
        }

        setIsSubmitting(false);
        setError("Invalid Coordinator User ID or Password. Only Admin-generated Coordinator accounts are permitted.");
      }).catch(() => {
        setIsSubmitting(false);
        setError("Authentication error. Please try again.");
      });
    }
  };

  return (
    <div className="glass-card jarvis-hud-card" style={{ padding: "2.5rem 2rem", position: "relative" }}>
      {/* Sci-Fi HUD Corner Accents */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* J.A.R.V.I.S 360° Arc Reactor Animated Core */}
      <div className="arc-reactor-container">
        <div className="arc-reactor-outer-ring" />
        <div className="arc-reactor-inner-ring" />
        <div className="arc-reactor-core">
          <Sparkles size={24} color="#00f0ff" style={{ animation: "rotateArc 6s linear infinite" }} />
        </div>
      </div>

      {/* Header Info */}
      <div className="login-header">
        <div className="role-badge" style={{ background: "rgba(0, 240, 255, 0.12)", borderColor: "#00f0ff", color: "#00f0ff" }}>
          {activeRole === "admin" && <ShieldCheck size={14} />}
          {activeRole === "coordinator" && <UserCheck size={14} />}
          {activeRole === "student" && <GraduationCap size={14} />}
          <span className="jarvis-subtext">
            {activeRole === "admin" && "J.A.R.V.I.S DIRECTORY COMMAND"}
            {activeRole === "coordinator" && "J.A.R.V.I.S COORDINATOR PANEL"}
            {activeRole === "student" && "J.A.R.V.I.S STUDENT PORTAL"}
          </span>
        </div>

        <h1 className="login-title jarvis-text-glow" style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: "0.5rem" }}>
          INNOVEXA-JARVIS EVENT
        </h1>

        <p className="login-subtitle" style={{ color: "#7dd3fc", fontSize: "0.88rem" }}>
          {activeRole === "admin" && "Executive authentication for Event Director"}
          {activeRole === "coordinator" && "Authenticate with your Admin-generated Coordinator User ID & Password."}
          {activeRole === "student" && "Sign in with your Team Name & Admin-generated Team Code."}
        </p>
      </div>

      {error && (
        <div style={{
          marginBottom: "1.25rem",
          padding: "0.85rem 1rem",
          borderRadius: "12px",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Role specific form body */}
      {activeRole === "student" ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <div className="input-wrapper">
              <Users className="input-icon" size={18} color="#00f0ff" />
              <input
                type="text"
                className="form-input"
                placeholder="Enter your registered Team Name..."
                value={studentTeamName}
                onChange={(e) => setStudentTeamName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Admin-Generated Team Code</label>
            <div className="input-wrapper">
              <KeyRound className="input-icon" size={18} color="#00f0ff" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. JARVIS-1001"
                value={studentTeamCode}
                onChange={(e) => setStudentTeamCode(e.target.value.toUpperCase())}
                style={{ fontWeight: 800, letterSpacing: "0.05em", color: "#00f0ff" }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
              color: "#030712",
              fontWeight: 800,
              boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
              border: "1px solid #00f0ff",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            {isSubmitting ? (
              <span>VERIFYING TEAM CODE...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>SIGN IN WITH TEAM CODE</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* ADMIN & COORDINATOR FORM */
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeRole === "admin" ? "Admin User ID" : "Generated Coordinator User ID"}
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder={activeRole === "admin" ? "Enter Admin ID..." : "Enter Coordinator Email ID..."}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--role-primary)" }}
              />
              <span>Remember session</span>
            </label>

            <span className="forgot-link" onClick={onOpenForgotPassword}>
              Forgot Password?
            </span>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
              color: "#030712",
              fontWeight: 800,
              boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
              border: "1px solid #00f0ff",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            {isSubmitting ? (
              <span>INITIALIZING J.A.R.V.I.S...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>ACCESS {activeRole.toUpperCase()} HUD</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Select Member Name Modal */}
      <SelectMemberModal
        isOpen={isSelectMemberOpen}
        team={pendingStudentTeam}
        onClose={() => setIsSelectMemberOpen(false)}
        onConfirmMember={(memberName) => {
          setIsSelectMemberOpen(false);
          if (pendingStudentTeam) {
            onLoginSuccess({
              id: pendingStudentTeam.id,
              role: "student",
              roleTitle: "Student Team Player",
              name: memberName,
              email: `${pendingStudentTeam.teamCode.toLowerCase()}@innov.edu`,
              studentId: pendingStudentTeam.teamCode,
              team: pendingStudentTeam,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberName)}`
            });
          }
        }}
      />
    </div>
  );
}
