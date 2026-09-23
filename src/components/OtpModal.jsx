import React, { useState } from "react";
import { ShieldCheck, X, RefreshCw } from "lucide-react";

export default function OtpModal({ isOpen, onClose, onVerifySuccess, user }) {
  const [otp, setOtp] = useState(["8", "4", "2", "9", "1", "0"]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleChange = (val, idx) => {
    if (/^[0-9]?$/.test(val)) {
      const nextOtp = [...otp];
      nextOtp[idx] = val;
      setOtp(nextOtp);

      if (val && idx < 5) {
        const nextInput = document.getElementById(`otp-box-${idx + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess(user);
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem", color: "#818cf8"
        }}>
          <ShieldCheck size={28} />
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.4rem" }}>
          Two-Factor Security Verification
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)", marginBottom: "1.25rem" }}>
          Enter the 6-digit security OTP sent to <strong>{user?.email || "admin@innov.edu"}</strong>
        </p>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleVerify}>
          <div className="otp-inputs">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-box-${idx}`}
                type="text"
                maxLength={1}
                className="otp-box"
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
              />
            ))}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }} disabled={isVerifying}>
            {isVerifying ? "Verifying OTP Code..." : "Verify & Complete Admin Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-dark-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: "pointer" }}>
          <RefreshCw size={14} />
          <span>Resend OTP SMS / Email Code</span>
        </div>
      </div>
    </div>
  );
}
