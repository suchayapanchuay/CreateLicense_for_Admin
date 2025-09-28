// src/pages/CreateApiKey.jsx
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
  btnCancel: "#8B3E37",
};

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* Topbar (แทนกระดิ่ง+แผงแจ้งเตือนเดิม) */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 20 },

  /* card */
  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },
  sectionTitle: { color: "#99C1FF", fontWeight: 800, marginBottom: 16 },

  row: { display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: 18, marginBottom: 16 },
  label: { color: THEME.text, fontWeight: 800, fontSize: 14 },
  input: { background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", minWidth: 280 },

  selectWrap: { position: "relative", display: "inline-block", minWidth: 180 },
  select: {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    background: "rgba(255,255,255,0.08)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 36px 10px 12px",
    minWidth: 180,
    fontWeight: 700,
    cursor: "pointer",
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textFaint },

  statusWrap: { display: "flex", gap: 20, alignItems: "center" },
  statusItem: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },
  statusDot: (c) => ({ width: 14, height: 14, borderRadius: 3, background: c, border: `1px solid ${THEME.border}` }),

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnCancel: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.btnCancel, color: "#fff", opacity: 0.9 },
};

export default function CreateApiKey() {
  const navigate = useNavigate();

  // ใช้ Topbar; กัน onSearchChange error
  const onSearchNoop = () => {};

  /* form state */
  const [name, setName] = useState("Partner A – Verify");
  const [scope, setScope] = useState("issue_license");
  const [status, setStatus] = useState("active"); // active | inactive | revoke

  const onCreate = () => {
    const payload = { name, scope, status };
    console.log("Create API Key (mock):", payload);
    alert("Created! (mock)\n" + JSON.stringify(payload, null, 2));
    navigate("/api-keys");
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
                placeholder="Search settings"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }}>Setting</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/api-keys")}>API Keys</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Create API Keys</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Create API Keys</div>

            <div style={styles.row}>
              <div style={styles.label}>Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Scopes</div>
              <div>
                <div style={styles.selectWrap}>
                  <select value={scope} onChange={(e) => setScope(e.target.value)} style={styles.select}>
                    <option value="issue_license">issue_license</option>
                    <option value="verify_license">verify_license</option>
                    <option value="revoke_license">revoke_license</option>
                    <option value="full_access">full_access</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Status</div>
              <div style={styles.statusWrap}>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#3B82F6")} />
                  <input type="radio" name="status" value="active" checked={status === "active"} onChange={(e) => setStatus(e.target.value)} />
                  Active
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("rgba(255,255,255,0.25)")} />
                  <input type="radio" name="status" value="inactive" checked={status === "inactive"} onChange={(e) => setStatus(e.target.value)} />
                  Inactive
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#EF4444")} />
                  <input type="radio" name="status" value="revoke" checked={status === "revoke"} onChange={(e) => setStatus(e.target.value)} />
                  Revoke
                </label>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onCreate}>Create API Keys</button>
              <button style={styles.btnCancel} onClick={() => navigate("/api-keys")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
