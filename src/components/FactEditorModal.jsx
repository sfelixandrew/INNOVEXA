import React, { useState, useEffect } from "react";
import { Lightbulb, Save, X, CheckCircle2, XCircle } from "lucide-react";

export default function FactEditorModal({ isOpen, onClose, editingFact, onSaveFact }) {
  const [question, setQuestion] = useState("");
  const [realFact, setRealFact] = useState("");
  const [fakeFact1, setFakeFact1] = useState("");
  const [fakeFact2, setFakeFact2] = useState("");
  const [category, setCategory] = useState("General Knowledge");
  const [explanation, setExplanation] = useState("");
  const [marks, setMarks] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingFact) {
      setQuestion(editingFact.question || "");
      setRealFact(editingFact.realFact || "");
      setFakeFact1(editingFact.fakeFact1 || "");
      setFakeFact2(editingFact.fakeFact2 || "");
      setCategory(editingFact.category || "General Knowledge");
      setExplanation(editingFact.explanation || "");
      setMarks(editingFact.marks || 10);
    } else {
      setQuestion("");
      setRealFact("");
      setFakeFact1("");
      setFakeFact2("");
      setCategory("General Knowledge");
      setExplanation("");
      setMarks(10);
    }
    setError("");
  }, [editingFact, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !realFact.trim() || !fakeFact1.trim() || !fakeFact2.trim()) {
      setError("Please fill in the question, the 1 real fact, and both 2 fake facts.");
      return;
    }

    const factObj = {
      id: editingFact ? editingFact.id : Date.now(),
      question: question.trim(),
      realFact: realFact.trim(),
      fakeFact1: fakeFact1.trim(),
      fakeFact2: fakeFact2.trim(),
      category: category.trim() || "General Knowledge",
      explanation: explanation.trim(),
      marks: parseInt(marks, 10) || 10
    };

    onSaveFact(factObj);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card jarvis-hud-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "640px", width: "100%", padding: "2rem", color: "#f8fafc", position: "relative", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
        >
          <X size={22} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "radial-gradient(circle, #a78bfa 0%, #6366f1 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 15px rgba(167,139,250,0.5)", color: "#ffffff"
          }}>
            <Lightbulb size={22} />
          </div>
          <div>
            <h3 className="jarvis-text-glow" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#a78bfa" }}>
              {editingFact ? "Edit Fact Finder Question" : "Add Fact Finder Question"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
              Set 1 real fact + 2 fake facts. Students must identify the real one.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem", padding: "0.6rem 0.8rem", background: "rgba(239,68,68,0.15)", borderRadius: "8px", border: "1px solid #ef4444" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div className="form-group">
            <label className="form-label">Question / Topic Label *</label>
            <input
              type="text"
              required
              className="form-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. About the speed of light in vacuum..."
              style={{ paddingLeft: "1rem" }}
            />
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              This is the question or context shown to students before they see the 3 options.
            </div>
          </div>

          {/* Real Fact */}
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span style={{ color: "#34d399" }}>Real Fact (Correct Answer) *</span>
            </label>
            <textarea
              required
              className="form-input"
              value={realFact}
              onChange={(e) => setRealFact(e.target.value)}
              placeholder="Enter the REAL/TRUE fact here..."
              rows={2}
              style={{ paddingLeft: "1rem", paddingTop: "0.75rem", resize: "vertical", background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.3)" }}
            />
          </div>

          {/* Fake Fact 1 */}
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <XCircle size={14} color="#ef4444" />
              <span style={{ color: "#f87171" }}>Fake Fact 1 (Wrong Option) *</span>
            </label>
            <textarea
              required
              className="form-input"
              value={fakeFact1}
              onChange={(e) => setFakeFact1(e.target.value)}
              placeholder="Enter first FAKE/FALSE fact here..."
              rows={2}
              style={{ paddingLeft: "1rem", paddingTop: "0.75rem", resize: "vertical", background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.25)" }}
            />
          </div>

          {/* Fake Fact 2 */}
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <XCircle size={14} color="#ef4444" />
              <span style={{ color: "#f87171" }}>Fake Fact 2 (Wrong Option) *</span>
            </label>
            <textarea
              required
              className="form-input"
              value={fakeFact2}
              onChange={(e) => setFakeFact2(e.target.value)}
              placeholder="Enter second FAKE/FALSE fact here..."
              rows={2}
              style={{ paddingLeft: "1rem", paddingTop: "0.75rem", resize: "vertical", background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.25)" }}
            />
          </div>

          {/* Category & Marks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-group">
            <div>
              <label className="form-label">Category / Topic</label>
              <input
                type="text"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Science, History, Technology"
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div>
              <label className="form-label">Allocated Marks / Points *</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                className="form-input"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="form-group">
            <label className="form-label">Explanation (Shown after answer)</label>
            <textarea
              className="form-input"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Brief explanation of why the real fact is correct (shown to students after they answer)..."
              rows={2}
              style={{ paddingLeft: "1rem", paddingTop: "0.75rem", resize: "vertical" }}
            />
          </div>

          {/* Preview box */}
          {(realFact || fakeFact1 || fakeFact2) && (
            <div style={{ marginBottom: "1rem", padding: "1rem", borderRadius: "12px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.25)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#a78bfa", marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Preview — How students will see it (options are shuffled)</div>
              {[{ text: realFact, type: "real" }, { text: fakeFact1, type: "fake" }, { text: fakeFact2, type: "fake" }]
                .filter(o => o.text)
                .map((opt, i) => (
                  <div key={i} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", marginBottom: "0.4rem", background: opt.type === "real" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)", border: `1px solid ${opt.type === "real" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}`, fontSize: "0.82rem", color: opt.type === "real" ? "#34d399" : "#f87171", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {opt.type === "real" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {opt.text}
                    <span style={{ marginLeft: "auto", fontSize: "0.68rem", opacity: 0.7 }}>{opt.type === "real" ? "REAL" : "FAKE"}</span>
                  </div>
                ))}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%", marginTop: "0.5rem",
              background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
              color: "#ffffff", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}
          >
            <Save size={18} />
            <span>{editingFact ? "Save Fact Question Changes" : "Add Fact Question to Game 2"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
