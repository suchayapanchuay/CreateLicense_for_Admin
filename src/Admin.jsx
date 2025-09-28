// src/pages/AdminUsers.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

/* -------- THEME -------- */
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

/* -------- MOCK DATA (Admin Users) -------- */
const MOCK_ADMINS = [
  { id: 1, name: "Emma Johnson", email: "emma.j@example.com", role: "Administrator" },
  { id: 2, name: "Michael Smith", email: "michael.smith@example.com", role: "Editor" },
  { id: 3, name: "Sarah Brown", email: "sarah.b@example.com", role: "Viewer" },
  { id: 4, name: "James Wilson", email: "james.wilson@example.com", role: "Viewer" },
];

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* topbar row (Topbar only) */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 32, fontWeight: 900, color: THEME.text, margin: "20px 0" },

  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  selectWrap: { position: "relative" },
  select: { appearance: "none", background: THEME.card, color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "8px 40px 8px 12px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  selectCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textMut },

  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },

  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  header: { background: "rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "2fr 2.5fr 1.5fr 1fr", padding: "12px 16px", color: THEME.text, fontWeight: 700 },
  row: { display: "grid", gridTemplateColumns: "2fr 2.5fr 1.5fr 1fr", alignItems: "center", padding: "16px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text },

  eyeBtn: { width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },

  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer", background: "transparent", fontWeight: 600, fontSize: 16 },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 8, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800, border: `1px solid ${THEME.border}` },
};

export default function AdminUsers() {
  const navigate = useNavigate();

  // search state (controlled via Topbar)
  const [search, setSearch] = useState("");

  // filter admins by search
  const filtered = MOCK_ADMINS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  // Topbar search handler (prevents onSearchChange errors and feeds local state)
  const handleSearchChange = (q) => setSearch(q || "");

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (ใช้คอมโพเนนต์ Topbar เช่นเดียวกับ ProductDetail.jsx/Reports.jsx) */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search admin users"
                onSearchChange={handleSearchChange}
                defaultFilter="all"
                onViewAllPath="/Noti" // ถ้าต้องการปุ่ม View All ใน dropdown ของ Topbar
              />
            </div>
          </div>

          <div style={styles.title}>Admin Users & Roles</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div className="left">
              <div style={styles.selectWrap}>
                <select style={styles.select}>
                  <option value="all">All</option>
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <FiChevronDown style={styles.selectCaret} />
              </div>
            </div>

            <button style={styles.btnPrimary} onClick={() => navigate("/admin-users/add")}>
              + Invite Admin
            </button>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Actions</div>
            </div>

            {filtered.map((a) => (
              <div key={a.id} style={styles.row}>
                <div>{a.name}</div>
                <div>{a.email}</div>
                <div>{a.role}</div>
                <div>
                  <button style={styles.eyeBtn} onClick={() => navigate(`/admin-users/:id`)}>
                    <FiEye />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
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
