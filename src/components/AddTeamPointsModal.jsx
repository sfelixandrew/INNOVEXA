import React, { useState } from "react";
import * as XLSX from "xlsx";
import { 
  FileSpreadsheet, Upload, Plus, Download, CheckCircle2, 
  AlertCircle, X, Sparkles, Trophy, RefreshCw, FileText, Layers 
} from "lucide-react";

export default function AddTeamPointsModal({
  isOpen,
  onClose,
  leaderboardData = [],
  onImportPoints,
  onManualAddPoints
}) {
  const [activeTab, setActiveTab] = useState("excel"); // 'excel' | 'manual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [matchPreview, setMatchPreview] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [importMode, setImportMode] = useState("add"); // 'add' (Add to total) | 'set' (Set as absolute score)

  // Manual point state
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [manualPoints, setManualPoints] = useState(25);
  const [manualNote, setManualNote] = useState("Bonus Points");

  if (!isOpen) return null;

  // 1. Download Excel Template for Admin
  const handleDownloadTemplate = () => {
    const templateData = [
      { "Team Name": "Cyber Knights", "Points": 50, "Notes": "Round 1 Bonus" },
      { "Team Name": "Quantum Lynx", "Points": 75, "Notes": "Innovation Award" },
      { "Team Name": "Vortex Hackers", "Points": 40, "Notes": "Speed Completion" },
      { "Team Name": "Jarvis Alpha", "Points": 100, "Notes": "Master Challenge" }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Team_Points");

    // Auto fit column widths
    worksheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 25 }];

    XLSX.writeFile(workbook, "INNOVEXA-JARVIS_Team_Points_Template.xlsx");
  };

  // 2. Export Current Leaderboard as Excel
  const handleExportCurrentLeaderboard = () => {
    const exportData = leaderboardData.map((t, idx) => ({
      "Rank": idx + 1,
      "Team Name": t.teamName,
      "Team Code": t.teamCode,
      "Leader Name": t.leaderName || (t.members && t.members[0]) || "N/A",
      "Members": Array.isArray(t.members) ? t.members.join(", ") : t.members,
      "Abbrev Quiz Score": t.abbrevScore || 0,
      "Fact Finder Score": t.imageScore || 0,
      "Bonus Points": t.bonusScore || 0,
      "Total Points": t.totalScore || 0,
      "Status": t.status || "Active"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event_Leaderboard_Scores");

    XLSX.writeFile(workbook, `INNOVEXA-JARVIS_Leaderboard_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // 3. Process Uploaded Excel / CSV File
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError("");
    setMatchPreview([]);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rawJson.length === 0) {
          setUploadError("The uploaded Excel file appears to be empty.");
          return;
        }

        // Map & match rows against team names
        const matches = [];

        rawJson.forEach((row, idx) => {
          // Find team name column (handles variants like Team Name, Team, TeamName, Name)
          const teamNameKey = Object.keys(row).find(
            (k) => /team.*name|team|teamname|name/i.test(k)
          );
          // Find points column (handles variants like Points, Score, Bonus, AddedPoints)
          const pointsKey = Object.keys(row).find(
            (k) => /point|score|bonus|pts/i.test(k)
          );

          const teamNameVal = teamNameKey ? String(row[teamNameKey]).trim() : "";
          const pointsVal = pointsKey ? Number(row[pointsKey]) || 0 : 0;

          if (teamNameVal) {
            // Find existing team match
            const matchedTeam = leaderboardData.find(
              (t) => t.teamName.trim().toLowerCase() === teamNameVal.toLowerCase()
            );

            const currentTotal = matchedTeam ? (matchedTeam.totalScore || 0) : 0;
            const newTotal = importMode === "set" ? pointsVal : currentTotal + pointsVal;

            matches.push({
              rowNum: idx + 2,
              inputTeamName: teamNameVal,
              pointsToAdd: pointsVal,
              matchedTeam: matchedTeam ? matchedTeam.teamName : null,
              teamCode: matchedTeam ? matchedTeam.teamCode : "NEW TEAM",
              currentTotal,
              newTotal,
              isMatched: !!matchedTeam
            });
          }
        });

        if (matches.length === 0) {
          setUploadError("Could not find valid 'Team Name' and 'Points' columns in the Excel file. Please download our official template.");
          return;
        }

        setMatchPreview(matches);
      } catch (err) {
        setUploadError("Failed to parse Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Confirm Excel Import
  const handleConfirmImport = () => {
    if (matchPreview.length === 0) return;

    const importPayload = matchPreview.map((item) => ({
      teamName: item.inputTeamName,
      points: item.pointsToAdd,
      mode: importMode
    }));

    onImportPoints(importPayload);
    onClose();
  };

  // Confirm Manual Points
  const handleConfirmManual = (e) => {
    e.preventDefault();
    if (!selectedTeamName) {
      alert("Please select or enter a Team Name.");
      return;
    }

    onImportPoints([
      {
        teamName: selectedTeamName,
        points: Number(manualPoints) || 0,
        mode: importMode
      }
    ]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content glass-card jarvis-hud-card" 
        style={{ maxWidth: "680px", width: "100%", padding: "2rem", color: "#f8fafc" }}
      >
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "radial-gradient(circle, #00f0ff 0%, #0284c7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)", color: "#030712"
            }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="jarvis-text-glow" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                ADMIN TEAM POINTS MANAGEMENT
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc" }}>
                Add points by matching Team Names from Excel/CSV file or manual bonus
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(15, 23, 42, 0.6)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(0, 240, 255, 0.2)" }}>
          <button
            type="button"
            className={`role-tab-btn ${activeTab === "excel" ? "active" : ""}`}
            onClick={() => setActiveTab("excel")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", fontSize: "0.85rem" }}
          >
            <FileSpreadsheet size={16} />
            <span>Excel / CSV File Import</span>
          </button>

          <button
            type="button"
            className={`role-tab-btn ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => setActiveTab("manual")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", fontSize: "0.85rem" }}
          >
            <Plus size={16} />
            <span>Manual Team Points</span>
          </button>
        </div>

        {/* TAB 1: EXCEL / CSV IMPORT */}
        {activeTab === "excel" && (
          <div>
            {/* Download Template & Export Buttons Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 0.9rem", borderRadius: "10px",
                  background: "rgba(0, 240, 255, 0.12)", border: "1px solid #00f0ff",
                  color: "#00f0ff", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer"
                }}
              >
                <Download size={15} />
                <span>Download Sample Excel Template</span>
              </button>

              <button
                type="button"
                onClick={handleExportCurrentLeaderboard}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 0.9rem", borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.12)", border: "1px solid #38bdf8",
                  color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer"
                }}
              >
                <FileText size={15} />
                <span>Export Current Scores Excel</span>
              </button>
            </div>

            {/* Import Mode Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem", fontSize: "0.85rem", background: "rgba(255,255,255,0.03)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px dashed rgba(0,240,255,0.2)" }}>
              <span style={{ color: "#7dd3fc", fontWeight: 600 }}>Points Logic:</span>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="importMode"
                  value="add"
                  checked={importMode === "add"}
                  onChange={() => setImportMode("add")}
                  style={{ accentColor: "#00f0ff" }}
                />
                <span>Add Points to Existing Total</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="importMode"
                  value="set"
                  checked={importMode === "set"}
                  onChange={() => setImportMode("set")}
                  style={{ accentColor: "#00f0ff" }}
                />
                <span>Set as Absolute Score</span>
              </label>
            </div>

            {/* Drop File Container */}
            <div style={{
              border: "2px dashed rgba(0, 240, 255, 0.4)", borderRadius: "16px",
              padding: "2rem 1.5rem", textAlign: "center", background: "rgba(3, 7, 18, 0.6)",
              marginBottom: "1.25rem", cursor: "pointer", position: "relative"
            }}>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                style={{
                  position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%"
                }}
              />
              <Upload size={36} color="#00f0ff" style={{ margin: "0 auto 0.75rem" }} />
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0fdf4" }}>
                {selectedFile ? selectedFile.name : "Click or Drag & Drop Excel / CSV File Here"}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#7dd3fc", marginTop: "0.25rem" }}>
                Supports .xlsx, .xls, .csv containing columns "Team Name" and "Points"
              </p>
            </div>

            {uploadError && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", fontSize: "0.82rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Matched Teams Preview */}
            {matchPreview.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 700, color: "#00f0ff" }}>
                    Excel Parsed Preview ({matchPreview.length} teams found)
                  </span>
                  <span style={{ color: "#34d399", fontSize: "0.78rem" }}>
                    ✓ {matchPreview.filter(m => m.isMatched).length} Matched Existing • +{matchPreview.filter(m => !m.isMatched).length} New Teams
                  </span>
                </div>

                <div style={{ maxHeight: "200px", overflowY: "auto", borderRadius: "12px", border: "1px solid rgba(0, 240, 255, 0.2)", background: "rgba(8, 14, 28, 0.9)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(0, 240, 255, 0.1)", color: "#7dd3fc", borderBottom: "1px solid rgba(0, 240, 255, 0.2)" }}>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Row</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Excel Team Name</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Points to Add</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Status</th>
                        <th style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>New Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchPreview.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#94a3b8" }}>#{item.rowNum}</td>
                          <td style={{ padding: "0.5rem 0.75rem", fontWeight: 700, color: "#fff" }}>{item.inputTeamName}</td>
                          <td style={{ padding: "0.5rem 0.75rem", fontWeight: 700, color: "#00f0ff" }}>+{item.pointsToAdd} Pts</td>
                          <td style={{ padding: "0.5rem 0.75rem" }}>
                            {item.isMatched ? (
                              <span style={{ color: "#34d399", fontSize: "0.75rem", fontWeight: 600 }}>✓ Matched ({item.teamCode})</span>
                            ) : (
                              <span style={{ color: "#fbbf24", fontSize: "0.75rem", fontWeight: 600 }}>+ Will Create Team</span>
                            )}
                          </td>
                          <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontWeight: 800, color: "#fbbf24" }}>
                            {item.newTotal} Pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              disabled={matchPreview.length === 0}
              onClick={handleConfirmImport}
              style={{
                width: "100%", padding: "0.85rem",
                background: matchPreview.length > 0 ? "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)" : "rgba(255,255,255,0.1)",
                color: matchPreview.length > 0 ? "#030712" : "#94a3b8",
                fontWeight: 800, borderRadius: "12px", border: "none", cursor: matchPreview.length > 0 ? "pointer" : "not-allowed"
              }}
            >
              Apply Excel Points to Teams ({matchPreview.length} Teams)
            </button>
          </div>
        )}

        {/* TAB 2: MANUAL POINTS */}
        {activeTab === "manual" && (
          <form onSubmit={handleConfirmManual}>
            <div className="form-group">
              <label className="form-label">Select Target Team</label>
              {leaderboardData.length > 0 ? (
                <select
                  className="form-input"
                  value={selectedTeamName}
                  onChange={(e) => setSelectedTeamName(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">-- Choose Existing Team --</option>
                  {leaderboardData.map((t) => (
                    <option key={t.teamId} value={t.teamName}>
                      {t.teamName} ({t.teamCode}) — Current: {t.totalScore || 0} Pts
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Team Name..."
                  value={selectedTeamName}
                  onChange={(e) => setSelectedTeamName(e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Points to Add / Adjust</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {[10, 25, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setManualPoints(val)}
                    style={{
                      flex: 1, padding: "0.5rem", borderRadius: "8px",
                      background: manualPoints === val ? "#00f0ff" : "rgba(0, 240, 255, 0.1)",
                      color: manualPoints === val ? "#030712" : "#00f0ff",
                      border: "1px solid #00f0ff", fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    +{val} Pts
                  </button>
                ))}
              </div>

              <input
                type="number"
                className="form-input"
                placeholder="Enter custom points amount..."
                value={manualPoints}
                onChange={(e) => setManualPoints(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Note / Award Reason</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Special Quiz Bonus, Rapid Round Winner"
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)",
                color: "#030712", fontWeight: 800, borderRadius: "12px", border: "none", cursor: "pointer"
              }}
            >
              Add {manualPoints} Points to {selectedTeamName || "Selected Team"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
