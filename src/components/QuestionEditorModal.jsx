import React, { useState, useEffect } from "react";
import { HelpCircle, Save, X, Plus, Award } from "lucide-react";

export default function QuestionEditorModal({ isOpen, onClose, editingQuestion, onSaveQuestion }) {
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0);
  const [marks, setMarks] = useState(10);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.question || "");
      setOptA(editingQuestion.options?.[0] || "");
      setOptB(editingQuestion.options?.[1] || "");
      setOptC(editingQuestion.options?.[2] || "");
      setOptD(editingQuestion.options?.[3] || "");
      setCorrectIdx(editingQuestion.correct || 0);
      setMarks(editingQuestion.marks || 10);
      setExplanation(editingQuestion.explanation || "");
    } else {
      setQuestionText("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setCorrectIdx(0);
      setMarks(10);
      setExplanation("");
    }
  }, [editingQuestion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setError("Please fill in the question text and all 4 options.");
      return;
    }

    const qObj = {
      id: editingQuestion ? editingQuestion.id : Date.now(),
      question: questionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correct: parseInt(correctIdx, 10),
      marks: parseInt(marks, 10) || 10,
      explanation: explanation.trim() || "No explanation provided."
    };

    onSaveQuestion(qObj);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", right: "1.25rem", top: "1.25rem", background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              {editingQuestion ? "Edit Abbreviation Quiz Question" : "Add New Abbreviation Quiz Question"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dark-secondary)" }}>
              Define question text, 4 options, correct answer, and points allocation.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question Text</label>
            <input
              type="text"
              required
              className="form-input"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What does API stand for?"
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          <div className="responsive-grid-2 form-group">
            <div>
              <label className="form-label">Option A</label>
              <input
                type="text"
                required
                className="form-input"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                placeholder="Option A"
                style={{ paddingLeft: "1rem" }}
              />
            </div>

            <div>
              <label className="form-label">Option B</label>
              <input
                type="text"
                required
                className="form-input"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                placeholder="Option B"
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>

          <div className="responsive-grid-2 form-group">
            <div>
              <label className="form-label">Option C</label>
              <input
                type="text"
                required
                className="form-input"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                placeholder="Option C"
                style={{ paddingLeft: "1rem" }}
              />
            </div>

            <div>
              <label className="form-label">Option D</label>
              <input
                type="text"
                required
                className="form-input"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                placeholder="Option D"
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>

          <div className="responsive-grid-2 form-group">
            <div>
              <label className="form-label">Correct Option Answer</label>
              <select
                className="form-input"
                value={correctIdx}
                onChange={(e) => setCorrectIdx(e.target.value)}
                style={{ paddingLeft: "1rem", color: "#fff", cursor: "pointer" }}
              >
                <option value={0} style={{ background: "#0f172a" }}>Option A (First)</option>
                <option value={1} style={{ background: "#0f172a" }}>Option B (Second)</option>
                <option value={2} style={{ background: "#0f172a" }}>Option C (Third)</option>
                <option value={3} style={{ background: "#0f172a" }}>Option D (Fourth)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Marks / Points Allocation</label>
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

          <div className="form-group">
            <label className="form-label">Explanation / Answer Detail</label>
            <input
              type="text"
              className="form-input"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. API allows distinct software modules to communicate."
              style={{ paddingLeft: "1rem" }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "1rem", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <Save size={18} />
            <span>{editingQuestion ? "Save Question Changes" : "Add Question to Quiz"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
