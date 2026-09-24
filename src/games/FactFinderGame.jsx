import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2, XCircle, Trophy, ArrowRight, Sparkles,
  Award, Lightbulb, BookOpen, Zap, Target, Lock
} from "lucide-react";

// Fisher-Yates array shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FactFinderGame({ team, factsList = [], onCompleteGame, onPauseGame, onBack, resumeData }) {
  const [shuffledFacts, setShuffledFacts] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const isInitializedRef = useRef(false);
  const sessionKey = `innovex_session_real_fake_img_${team?.id || "guest"}`;

  // Initialize randomized 30-question session ONCE per active game
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (!factsList || factsList.length === 0) return;
    isInitializedRef.current = true;

    // 1. Check resumeData from Supabase
    if (resumeData?.savedState?.savedFacts && resumeData?.savedState?.savedOptions) {
      setShuffledFacts(resumeData.savedState.savedFacts);
      setShuffledOptions(resumeData.savedState.savedOptions);
      setCurrentIndex(resumeData.currentIndex || 0);
      setScore(resumeData.score || 0);
      return;
    }

    // 2. Check local sessionStorage for page refresh resilience
    const savedLocalSession = sessionStorage.getItem(sessionKey);
    if (savedLocalSession) {
      try {
        const parsed = JSON.parse(savedLocalSession);
        if (parsed.savedFacts && parsed.savedOptions && parsed.savedFacts.length > 0) {
          setShuffledFacts(parsed.savedFacts);
          setShuffledOptions(parsed.savedOptions);
          setCurrentIndex(parsed.currentIndex || 0);
          setScore(parsed.score || 0);
          return;
        }
      } catch (err) {}
    }

    // 3. Create a stable, randomized 30-question sequence
    const shuffled = shuffleArray(factsList);
    const target30Facts = shuffled.slice(0, 30);

    const options = target30Facts.map((q) => {
      const opts = [
        { text: q.realFact, isReal: true },
        { text: q.fakeFact1, isReal: false },
        { text: q.fakeFact2, isReal: false }
      ];
      return shuffleArray(opts);
    });

    setShuffledFacts(target30Facts);
    setShuffledOptions(options);
    setCurrentIndex(0);
    setUserChoice(null);
    setScore(0);
    setIsFinished(false);
    setIsSubmitted(false);
    setShowReveal(false);

    sessionStorage.setItem(sessionKey, JSON.stringify({
      savedFacts: target30Facts,
      savedOptions: options,
      currentIndex: 0,
      score: 0
    }));
  }, []);

  // Save progress on question advance or score update
  useEffect(() => {
    if (!isInitializedRef.current || shuffledFacts.length === 0 || isFinished) return;

    const sessionObj = {
      savedFacts: shuffledFacts,
      savedOptions: shuffledOptions,
      currentIndex,
      score
    };
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionObj));

    if (team?.id && onPauseGame) {
      onPauseGame({
        teamId: team.id,
        teamName: team.teamName,
        gameId: "real_fake_img",
        gameTitle: "Fact Finder",
        currentIndex,
        score,
        savedState: sessionObj
      });
    }
  }, [currentIndex, score, shuffledFacts, shuffledOptions, team, onPauseGame, isFinished, sessionKey]);

  // Mid-game exit detection
  useEffect(() => {
    if (isFinished) return;

    const handleVisibilityChange = () => {
      if (document.hidden && onPauseGame) {
        onPauseGame({
          teamId: team?.id,
          teamName: team?.teamName,
          gameId: "real_fake_img",
          gameTitle: "Fact Finder",
          currentIndex,
          score,
          savedState: { currentIndex, score, savedFacts: shuffledFacts, savedOptions: shuffledOptions }
        });
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentIndex, score, isFinished, onPauseGame, shuffledFacts, shuffledOptions, team]);

  if (shuffledFacts.length === 0) {
    return (
      <div className="glass-card jarvis-hud-card" style={{ padding: "2.5rem", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <BookOpen size={48} color="#00f0ff" style={{ margin: "0 auto 1rem" }} />
        <h3 className="jarvis-text-glow" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          No Fact Questions Available
        </h3>
        <p style={{ color: "#7dd3fc", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          The coordinator hasn't added any Fact Finder questions yet. Please wait for them to set up the questions.
        </p>
        <button type="button" onClick={onBack} style={{ background: "rgba(0,240,255,0.15)", border: "1px solid #00f0ff", color: "#00f0ff", padding: "0.6rem 1.25rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = shuffledFacts[currentIndex];
  const currentOpts = shuffledOptions[currentIndex] || [];
  const itemMarks = currentQ.marks || 10;
  const totalPossibleScore = shuffledFacts.reduce((sum, q) => sum + (q.marks || 10), 0);

  const handleGuess = (optIdx) => {
    if (userChoice !== null) return;
    setUserChoice(optIdx);
    setShowReveal(true);
    if (currentOpts[optIdx]?.isReal) {
      setScore((prev) => prev + itemMarks);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < shuffledFacts.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserChoice(null);
      setShowReveal(false);
    } else {
      setIsFinished(true);
      sessionStorage.removeItem(sessionKey);
    }
  };

  const handleSubmitScore = () => {
    setIsSubmitted(true);
    sessionStorage.removeItem(sessionKey);
    onCompleteGame({
      gameId: "real_fake_img",
      gameTitle: "Fact Finder",
      score,
      totalQuestions: shuffledFacts.length,
      timeSeconds: 0
    });
  };

  const optionColors = ["#00f0ff", "#a78bfa", "#fb923c"];
  const optionBgs = [
    "rgba(0,240,255,0.08)",
    "rgba(167,139,250,0.08)",
    "rgba(251,146,60,0.08)"
  ];
  const optionBorders = [
    "rgba(0,240,255,0.25)",
    "rgba(167,139,250,0.25)",
    "rgba(251,146,60,0.25)"
  ];

  const getOptionStyle = (optIdx) => {
    const chosen = userChoice !== null;
    const isThisChosen = userChoice === optIdx;
    const isRealOpt = currentOpts[optIdx]?.isReal;

    if (!chosen) {
      return {
        background: optionBgs[optIdx],
        border: `1px solid ${optionBorders[optIdx]}`,
        color: "#fff",
        cursor: "pointer",
        transform: "scale(1)",
        boxShadow: "none"
      };
    }

    // After reveal
    if (isRealOpt) {
      return {
        background: "rgba(16,185,129,0.2)",
        border: "2px solid #10b981",
        color: "#34d399",
        cursor: "default",
        boxShadow: "0 0 20px rgba(16,185,129,0.3)"
      };
    }
    if (isThisChosen && !isRealOpt) {
      return {
        background: "rgba(239,68,68,0.2)",
        border: "2px solid #ef4444",
        color: "#f87171",
        cursor: "default",
        boxShadow: "0 0 15px rgba(239,68,68,0.25)"
      };
    }
    return {
      background: "rgba(15,23,42,0.4)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#64748b",
      cursor: "default"
    };
  };

  return (
    <div className="glass-card jarvis-hud-card" style={{ padding: "2rem", maxWidth: "860px", margin: "0 auto", position: "relative" }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid rgba(0,240,255,0.2)", paddingBottom: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid #a78bfa" }}>
              J.A.R.V.I.S ARENA • GAME 2
            </span>
            <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", background: "rgba(251,146,60,0.12)", color: "#fb923c" }}>
              🔍 Shuffled & Randomized
            </span>
          </div>
          <h2 className="jarvis-text-glow" style={{ fontSize: "1.45rem", fontWeight: 800, marginTop: "0.2rem", color: "#a78bfa" }}>
            Fact Finder Challenge
          </h2>
          {team && (
            <p style={{ fontSize: "0.82rem", color: "#7dd3fc", marginTop: "0.1rem" }}>
              Team: <strong style={{ color: "#fff" }}>{team.teamName}</strong> ({team.teamCode})
            </p>
          )}
        </div>
        {isFinished ? (
          <button
            type="button"
            onClick={onBack}
            style={{ background: "transparent", border: "1px solid rgba(167,139,250,0.35)", color: "#a78bfa", padding: "0.5rem 1rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}
          >
            Exit Game
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.76rem", fontWeight: 700 }}>
            <Lock size={14} />
            <span>EXITS LOCKED WHILE PLAYING</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div>
          {/* Progress */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              <span style={{ color: "#7dd3fc" }}>
                Question {currentIndex + 1} of {shuffledFacts.length}
              </span>
              <span style={{ color: "#a78bfa", fontWeight: 800 }}>
                Score: {score} / {totalPossibleScore} Pts
              </span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${((currentIndex) / shuffledFacts.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
                transition: "width 0.4s ease"
              }} />
            </div>
          </div>

          {/* Question Card */}
          <div style={{ background: "rgba(3,7,18,0.9)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "20px", overflow: "hidden", marginBottom: "1.5rem" }}>
            {/* Question banner */}
            <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(99,102,241,0.1) 100%)", padding: "1.5rem 1.75rem", borderBottom: "1px solid rgba(167,139,250,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(167,139,250,0.2)", border: "1px solid #a78bfa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={20} color="#a78bfa" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Find the Real Fact</div>
                  <div style={{ fontSize: "0.75rem", color: "#7dd3fc" }}>
                    <span style={{ background: "rgba(167,139,250,0.2)", padding: "0.1rem 0.4rem", borderRadius: "4px", color: "#a78bfa", fontWeight: 700 }}>+{itemMarks} pts</span>
                    {" "}• {currentQ.category || "General Knowledge"}
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.4 }}>
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Lightbulb size={14} />
                <span>One of these is a REAL FACT — the other two are FAKE. Choose wisely!</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {currentOpts.map((opt, oIdx) => {
                  const chosen = userChoice !== null;
                  const isChosen = userChoice === oIdx;
                  const isRealOpt = opt.isReal;
                  const style = getOptionStyle(oIdx);

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleGuess(oIdx)}
                      disabled={userChoice !== null}
                      style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "14px",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        transition: "all 0.2s ease",
                        ...style
                      }}
                    >
                      {/* Option letter badge */}
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                        background: chosen
                          ? isRealOpt ? "rgba(16,185,129,0.3)" : (isChosen ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.05)")
                          : optionBgs[oIdx],
                        border: `1px solid ${chosen ? (isRealOpt ? "#10b981" : (isChosen ? "#ef4444" : "rgba(255,255,255,0.1)")) : optionBorders[oIdx]}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "0.85rem",
                        color: chosen ? (isRealOpt ? "#34d399" : (isChosen ? "#f87171" : "#64748b")) : optionColors[oIdx]
                      }}>
                        {chosen
                          ? (isRealOpt ? <CheckCircle2 size={16} /> : (isChosen ? <XCircle size={16} /> : String.fromCharCode(65 + oIdx)))
                          : String.fromCharCode(65 + oIdx)
                        }
                      </div>
                      <span style={{ lineHeight: 1.4 }}>{opt.text}</span>
                      {chosen && isRealOpt && (
                        <span style={{ marginLeft: "auto", flexShrink: 0, fontSize: "0.72rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "6px", background: "rgba(16,185,129,0.25)", color: "#34d399", border: "1px solid #10b981" }}>
                          ✓ REAL FACT
                        </span>
                      )}
                      {chosen && isChosen && !isRealOpt && (
                        <span style={{ marginLeft: "auto", flexShrink: 0, fontSize: "0.72rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "6px", background: "rgba(239,68,68,0.25)", color: "#f87171", border: "1px solid #ef4444" }}>
                          ✗ FAKE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result reveal */}
          {showReveal && (
            <div style={{
              padding: "1.25rem", borderRadius: "14px", marginBottom: "1.5rem",
              background: currentOpts[userChoice]?.isReal ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              border: `1px solid ${currentOpts[userChoice]?.isReal ? "#10b981" : "#ef4444"}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, fontSize: "1rem", marginBottom: "0.4rem", color: currentOpts[userChoice]?.isReal ? "#34d399" : "#f87171" }}>
                {currentOpts[userChoice]?.isReal ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span>
                  {currentOpts[userChoice]?.isReal ? `Correct! You found the real fact! (+${itemMarks} pts)` : "Incorrect! That was a fake fact."}
                </span>
              </div>
              {currentQ.explanation && (
                <div style={{ fontSize: "0.85rem", color: "#7dd3fc", lineHeight: 1.5 }}>
                  <strong style={{ color: "#94a3b8" }}>Explanation:</strong> {currentQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* Next button */}
          {userChoice !== null && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              style={{
                width: "100%", padding: "0.9rem",
                background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
                color: "#ffffff", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
              }}
            >
              <span>{currentIndex + 1 === shuffledFacts.length ? "View Final Results" : "Next Question"}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      ) : (
        /* Finished screen */
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(167,139,250,0.15)", border: "2px solid #a78bfa", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "#a78bfa" }}>
            <Trophy size={36} />
          </div>

          <h3 className="jarvis-text-glow" style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            Fact Finder Completed!
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#7dd3fc", marginBottom: "0.5rem" }}>
            You correctly identified <strong style={{ color: "#a78bfa" }}>{Math.round((score / totalPossibleScore) * shuffledFacts.length)}</strong> out of <strong>{shuffledFacts.length}</strong> real facts!
          </p>
          <p style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "1.75rem" }}>
            Final Score: <strong style={{ color: "#a78bfa", fontSize: "1.3rem" }}>{score}</strong> / {totalPossibleScore} points
          </p>

          {/* Score bar */}
          <div style={{ width: "100%", maxWidth: "420px", margin: "0 auto 2rem", background: "rgba(255,255,255,0.06)", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.round((score / totalPossibleScore) * 100)}%`,
              height: "100%",
              background: "linear-gradient(135deg, #a78bfa, #6366f1)",
              borderRadius: "8px",
              transition: "width 0.6s ease"
            }} />
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmitScore}
              style={{
                width: "100%", padding: "0.9rem",
                background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
                color: "#ffffff", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
              }}
            >
              <Award size={18} />
              <span>Submit Game 2 Score to Leaderboard</span>
            </button>
          ) : (
            <div>
              <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(167,139,250,0.15)", border: "1px solid #a78bfa", color: "#a78bfa", fontWeight: 700, marginBottom: "1.5rem" }}>
                ✓ Fact Finder Score Recorded on Global Scoreboard!
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={onBack}
                style={{
                  width: "100%", padding: "0.9rem",
                  background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
                  color: "#ffffff", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer"
                }}
              >
                Return to Student Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
