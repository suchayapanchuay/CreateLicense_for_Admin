// src/pages/EmailTemplate.jsx
import React from "react";
import Sidebar from "./SideBar";
import { IoPencilOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  accent: "#3B82F6",
  btn: "#3B82F6",
  btnText: "#fff",
};

/* MOCK EMAIL TEMPLATE DATA */
const TEMPLATES = [
  { id: 1, name: "License Expiry", subject: "Your License Will Expire Soon", lastUpdated: "2025-08-28", status: "Active" },
  { id: 2, name: "Welcome Email", subject: "Welcome to Smart Audit", lastUpdated: "2025-08-20", status: "Draft" },
  { id: 3, name: "Password Reset", subject: "Reset Your Password", lastUpdated: "2025-08-20", status: "Disabled" },
];

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* Topbar */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  btn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", border: "none" },
  btnPrimary: { background: THEME.accent, color: THEME.btnText },

  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden", marginTop: 20 },
  header: {
    background: "rgba(255, 255, 255, 0.06)",
    display: "grid",
    gridTemplateColumns: "2.6fr 3fr 2fr 1.2fr 1fr",
    padding: "12px 16px",
    color: THEME.text,
    fontWeight: 700,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.6fr 3fr 2fr 1.2fr 1fr",
    alignItems: "center",
    padding: "16px 16px",
    borderTop: `1px solid ${THEME.border}`,
  },
  cell: { color: THEME.textMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 },
  templateName: { color: THEME.text, fontWeight: 700 },
  subjectLine: { color: THEME.textMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  statusBadge: { display: "inline-block", padding: "6px 10px", borderRadius: 999, fontWeight: 700, fontSize: 12 },
  statusActive: { color: "#10B981", background: "rgba(16, 185, 129, 0.1)" },
  statusDraft: { color: "#FBBF24", background: "rgba(251, 191, 36, 0.1)" },
  statusDisabled: { color: "#EF4444", background: "rgba(239, 68, 68, 0.1)" },

  actionBtn: { width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 999, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.textMut, cursor: "pointer" },

  pagination: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 20, color: THEME.textMut },
  paginationCurrent: { fontWeight: 700, color: THEME.text, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 12px" },
};

export default function EmailTemplate() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return styles.statusActive;
      case "Draft": return styles.statusDraft;
      case "Disabled": return styles.statusDisabled;
      default: return {};
    }
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
                placeholder="Search templates"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading and Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting")}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Email Template</span>
          </div>

          {/* Create New Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => navigate("/email-template/create-email")}>
              + Create New Template
            </button>
          </div>

          {/* Templates Table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Template Name</div>
              <div>Subject Line</div>
              <div>Last Updated</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {TEMPLATES.map((template) => (
              <div key={template.id} style={styles.row}>
                <div style={{ ...styles.cell, ...styles.templateName }}>{template.name}</div>
                <div style={{ ...styles.cell, ...styles.subjectLine }}>{template.subject}</div>
                <div style={styles.cell}>{template.lastUpdated}</div>
                <div>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(template.status) }}>
                    {template.status}
                  </span>
                </div>
                <div>
                  <button style={styles.actionBtn} onClick={() => navigate("/email-template/edit-email")}>
                    <IoPencilOutline size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <span>&lt;</span>
            <span style={styles.paginationCurrent}>1</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
