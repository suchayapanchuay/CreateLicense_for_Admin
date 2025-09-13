import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/* THEME */
const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  textFaint: "rgba(255,255,255,0.55)",
  accent: "#3B82F6",
};

/* MOCK DATA */
const MOCK_NOTIS = [
  {
    id: 1,
    type: "Trial Request",
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "BlankSpace",
    industry: "Software Engineer",
    country: "Thailand",
    message: "Please contact us within this month.",
  },
  {
    id: 2,
    type: "Purchase Request",
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "BlankSpace",
    industry: "Software Engineer",
    country: "Thailand",
    message: "Please contact us within this month.",
  },
];

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* topbar */
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 16px" },

  filterWrap: { position: "relative", display: "inline-block", marginBottom: 20 },
  filterSelect: {
    appearance: "none",
    background: THEME.card,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "8px 36px 8px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  filterCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textMut },

  notiCard: { border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16, marginBottom: 20, background: THEME.card },
  typeTitle: { fontSize: 16, fontWeight: 800, marginBottom: 12, color: THEME.accent },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 4 },
  pill: { background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: THEME.text },

  btnPrimary: { borderRadius: 8, padding: "8px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff", marginTop: 8 },

  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer" },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 8, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800, border: `1px solid ${THEME.border}` },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filteredNotis = MOCK_NOTIS.filter((n) => {
    if (filter === "all") return true;
    if (filter === "trial") return n.type.toLowerCase().includes("trial");
    if (filter === "purchase") return n.type.toLowerCase().includes("purchase");
    return true;
  });

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
            <IoMdNotificationsOutline size={24} color={THEME.text} />
          </div>

          {/* Heading */}
          <div style={styles.title}>Notifications</div>

          {/* Filter */}
          <div style={styles.filterWrap}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
              <option value="all">All</option>
              <option value="trial">Trial</option>
              <option value="purchase">Purchase</option>
            </select>
            <FiChevronDown style={styles.filterCaret} />
          </div>

          {/* Notification cards */}
          {filteredNotis.map((n) => (
            <div key={n.id} style={styles.notiCard}>
              <div style={styles.typeTitle}>{n.type}</div>

              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>First Name</div>
                  <div style={styles.pill}>{n.firstName}</div>
                </div>
                <div>
                  <div style={styles.label}>Last Name</div>
                  <div style={styles.pill}>{n.lastName}</div>
                </div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>Email</div>
                  <div style={styles.pill}>{n.email}</div>
                </div>
                <div>
                  <div style={styles.label}>Phone</div>
                  <div style={styles.pill}>{n.phone}</div>
                </div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>Company</div>
                  <div style={styles.pill}>{n.company}</div>
                </div>
                <div>
                  <div style={styles.label}>Industry</div>
                  <div style={styles.pill}>{n.industry}</div>
                </div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>Country</div>
                  <div style={styles.pill}>{n.country}</div>
                </div>
                <div>
                  <div style={styles.label}>Message</div>
                  <div style={styles.pill}>{n.message}</div>
                </div>
              </div>

              <button style={styles.btnPrimary} onClick={() => navigate("/client/add")}>Create Client</button>
            </div>
          ))}

          {/* Pagination */}
          <div style={styles.pagination}>
            <div style={styles.pageBtn}>‹</div>
            <div style={styles.pageCurrent}>1</div>
            <div style={styles.pageBtn}>›</div>
          </div>
        </div>
      </div>
    </div>
  );
}
