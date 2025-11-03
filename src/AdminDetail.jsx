// src/pages/AdminDetail.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";

/* THEME — Light */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.10)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  danger: "#DC2626",
};

/* STYLES (match InviteAdmin.jsx look & feel) */
const styles = {
  root: {
    display: "flex",
    minHeight: "1024px",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: {
    width: 1152,
    minHeight: 988,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
  },

  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 12 },

  card: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },
  sectionTitle: { color: THEME.text, fontWeight: 900, marginBottom: 12, opacity: 0.9 },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  col: { display: "flex", flexDirection: "column" },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "80%",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },

  selectWrap: { position: "relative", width: 220 },
  select: {
    width: "100%",
    appearance: "none",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 38px 10px 12px",
    fontWeight: 700,
    cursor: "not-allowed",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  caret: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnDanger: {
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.danger,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)",
  },
  btnGhost: {
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.text,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)",
  },
  readOnlyHint: { color: THEME.textFaint, fontSize: 12, marginTop: 6 },
};

export default function AdminDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /admin-users/:id

  // Mocked admin data (read-only view)
  const [form] = useState({
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "SmartClick",
    department: "CEO",
    role: "Admin",
  });

  // ถ้าไม่มี id ให้ย้อนกลับไป list
  if (!id) {
    navigate("/admin-users", { replace: true });
    return null;
  }

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
                onSearchChange={() => {}}
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
            &nbsp;&gt;&nbsp;<span style={{ color: "#3B82F6" }}>Admin Detail</span>
          </div>

          {/* Form Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Admin Detail</div>

            <div style={styles.row2}>
              <div style={styles.col}>
                <div style={styles.label}>First Name</div>
                <input value={form.firstName} readOnly style={styles.input} />
                <div style={styles.readOnlyHint}>This field is read-only.</div>
              </div>
              <div style={styles.col}>
                <div style={styles.label}>Last Name</div>
                <input value={form.lastName} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row2}>
              <div style={styles.col}>
                <div style={styles.label}>Email</div>
                <input value={form.email} readOnly style={styles.input} />
              </div>
              <div style={styles.col}>
                <div style={styles.label}>Phone</div>
                <input value={form.phone} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row2}>
              <div style={styles.col}>
                <div style={styles.label}>Company</div>
                <input value={form.company} readOnly style={styles.input} />
              </div>
              <div style={styles.col}>
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
              <div style={styles.col}>
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

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={styles.btnDanger}
                onClick={() => alert("Delete admin (mock)")}
              >
                Delete Admin
              </button>
              <button
                style={styles.btnGhost}
                onClick={() => navigate("/admin-users")}
              >
                Back to list
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
