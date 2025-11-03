// src/pages/InviteAdmin.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

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
};

/* STYLES */
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
  sectionTitle: { color: THEME.text, fontWeight: 900, marginBottom: 12, opacity: 0.85 },

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
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  caret: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  credBox: {
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    background: "#FAFBFF",
  },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: {
    border: "none",
    padding: "8px 10px",
    fontWeight: 800,
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  },
  smallBtnBlue: { background: "#E0ECFF", color: "#1E3A8A" },
  smallBtnGreen: { background: "#DCFCE7", color: "#065F46" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: {
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    background: THEME.accent,
    color: "#fff",
    boxShadow: "0 6px 14px rgba(37,99,235,.25)",
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

  err: { color: "#DC2626", fontWeight: 700, marginBottom: 12 },
  hint: { color: THEME.textFaint, fontSize: 12, marginTop: 6 },
};

export default function InviteAdmin() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  /* Form state */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    department: "",
    role: "Viewer", // Administrator | Editor | Viewer
    username: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // validate อย่างง่าย
  const validate = () => {
    if (!form.firstName?.trim() && !form.lastName?.trim()) return "Please enter first/last name";
    if (!form.email?.trim()) return "Please enter email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email format";
    if (!["Administrator", "Editor", "Viewer"].includes(form.role)) return "Invalid role";
    return "";
  };

  // POST ไปที่ /admin-users (API_BASE ไม่เปลี่ยน)
  const onInvite = async () => {
    const v = validate();
    if (v) { setErr(v); return; }
    setErr("");
    setSubmitting(true);
    try {
      const name = `${form.firstName || ""} ${form.lastName || ""}`.trim();

      const res = await fetch(`${API_BASE}/admin-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email: form.email,
          role: form.role,
        }),
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch {}

      if (!res.ok) {
        const msg = data?.detail || text || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      navigate("/admin-users", { replace: true });
    } catch (e) {
      setErr(e?.message || "Failed to invite admin");
    } finally {
      setSubmitting(false);
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
            &nbsp;&gt;&nbsp;<span style={{ color: "#3B82F6" }}>Invite Admin</span>
          </div>

          {err ? <div style={styles.err}>{err}</div> : null}

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
                <div style={styles.hint}>We'll send an invite link to this email.</div>
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
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
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

            {/* Actions */}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onInvite} disabled={submitting}>
                {submitting ? "Inviting..." : "Invite Admin"}
              </button>
              <button style={styles.btnGhost} onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
