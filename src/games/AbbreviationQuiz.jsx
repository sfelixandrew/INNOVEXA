import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, 
  HelpCircle, AlertTriangle, Sparkles, Award, Lock
} from "lucide-react";
import { ABBREVIATION_QUESTIONS } from "../data/mockUsers";

// Fisher-Yates array shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AbbreviationQuiz({ 
  team, 
  questionsList = ABBREVIATION_QUESTIONS, 
  onCompleteQuiz, 
  onPauseGame,
  onBack,
  resumeData
}) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isInitializedRef = useRef(false);
  const sessionKey = `innovex_session_abbrev_quiz_${team?.id || "guest"}`;

  // Initialize randomized 30-question session ONCE per active game
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // 1. Check resumeData from Supabase
    if (resumeData?.savedState?.savedQuestions && resumeData.savedState.savedQuestions.length > 0) {
      setShuffledQuestions(resumeData.savedState.savedQuestions);
      setCurrentIndex(resumeData.currentIndex || 0);
      setScore(resumeData.score || 0);
      if (resumeData.savedState.answers) setAnswers(resumeData.savedState.answers);
      return;
    }

    // 2. Check local sessionStorage for page refresh resilience
    const savedLocalSession = sessionStorage.getItem(sessionKey);
    if (savedLocalSession) {
      try {
        const parsed = JSON.parse(savedLocalSession);
        if (parsed.savedQuestions && parsed.savedQuestions.length > 0) {
          setShuffledQuestions(parsed.savedQuestions);
          setCurrentIndex(parsed.currentIndex || 0);
          setScore(parsed.score || 0);
          setAnswers(parsed.answers || []);
          return;
        }
      } catch (err) {}
    }

    // 3. Create a stable, randomized 30-question sequence
    const baseList = questionsList.length > 0 ? questionsList : ABBREVIATION_QUESTIONS;
    const shuffled = shuffleArray(baseList);
    const target30 = shuffled.slice(0, 30);

    setShuffledQuestions(target30);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);

    sessionStorage.setItem(sessionKey, JSON.stringify({
      savedQuestions: target30,
      currentIndex: 0,
      score: 0,
      answers: []
    }));
  }, []);

  // Save progress on question advance or score update
  useEffect(() => {
    if (!isInitializedRef.current || shuffledQuestions.length === 0 || isFinished) return;

    const sessionObj = {
      savedQuestions: shuffledQuestions,
      currentIndex,
      score,
      answers
    };
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionObj));

    if (team?.id && onPauseGame) {
      onPauseGame({
        teamId: team.id,
        teamName: team.teamName,
        gameId: "abbrev_quiz",
        gameTitle: "Abbreviation Speed Quiz",
        currentIndex,
        score,
        savedState: sessionObj
      });
    }
  }, [currentIndex, score, answers, shuffledQuestions, team, onPauseGame, isFinished, sessionKey]);

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : questionsList;
  const currentQ = questions[currentIndex];

  if (!questions || questions.length === 0 || !currentQ) {
    return (
      <div className="glass-card jarvis-hud-card" style={{ padding: "2.5rem", maxWidth: "700px", margin: "2rem auto", textAlign: "center", color: "#f8fafc" }}>
        <HelpCircle size={48} color="#00f0ff" style={{ margin: "0 auto 1rem" }} />
        <h3 className="jarvis-text-glow" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          No Quiz Questions Available
        </h3>
        <p style={{ color: "#7dd3fc", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          The Event Coordinator has not added any questions for this quiz track yet. Please wait for questions to be uploaded.
        </p>
        <button type="button" onClick={onBack} style={{ background: "rgba(0,240,255,0.15)", border: "1px solid #00f0ff", color: "#00f0ff", padding: "0.6rem 1.25rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Mid-game exit detection
  useEffect(() => {
    if (isFinished) return;

    const handleVisibilityChange = () => {
      if (document.hidden && onPauseGame) {
        onPauseGame({
          teamId: team?.id,
          teamName: team?.teamName,
          gameId: "abbrev_quiz",
          gameTitle: "Abbreviation Speed Quiz",
          currentIndex,
          score,
          savedState: { currentIndex, score, savedQuestions: questions, answers }
        });
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentIndex, score, isFinished, onPauseGame, questions, answers, team]);

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const isCorrect = index === currentQ.correct;
    let gainedPoints = 0;
    if (isCorrect) {
      gainedPoints = currentQ.marks || 10;
      setScore((prev) => prev + gainedPoints);
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        userSelection: index,
        isCorrect,
        points: gainedPoints
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    sessionStorage.removeItem(sessionKey);
  };

  const handleSubmitScore = () => {
    setIsSubmitted(true);
    sessionStorage.removeItem(sessionKey);
    onCompleteQuiz({
      gameId: "abbrev_quiz",
      gameTitle: "Abbreviation Speed Quiz",
      score,
      totalQuestions: questions.length,
      timeSeconds: 0
    });
  };

  const maxTotalScore = questions.reduce((acc, q) => acc + (q.marks || 10), 0);

  return (
    <div className="glass-card" style={{ padding: "2rem", maxWidth: "760px", margin: "0 auto" }}>
      {/* Quiz Top Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-dark)", paddingBottom: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}>
            EVENT GAME 1 {resumeData ? "• RESUMED GAME" : ""}
          </span>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: "0.2rem" }}>
            Abbreviation Speed Quiz
          </h2>
          {team && (
            <p style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)" }}>
              Playing as Team: <strong style={{ color: "var(--role-primary)" }}>{team.teamName}</strong> ({team.teamCode})
            </p>
          )}
        </div>

        {isFinished ? (
          <button
            type="button"
            onClick={onBack}
            style={{ background: "transparent", border: "1px solid var(--border-dark)", color: "var(--text-dark-secondary)", padding: "0.4rem 0.8rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}
          >
            Exit Game
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.76rem", fontWeight: 700 }}>
            <Lock size={14} />
            <span>EXITS LOCKED WHILE PLAYING</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div>
          {/* Question Counter & Progress Bar */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              <span>Question {currentIndex + 1} of {questions.length} ({currentQ.marks || 10} Marks)</span>
              <span style={{ color: "var(--role-primary)", fontWeight: 700 }}>Current Score: {score} pts</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: "100%", background: "var(--role-gradient)", transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Question Card */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-dark)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "1.25rem" }}>
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {currentQ.options.map((optionText, idx) => {
                let btnStyle = {
                  width: "100%",
                  padding: "1rem 1.2rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border-dark)",
                  background: "rgba(15, 23, 42, 0.6)",
                  color: "#fff",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                };

                if (selectedOption !== null) {
                  if (idx === currentQ.correct) {
                    btnStyle.background = "rgba(16, 185, 129, 0.2)";
                    btnStyle.borderColor = "#10b981";
                    btnStyle.color = "#34d399";
                  } else if (idx === selectedOption) {
                    btnStyle.background = "rgba(239, 68, 68, 0.2)";
                    btnStyle.borderColor = "#ef4444";
                    btnStyle.color = "#f87171";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    style={btnStyle}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                  >
                    <span>{String.fromCharCode(65 + idx)}. {optionText}</span>
                    {selectedOption !== null && idx === currentQ.correct && (
                      <CheckCircle2 size={18} color="#34d399" />
                    )}
                    {selectedOption !== null && idx === selectedOption && idx !== currentQ.correct && (
                      <XCircle size={18} color="#f87171" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box when option is selected */}
          {selectedOption !== null && (
            <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: "0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <HelpCircle size={16} /> Explanation:
              </div>
              <p style={{ color: "var(--text-dark-secondary)" }}>{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          {selectedOption !== null && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextQuestion}
            >
              <span>{currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--role-tag-bg)", border: "2px solid var(--role-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "var(--role-primary)" }}>
            <Trophy size={36} />
          </div>

          <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            Abbreviation Quiz Complete!
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-dark-secondary)", marginBottom: "1.5rem" }}>
            Great effort! Here is your team's quiz performance summary:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ padding: "1rem", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-dark)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)" }}>FINAL SCORE</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--role-primary)" }}>{score} / {maxTotalScore}</div>
            </div>

            <div style={{ padding: "1rem", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-dark)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dark-secondary)" }}>ACCURACY</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34d399" }}>
                {Math.round((score / (maxTotalScore || 1)) * 100)}%
              </div>
            </div>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmitScore}
            >
              <Award size={18} />
              <span>Submit Score to Event Leaderboard</span>
            </button>
          ) : (
            <div>
              <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", fontWeight: 700, marginBottom: "1.5rem" }}>
                ✓ Score Submitted & Recorded on Leaderboard!
              </div>
              <button type="button" className="btn-primary" onClick={onBack}>
                Return to Student Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
