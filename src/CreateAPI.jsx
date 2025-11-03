// src/pages/CreateApiKey.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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

  /* Topbar */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 20 },

  /* card */
  card: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },
  sectionTitle: { color: THEME.text, fontWeight: 900, marginBottom: 16, opacity: 0.9 },

  row: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    gap: 18,
    marginBottom: 16,
  },
  label: { color: THEME.textMut, fontWeight: 800, fontSize: 14 },

  input: {
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    minWidth: 320,
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },

  selectWrap: { position: "relative", display: "inline-block", minWidth: 220 },
  select: {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 38px 10px 12px",
    minWidth: 220,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  caret: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: THEME.textFaint,
  },

  statusWrap: { display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" },
  statusItem: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },
  statusDot: (c) => ({
    width: 14,
    height: 14,
    borderRadius: 3,
    background: c,
    border: `1px solid ${THEME.border}`,
  }),

  hint: { color: THEME.textFaint, fontSize: 12, marginTop: 6 },
  err: { color: THEME.danger, fontWeight: 700, marginBottom: 10 },

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
};

const SCOPE_OPTIONS = [
  { value: "issue_license", label: "issue_license" },
  { value: "verify_license", label: "verify_license" },
  { value: "revoke_license", label: "revoke_license" },
  { value: "full_access", label: "full_access" },
];

export default function CreateApiKey() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  /* form state */
  const [name, setName] = useState("Partner A – Verify");
  const [scope, setScope] = useState("issue_license");
  const [status, setStatus] = useState("active"); // active | inactive | revoke
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const validate = () => {
    if (!name?.trim()) return "Please enter a name for this API key.";
    if (!SCOPE_OPTIONS.some((s) => s.value === scope)) return "Invalid scope.";
    if (!["active", "inactive", "revoke"].includes(status)) return "Invalid status.";
    return "";
  };

  const onCreate = async () => {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr("");
    setSubmitting(true);
    try {
      const payload = { name: name.trim(), scope, status };
      // mock submit
      console.log("Create API Key (mock):", payload);
      alert("Created! (mock)\n" + JSON.stringify(payload, null, 2));
      navigate("/api-keys", { replace: true });
    } catch (e) {
      setErr(e?.message || "Failed to create API key.");
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
            &nbsp;&gt;&nbsp;
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/api-keys")}>
              API Keys
            </span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#2563EB" }}>Create API Keys</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Create API Keys</div>

            {err ? <div style={styles.err}>{err}</div> : null}

            <div style={styles.row}>
              <div style={styles.label}>Name</div>
              <div>
                <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
                <div style={styles.hint}>A readable label for this key (e.g., “Partner A – Verify”).</div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Scopes</div>
              <div>
                <div style={styles.selectWrap}>
                  <select value={scope} onChange={(e) => setScope(e.target.value)} style={styles.select}>
                    {SCOPE_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
                <div style={styles.hint}>Choose what this key can do.</div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Status</div>
              <div style={styles.statusWrap}>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#3B82F6")} />
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === "active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Active
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#E5E7EB")} />
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={status === "inactive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Inactive
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#EF4444")} />
                  <input
                    type="radio"
                    name="status"
                    value="revoke"
                    checked={status === "revoke"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Revoke
                </label>
                <div style={styles.hint}>Revoke will immediately disable the key.</div>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onCreate} disabled={submitting}>
                {submitting ? "Creating..." : "Create API Keys"}
              </button>
              <button style={styles.btnGhost} onClick={() => navigate("/api-keys")} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
