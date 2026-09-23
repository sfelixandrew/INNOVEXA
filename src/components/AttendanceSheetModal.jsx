import React from "react";
import { X, Printer, Download, FileSpreadsheet, CheckCircle2, UserCheck } from "lucide-react";

export default function AttendanceSheetModal({ isOpen, onClose, leaderboardData }) {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "S.No,Team Name,Team Leader Name,Member Attendance Details,Overall Status,Registration Time\n";

    leaderboardData.forEach((team, idx) => {
      const sNo = idx + 1;
      const teamName = `"${team.teamName}"`;
      const leaderName = `"${team.leaderName || team.members[0] || 'N/A'}"`;
      const memAtt = team.memberAttendance || {};
      const memberDetails = team.members.map((m) => {
        const status = memAtt[m] || "Present";
        return `${m} (${status})`;
      }).join("; ");
      const members = `"${memberDetails}"`;
      const status = team.status || "Present";
      const regTime = team.registrationTime || "09:00 AM";

      csvContent += `${sNo},${teamName},${leaderName},${members},"${status}",${regTime}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Innovex_Event_Attendance_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "880px", padding: "2.25rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-dark)", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Official Event Attendance Sheet</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-dark-secondary)" }}>
                Verified per-member attendance (marked automatically after game completion).
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#34d399",
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: "var(--role-gradient)",
                border: "none",
                color: "#fff",
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Printer size={15} />
              <span>Print Sheet</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ background: "transparent", border: "none", color: "var(--text-dark-secondary)", cursor: "pointer", padding: "0.4rem" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", background: "rgba(255,255,255,0.03)", padding: "0.85rem 1.25rem", borderRadius: "12px", border: "1px solid var(--border-dark)" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dark-secondary)" }}>
            Total Verified Teams: <strong style={{ color: "#fff" }}>{leaderboardData.length} Teams</strong>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} /> Individual Member Status Sync Active
          </div>
        </div>

        {/* Printable Attendance Sheet Table */}
        <div style={{ overflowX: "auto", maxHeight: "440px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-dark)", color: "var(--text-dark-secondary)", fontSize: "0.78rem", textTransform: "uppercase", background: "rgba(15, 23, 42, 0.8)", sticky: "top" }}>
                <th style={{ padding: "0.85rem 0.6rem", width: "60px" }}>S.No</th>
                <th style={{ padding: "0.85rem 0.8rem" }}>Team Name</th>
                <th style={{ padding: "0.85rem 0.8rem" }}>Team Leader</th>
                <th style={{ padding: "0.85rem 0.8rem" }}>Per-Member Attendance</th>
                <th style={{ padding: "0.85rem 0.8rem", textAlign: "center" }}>Overall Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((t, idx) => {
                const memAtt = t.memberAttendance || {};
                const members = t.members || [];
                const presentCount = members.filter((m) => memAtt[m] === "Present").length;
                const isAllPresent = members.length > 0 && presentCount === members.length;
                const isPartial = presentCount > 0 && presentCount < members.length;
                const absentCount = members.length - presentCount;

                return (
                  <tr key={t.teamId || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "0.85rem 0.6rem", fontWeight: 700, color: "var(--text-dark-secondary)" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "0.85rem 0.8rem", fontWeight: 700, color: "#fff" }}>
                      {t.teamName} <span style={{ fontSize: "0.75rem", color: "var(--role-primary)", fontWeight: 600 }}>({t.teamCode})</span>
                    </td>
                    <td style={{ padding: "0.85rem 0.8rem", fontWeight: 700, color: "#818cf8" }}>
                      {t.leaderName || members[0] || "Team Leader"}
                    </td>
                    <td style={{ padding: "0.85rem 0.8rem", fontSize: "0.82rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {members.map((mName, mIdx) => {
                          const mStatus = memAtt[mName] || (presentCount === 0 ? "Pending" : "Absent");
                          const isMemPresent = mStatus === "Present";
                          const isMemAbsent = mStatus === "Absent";

                          return (
                            <div key={mIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                              <span style={{ color: "#fff", fontWeight: 600 }}>{mName}</span>
                              <span style={{
                                fontSize: "0.7rem", padding: "0.15rem 0.45rem", borderRadius: "5px",
                                background: isMemPresent ? "rgba(16, 185, 129, 0.18)" : isMemAbsent ? "rgba(239, 68, 68, 0.18)" : "rgba(251, 191, 36, 0.18)",
                                color: isMemPresent ? "#34d399" : isMemAbsent ? "#f87171" : "#fbbf24",
                                fontWeight: 700,
                                border: isMemPresent ? "1px solid rgba(16, 185, 129, 0.3)" : isMemAbsent ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(251, 191, 36, 0.3)"
                              }}>
                                {isMemPresent ? "Present ✓" : isMemAbsent ? "Absent ❌" : "Pending ⏳"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ padding: "0.85rem 0.8rem", textAlign: "center" }}>
                      <span style={{
                        fontSize: "0.75rem", padding: "0.3rem 0.7rem", borderRadius: "8px",
                        background: isAllPresent ? "rgba(16, 185, 129, 0.2)" : isPartial ? "rgba(251, 191, 36, 0.2)" : "rgba(239, 68, 68, 0.2)",
                        color: isAllPresent ? "#34d399" : isPartial ? "#fbbf24" : "#f87171",
                        fontWeight: 800,
                        border: isAllPresent ? "1px solid #10b981" : isPartial ? "1px solid #fbbf24" : "1px solid #ef4444"
                      }}>
                        {isAllPresent ? `ALL ${members.length} MEMBERS PRESENT ✓` : isPartial ? `${presentCount}/${members.length} PRESENT (${absentCount} ABSENT ❌)` : "ABSENT / PENDING ⏳"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
