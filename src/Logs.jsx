import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

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

/* MOCK NOTIFICATIONS */
const NOTI_ITEMS = [
  { id: 1, type: "trial", title: "Trial Request", client: "Client A", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 2, type: "trial", title: "Trial Request", client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 7, read: true },
  { id: 3, type: "purchase", title: "Purchase Request", client: "Client C", product: "Smart Audit", requested: "31 Aug 2025", read: false },
];

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

  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  toolbar: { display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 10, alignItems: 'center' },
  dropdown: {
    width: 140, padding: "6px 10px", borderRadius: 6, border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card, color: THEME.text, fontSize: 14, outline: "none",
    cursor: "pointer", appearance: "none",
  },
  exportButton: {
    backgroundColor: THEME.accent, color: THEME.btnText, padding: "8px 16px", border: "none",
    borderRadius: 6, cursor: "pointer", fontWeight: 700,
  },
  datePickerContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  customDatePickerInput: {
    padding: "6px 10px",
    borderRadius: 6,
    border: `1px solid ${THEME.border}`,
    backgroundColor: THEME.card,
    color: THEME.text,
    width: '140px',
    outline: 'none',
  },

  tableWrap: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 12px", marginTop: 20 },
  thead: { textAlign: "left" },
  th: {
    color: THEME.textFaint, fontWeight: 700, padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.06)",
  },
  tbody: {},
  tr: { background: THEME.card, borderRadius: 12, border: `1px solid ${THEME.border}` },
  td: { padding: "16px 16px", color: THEME.textMut, fontWeight: 500, whiteSpace: "nowrap" },
  
  /* Notifications */
  notiPanelWrap: { position: "absolute", top: 90, right: 36, width: 560, background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`, fontWeight: 900, fontSize: 22 },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: { appearance: "none", background: "#183154", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  selectCaretNoti: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${THEME.border}` },
  notiBadge: { fontSize: 13, color: THEME.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: THEME.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 6, color: THEME.textFaint, fontSize: 14, marginTop: 8 },
  notiBtn: { marginTop: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer", borderTop: `1px solid ${THEME.border}` },
};

export default function Logs() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef(null);
  const [notiFilter, setNotiFilter] = useState("all");
  
  const [filters, setFilters] = useState({ user: "", action: "", date: null });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

  useEffect(() => {
    const onClick = (e) => { if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false); };
    const onEsc = (e) => { if (e.key === "Escape") setShowNoti(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const filteredNoti = NOTI_ITEMS.filter((n) => {
    if (notiFilter === "all") return true;
    if (notiFilter === "unread") return !n.read;
    if (notiFilter === "trial") return n.type === "trial";
    if (notiFilter === "purchase") return n.type === "purchase";
    return true;
  });

  const filteredActivities = activity.filter((item) => {
    const userMatch = !appliedFilters.user || item.user === appliedFilters.user;
    const actionMatch = !appliedFilters.action || item.action === appliedFilters.action;
    let dateMatch = true;
    if (appliedFilters.date) {
      const itemDate = moment(item.timestamp, "YYYY-MM-DD HH:mm");
      const selectedDate = moment(appliedFilters.date);
      dateMatch = itemDate.isSameOrAfter(selectedDate, 'day');
    }
    return userMatch && actionMatch && dateMatch;
  });

  const exportCSV = (data) => {
    const header = ["Timestamp", "User", "Action"];
    const rows = data.map((item) => [item.timestamp, item.user, item.action]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [header, ...rows].map((e) => e.join(",")).join("\n");
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
          {/* Topbar */}
          <div style={styles.topbar}>
            <div style={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search" style={styles.searchInput} />
            </div>
            <div onClick={() => setShowNoti((v) => !v)} style={{ cursor: "pointer" }}>
              <IoMdNotificationsOutline size={24} color={THEME.text} />
            </div>
          </div>

          {/* Notifications Panel */}
          {showNoti && (
            <div style={styles.notiPanelWrap} ref={notiRef}>
              <div style={styles.notiHead}>
                <span>Notifications ({NOTI_ITEMS.length})</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={styles.notiSelectWrap}>
                    <select value={notiFilter} onChange={(e) => setNotiFilter(e.target.value)} style={styles.notiSelect}>
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="trial">Trial</option>
                      <option value="purchase">Purchase</option>
                    </select>
                    <FiChevronDown style={styles.selectCaretNoti} />
                  </div>
                  <IoClose size={22} onClick={() => setShowNoti(false)} style={styles.notiClose} />
                </div>
              </div>
              <div style={styles.notiList}>
                {filteredNoti.map((n) => (
                  <div key={n.id} style={styles.notiItem}>
                    <div style={styles.notiBadge}>{n.title}</div>
                    <div style={styles.notiClient}>{n.client}</div>
                    <div style={styles.notiMetaRow}>
                      <span><strong style={{ color: THEME.textFaint }}>Product:</strong> {n.product}</span>
                      {n.durationDays ? <span><strong style={{ color: THEME.textFaint }}>Duration:</strong> {n.durationDays} days</span> : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested:</strong> {n.requested}</span>
                      <span />
                    </div>
                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
                <div style={{ height: 120, borderBottom: `1px solid ${THEME.border}` }} />
              </div>
              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>View All</div>
            </div>
          )}

          {/* Heading and Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting")}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Logs</span>
          </div>

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

          <div style={styles.tableWrap}>
            <table style={{width: "100%", borderCollapse: "separate", borderSpacing: "0 12px"}}>
              <thead style={{textAlign: "left"}}>
                <tr>
                  <th style={styles.th}>Time Stamp</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody style={{background: THEME.card}}>
                {filteredActivities.map((item, index) => (
                  <tr key={index} style={{borderTop: `1px solid ${THEME.border}`}}>
                    <td style={styles.td}>{item.timestamp}</td>
                    <td style={styles.td}>{item.user}</td>
                    <td style={styles.td}>{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
  <button style={styles.customDatePickerInput} onClick={onClick} ref={ref}>
    {value || "Select a date"}
  </button>
));