// src/pages/Logs.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Topbar from "./Topbar";

const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  textFaint: "rgba(255,255,255,0.55)",
  accent: "#3B82F6",
  btn: "#3B82F6",
  btnText: "#fff",
};

const activity = [
  { id: "1", user: "Admin101", action: "Login", timestamp: "2025-07-10 12:00" },
  { id: "2", user: "Admin102", action: "Create License", timestamp: "2023-07-10 11:30" },
  { id: "3", user: "Admin101", action: "Revoke License", timestamp: "2024-05-15 09:00" },
  { id: "4", user: "Admin103", action: "Login", timestamp: "2025-07-11 08:45" },
  { id: "5", user: "Admin104", action: "Create License", timestamp: "2025-06-01 14:00" },
  { id: "6", user: "Admin105", action: "Update Settings", timestamp: "2025-07-25 16:20" },
  { id: "7", user: "Admin106", action: "Add Client", timestamp: "2025-07-01 10:15" },
  { id: "8", user: "Admin102", action: "Delete Client", timestamp: "2025-07-28 13:00" },
  { id: "9", user: "Admin101", action: "Login", timestamp: "2025-07-29 08:00" },
  { id: "10", user: "Admin107", action: "Deactivate API Key", timestamp: "2025-07-20 11:55" },
];

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* Topbar แบบรวมศูนย์ */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  toolbar: { display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 10, alignItems: "center" },
  dropdown: {
    width: 140, padding: "6px 10px", borderRadius: 6, border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card, color: THEME.text, fontSize: 14, outline: "none",
    cursor: "pointer", appearance: "none",
  },
  exportButton: {
    backgroundColor: THEME.accent, color: THEME.btnText, padding: "8px 16px", border: "none",
    borderRadius: 6, cursor: "pointer", fontWeight: 700,
  },
  datePickerContainer: { position: "relative", display: "inline-block" },
  customDatePickerInput: {
    padding: "6px 10px", borderRadius: 6, border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card, color: THEME.text, width: "140px", outline: "none",
  },

  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  th: {
    color: THEME.textFaint, fontWeight: 700, padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.06)", textAlign: "left",
  },
  td: { padding: "16px 16px", color: THEME.textMut, fontWeight: 500, whiteSpace: "nowrap" },
};

/* Custom DatePicker input */
const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
  <button style={styles.customDatePickerInput} onClick={onClick} ref={ref}>
    {value || "Select a date"}
  </button>
));

export default function Logs() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  const [filters, setFilters] = useState({ user: "", action: "", date: null });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const filteredActivities = activity.filter((item) => {
    const userMatch = !appliedFilters.user || item.user === appliedFilters.user;
    const actionMatch = !appliedFilters.action || item.action === appliedFilters.action;
    let dateMatch = true;
    if (appliedFilters.date) {
      const itemDate = moment(item.timestamp, "YYYY-MM-DD HH:mm");
      const selectedDate = moment(appliedFilters.date);
      dateMatch = itemDate.isSameOrAfter(selectedDate, "day");
    }
    return userMatch && actionMatch && dateMatch;
  });

  const exportCSV = (data) => {
    const header = ["Timestamp", "User", "Action"];
    const rows = data.map((item) => [item.timestamp, item.user, item.action]);
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activity_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueUsers = ["", ...new Set(activity.map((a) => a.user))];
  const uniqueActions = ["", ...new Set(activity.map((a) => a.action))];

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (ใช้คอมโพเนนต์กลาง, ไม่มี panel กระดิ่งซ้ำ) */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search logs"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading & Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting")}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Logs</span>
          </div>

          {/* Filters */}
          <div style={styles.toolbar}>
            <select
              style={styles.dropdown}
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            >
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>{user || "All Users"}</option>
              ))}
            </select>

            <select
              style={styles.dropdown}
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              {uniqueActions.map((action) => (
                <option key={action} value={action}>{action || "All Actions"}</option>
              ))}
            </select>

            <DatePicker
              selected={filters.date}
              onChange={(date) => setFilters({ ...filters, date })}
              customInput={<CustomDatePickerInput />}
              dateFormat="yyyy-MM-dd"
              calendarClassName="dark-theme-calendar"
            />

            <button style={styles.exportButton} onClick={() => exportCSV(filteredActivities)}>
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div style={styles.tableWrap}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Time Stamp</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: THEME.card }}>
                {filteredActivities.map((item) => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${THEME.border}` }}>
                    <td style={styles.td}>{item.timestamp}</td>
                    <td style={styles.td}>{item.user}</td>
                    <td style={styles.td}>{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* (ออปชัน) ปรับสีปฏิทินเป็นโทนมืดให้เข้ากับธีม */}
          <style>{`
            .dark-theme-calendar.react-datepicker {
              background: #0E2240;
              border: 1px solid ${THEME.border};
              color: ${THEME.text};
            }
            .dark-theme-calendar .react-datepicker__header {
              background-color: #10294a;
              border-bottom: 1px solid ${THEME.border};
            }
            .dark-theme-calendar .react-datepicker__current-month,
            .dark-theme-calendar .react-datepicker__day-name {
              color: ${THEME.text};
              font-weight: 700;
            }
            .dark-theme-calendar .react-datepicker__day { color: ${THEME.text}; }
            .dark-theme-calendar .react-datepicker__day--selected,
            .dark-theme-calendar .react-datepicker__day--in-range,
            .dark-theme-calendar .react-datepicker__day--keyboard-selected {
              background-color: ${THEME.accent};
            }
            .dark-theme-calendar .react-datepicker__day:hover {
              background-color: rgba(59,130,246,0.4);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
