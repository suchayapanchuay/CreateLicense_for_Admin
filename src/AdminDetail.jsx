// src/pages/AdminDetail.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

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

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24 },

  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },
  sectionTitle: { color: "#99C1FF", fontWeight: 800, marginBottom: 12 },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  col: { display: "flex", flexDirection: "column" },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: { width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none" },

  selectWrap: { position: "relative", width: 180 },
  select: { width: "100%", appearance: "none", background: "rgba(255,255,255,0.08)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 34px 10px 12px", fontWeight: 700 },
  caret: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint },

  credBox: { border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16, marginTop: 12 },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: { border: "none", padding: "8px 10px", fontWeight: 700, borderRadius: 8, cursor: "pointer" },
  smallBtnBlue: { background: "#52B1E6", color: "#062033" },
  smallBtnGreen: { background: "#3DD9B0", color: "#062033" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDanger: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: "#E26D64" },
};

export default function AdminDetail() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  /* Mocked admin data */
  const [form] = useState({
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "SmartClick",
    department: "CEO",
    role: "Admin",
    username: "User101",
    password: "U12S36",
  });

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search admin"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading */}
          <div style={styles.title}>Admin Users & Roles</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/admin-users")}>
              Admin Users & Roles
            </span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Admin Detail</span>
          </div>

          {/* Form Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Invite Admin User</div>

            <div style={styles.row2}>
              <div className={styles.col}>
                <div style={styles.label}>First Name</div>
                <input value={form.firstName} readOnly style={styles.input} />
              </div>
              <div className={styles.col}>
                <div style={styles.label}>Last Name</div>
                <input value={form.lastName} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row2}>
              <div className={styles.col}>
                <div style={styles.label}>Email</div>
                <input value={form.email} readOnly style={styles.input} />
              </div>
              <div className={styles.col}>
                <div style={styles.label}>Phone</div>
                <input value={form.phone} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row2}>
              <div>
                <div style={styles.label}>Company</div>
                <input value={form.company} readOnly style={styles.input} />
              </div>
              <div>
                <div style={styles.label}>Role</div>
                <div style={styles.selectWrap}>
                  <select value={form.role} disabled style={styles.select}>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>

            <div style={styles.row2}>
              <div>
                <div style={styles.label}>Department</div>
                <div style={styles.selectWrap}>
                  <select value={form.department} disabled style={styles.select}>
                    <option>CEO</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>IT</option>
                    <option>Operations</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
              <div />
            </div>

            <div style={styles.credBox}>
              <div style={styles.row2}>
                <div>
                  <div style={styles.label}>Username</div>
                  <input value={form.username} readOnly style={styles.input} />
                </div>
                <div>
                  <div style={styles.label}>Password</div>
                  <input value={form.password} readOnly style={styles.input} />
                </div>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={() => navigate("/admin-users/edit/:id")}>
                Edit Admin
              </button>
              <button style={styles.btnDanger} onClick={() => alert("Delete admin (mock)")}>
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
