import React, { useState } from "react";
import { Lock, Unlock, Key, X, ShieldAlert } from "lucide-react";

export default function LockQuestionsModal({ isOpen, onClose, isCurrentlyLocked, onToggleLock }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter a security password.");
      return;
    }

    if (!isCurrentlyLocked && password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    onToggleLock(password.trim());
    setPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: isCurrentlyLocked ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)", border: isCurrentlyLocked ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: isCurrentlyLocked ? "#f87171" : "#34d399" }}>
            {isCurrentlyLocked ? <Lock size={22} /> : <Unlock size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              {isCurrentlyLocked ? "Unlock Question Bank" : "Lock Question Bank with Password"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              {isCurrentlyLocked
                ? "Enter your security password to allow editing questions & marks."
                : "Set a security password to lock question definitions, answers & marks during event."}
            </p>
          </div>
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {isCurrentlyLocked ? "Enter Security Password to Unlock" : "Set New Security Lock Password"}
            </label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          {!isCurrentlyLocked && (
            <div className="form-group">
              <label className="form-label">Confirm Security Lock Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              marginTop: "1rem",
              background: isCurrentlyLocked ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            }}
          >
            {isCurrentlyLocked ? <Unlock size={18} /> : <Lock size={18} />}
            <span>{isCurrentlyLocked ? "Unlock Question Editing" : "Lock Questions & Marks"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
