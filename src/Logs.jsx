// src/pages/Logs.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./SideBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Topbar from "./Topbar";
import { listActivityLogs } from "../src/lib/api"; 

/* THEME — Light (ให้กลมกับหน้าอื่น) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.10)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  goodBg: "#DCFCE7",
  goodText: "#065F46",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",
};

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: {
    width: 1152,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
  },

  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 18 },

  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
    gap: 10,
    alignItems: "center",
  },
  dropdown: {
    width: 180,
    padding: "8px 10px",
    borderRadius: 10,
    border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card,
    color: THEME.text,
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  exportButton: {
    backgroundColor: THEME.accent,
    color: "#fff",
    padding: "10px 14px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "0 6px 14px rgba(37,99,235,.25)",
  },
  customDatePickerInput: {
    padding: "8px 10px",
    borderRadius: 10,
    border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card,
    color: THEME.text,
    width: 160,
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    cursor: "pointer",
    textAlign: "left",
  },

  tableWrap: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },
  thRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1.6fr",
    background: "#FAFBFF",
    borderBottom: `1px solid ${THEME.border}`,
  },
  th: {
    color: THEME.text,
    fontWeight: 800,
    padding: "12px 16px",
    textAlign: "left",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1.6fr",
    alignItems: "center",
    borderTop: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
  },
  td: {
    padding: "14px 16px",
    color: THEME.textMut,
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

/* Custom DatePicker input */
const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
  <button style={styles.customDatePickerInput} onClick={onClick} ref={ref}>
    {value || "Select a date"}
  </button>
));

export default function Logs() {
  const onSearchNoop = () => {};

  // filters = { user: actor, action, date(start-from) }
  const [filters, setFilters] = useState({ user: "", action: "", date: null });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลทุกครั้งที่ filter เปลี่ยน (ยิงไปกรองที่ backend)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.user) params.user = filters.user;
        if (filters.action) params.action = filters.action;
        if (filters.date) params.since = moment(filters.date).startOf("day").toISOString(); // ISO

        const data = await listActivityLogs(params); // [{id, actor, action, message, created_at, ...}]
        setLogs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters.user, filters.action, filters.date]);

  // ทำรายการ users/actions จากข้อมูลล่าสุดที่ดึงมา
  const uniqueUsers = useMemo(
    () => ["", ...Array.from(new Set(logs.map((l) => l.actor).filter(Boolean)))],
    [logs]
  );
  const uniqueActions = useMemo(
    () => ["", ...Array.from(new Set(logs.map((l) => l.action).filter(Boolean)))],
    [logs]
  );

  const exportCSV = (data) => {
    const header = ["Timestamp", "User", "Action", "Message"];
    const rows = data.map((i) => [
      i.created_at ? moment(i.created_at).format("YYYY-MM-DD HH:mm") : "",
      i.actor ?? "",
      i.action ?? "",
      (i.message ?? "").replace(/[\r\n,]+/g, " "), // กัน CSV พัง
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "activity_logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
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
            <span>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ color: THEME.accent }}>Logs</span>
          </div>

          {/* Filters */}
          <div style={styles.toolbar}>
            <select
              style={styles.dropdown}
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            >
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user || "All Users"}
                </option>
              ))}
            </select>

            <select
              style={styles.dropdown}
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action || "All Actions"}
                </option>
              ))}
            </select>

            <DatePicker
              selected={filters.date}
              onChange={(date) => setFilters({ ...filters, date })}
              customInput={<CustomDatePickerInput />}
              dateFormat="yyyy-MM-dd"
            />

            <button style={styles.exportButton} onClick={() => exportCSV(logs)}>
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div style={styles.tableWrap}>
            <div style={styles.thRow}>
              <div style={styles.th}>Time Stamp</div>
              <div style={styles.th}>User</div>
              <div style={styles.th}>Action</div>
            </div>

            {loading && (
              <div style={{ padding: 16, color: THEME.textFaint }}>Loading…</div>
            )}

            {!loading &&
              logs.map((item) => (
                <div key={item.id} style={styles.row}>
                  <div style={styles.td}>
                    {item.created_at
                      ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </div>
                  <div style={styles.td}>{item.actor || "-"}</div>
                  <div style={styles.td}>
                    {item.action || "-"}
                    {item.message ? ` – ${item.message}` : ""}
                  </div>
                </div>
              ))}

            {!loading && !logs.length && (
              <div style={{ padding: 16, color: THEME.textFaint }}>No logs found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
