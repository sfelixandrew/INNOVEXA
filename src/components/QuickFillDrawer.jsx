import React, { useState } from "react";
import { Zap, ShieldCheck, UserCheck, GraduationCap, X, ChevronUp } from "lucide-react";
import { PRESET_ACCOUNTS } from "../data/mockUsers";

export default function QuickFillDrawer({ onSelectRole, onDirectLogin }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdminQuick = () => {
    onSelectRole("admin");
    onDirectLogin(PRESET_ACCOUNTS.admin);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="quick-drawer-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Zap size={18} />
        <span>Admin Quick Launcher</span>
        <ChevronUp size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Zap size={22} color="var(--role-primary)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Quick Admin Login</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)", marginBottom: "1.25rem" }}>
              Instant authorization helper for Event Directors & System Admin:
            </p>

            <button
              type="button"
              onClick={handleAdminQuick}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.1rem",
                borderRadius: "14px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <ShieldCheck size={22} color="#818cf8" />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>INNOVEX ADMIN Sign In</div>
                  <div style={{ fontSize: "0.78rem", color: "#a5b4fc" }}>ID: INNOVEXAADMINGP | Pass: GP2K26</div>
                </div>
              </div>
              <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "8px", background: "#6366f1", fontWeight: 700 }}>
                1-Click Sign In
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
