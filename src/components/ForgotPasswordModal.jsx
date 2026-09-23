import React, { useState } from "react";
import { KeyRound, X, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose, activeRole }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        {!sent ? (
          <div>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "1rem", color: "var(--role-primary)"
            }}>
              <KeyRound size={24} />
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Reset {activeRole.toUpperCase()} Password
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)", marginBottom: "1.25rem" }}>
              Enter your registered system email to receive a password recovery magic link.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Registered System Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. admin@innov.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
                Send Password Reset Link
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "#10b981" }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Reset Link Dispatched!
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-dark-secondary)", marginBottom: "1.5rem" }}>
              Instructions to reset password have been sent to <strong>{email}</strong>.
            </p>

            <button type="button" className="btn-primary" onClick={onClose}>
              Return to Login Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
