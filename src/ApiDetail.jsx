// src/pages/InviteAdmin.jsx
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
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* topbar row (Topbar only) */
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
  select: { width: "100%", appearance: "none", background: "rgba(255,255,255,0.08)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 34px 10px 12px", fontWeight: 700, cursor: "pointer" },
  caret: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  credBox: { border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16, marginTop: 12 },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: { border: "none", padding: "8px 10px", fontWeight: 700, borderRadius: 8, cursor: "pointer" },
  smallBtnBlue: { background: "#52B1E6", color: "#062033" },
  smallBtnGreen: { background: "#3DD9B0", color: "#062033" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: "#E26D64" },
};

export default function InviteAdmin() {
  const navigate = useNavigate();

  // ใช้ Topbar เหมือนหน้าที่รีแฟกเตอร์อื่น ๆ และกัน onSearchChange error
  const onSearchNoop = () => {};

  /* Form state */
  const [form, setForm] = useState({
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
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const randomUsername = () => {
    const base = ["User", "Admin", "Acct", "Ops", "Mgr"];
    const name = base[Math.floor(Math.random() * base.length)] + (100 + Math.floor(Math.random() * 900));
    patch("username", name);
  };
  const randomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pw = "";
    for (let i = 0; i < 6; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    patch("password", pw);
  };

  const onInvite = () => {
    console.log("Invite Admin (mock) →", form);
    alert("Invitation sent (mock). ดู payload ใน console");
  };

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (แทนที่ search + กระดิ่งเดิมทั้งหมด) */}
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
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/admin-users")}>Admin Users & Roles</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Invite Admin</span>
          </div>

          {/* Form Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Invite Admin User</div>

            {/* Name / Email */}
            <div style={styles.row2}>
              <div className={styles.col}>
                <div style={styles.label}>First Name</div>
                <input value={form.firstName} onChange={(e) => patch("firstName", e.target.value)} style={styles.input} />
              </div>
              <div className={styles.col}>
                <div style={styles.label}>Last Name</div>
                <input value={form.lastName} onChange={(e) => patch("lastName", e.target.value)} style={styles.input} />
              </div>
            </div>
            <div style={styles.row2}>
              <div className={styles.col}>
                <div style={styles.label}>Email</div>
                <input value={form.email} onChange={(e) => patch("email", e.target.value)} style={styles.input} />
              </div>
              <div className={styles.col}>
                <div style={styles.label}>Phone</div>
                <input value={form.phone} onChange={(e) => patch("phone", e.target.value)} style={styles.input} />
              </div>
            </div>

            {/* Company / Role */}
            <div style={styles.row2}>
              <div>
                <div style={styles.label}>Company</div>
                <input value={form.company} onChange={(e) => patch("company", e.target.value)} style={styles.input} />
              </div>
              <div>
                <div style={styles.label}>Role</div>
                <div style={styles.selectWrap}>
                  <select value={form.role} onChange={(e) => patch("role", e.target.value)} style={styles.select}>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>

            {/* Department */}
            <div style={styles.row2}>
              <div>
                <div style={styles.label}>Department</div>
                <div style={styles.selectWrap}>
                  <select value={form.department} onChange={(e) => patch("department", e.target.value)} style={styles.select}>
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

            {/* Credentials */}
            <div style={styles.credBox}>
              <div style={styles.row2}>
                <div>
                  <div style={styles.label}>Username</div>
                  <div style={styles.inline}>
                    <input value={form.username} onChange={(e) => patch("username", e.target.value)} style={styles.input} />
                    <button style={{ ...styles.smallBtn, ...styles.smallBtnBlue }} onClick={randomUsername}>Random Username</button>
                  </div>
                </div>
                <div>
                  <div style={styles.label}>Password</div>
                  <div style={styles.inline}>
                    <input value={form.password} onChange={(e) => patch("password", e.target.value)} style={styles.input} />
                    <button style={{ ...styles.smallBtn, ...styles.smallBtnGreen }} onClick={randomPassword}>Random Password</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onInvite}>Invite Admin</button>
              <button style={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
