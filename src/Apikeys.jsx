// src/pages/ApiKeys.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

/* -------- THEME (Light) -------- */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.10)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  goodBg: "#DCFCE7",
  goodText: "#065F46",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",
};

/* -------- MOCK API KEYS -------- */
const MOCK_KEYS = [
  { id: 1, name: "Partner A – Verify", key: "sk_live_xxx_abcdefghijklmn_9a2", scopes: ["Verify License"], status: "active",  lastUsed: "2025-08-28 09:10" },
  { id: 2, name: "Client B – Full Access", key: "sk_live_yyy_opqrstuvwxyz_7f5", scopes: ["Issue", "Verify", "Revoke"], status: "expired", lastUsed: "2025-09-01 11:22" },
  { id: 3, name: "Internal Service Key", key: "sk_live_zzz_1234567890abcd_4k7", scopes: ["Verify License"], status: "active",  lastUsed: "2025-07-10 14:55" },
];

/* -------- STYLES -------- */
const styles = {
  root: {
    display: "flex",
    minHeight: "1024px",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "18px 16px",
    position: "relative",
  },
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

  /* toolbar */
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
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

  /* table */
  tableWrap: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },
  header: {
    background: "#FAFBFF",
    display: "grid",
    gridTemplateColumns: "2fr 2.4fr 2fr 1fr 1.2fr 1fr", // + Actions column
    padding: "12px 16px",
    color: THEME.text,
    fontWeight: 800,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 2.4fr 2fr 1fr 1.2fr 1fr", // + Actions column
    alignItems: "center",
    padding: "14px 16px",
    borderTop: `1px solid ${THEME.border}`,
    color: THEME.text,
    background: "#FFFFFF",
  },

  scopes: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  /* Key cell (tight) */
  keyCell: {
    display: "flex",
    alignItems: "center",
    gap: 6,             // ช่องว่างเล็กลง
    minWidth: 0,
  },
  keyText: {
    color: THEME.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,           // กินพื้นที่คอลัมน์ที่จัดสรรไว้
  },
  copyBtn: {
    flexShrink: 0,     // ไม่ให้ขยาย/กินคอลัมน์อื่น
    borderRadius: 8,
    padding: "4px 8px", // เล็กลง ชิด key
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.text,
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    fontSize: 12,
  },
  copiedBadge: {
    flexShrink: 0,
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 11,
    background: THEME.goodBg,
    color: THEME.goodText,
    border: `1px solid ${THEME.border}`,
  },

  statusBadge: (status) => ({
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    color: status === "active" ? THEME.goodText : THEME.dangerText,
    background: status === "active" ? THEME.goodBg : THEME.dangerBg,
  }),

  /* actions */
  actionsCell: { display: "flex", gap: 8, justifyContent: "flex-end" },
  btnDangerOutline: {
    borderRadius: 10,
    padding: "8px 12px",
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.dangerText,
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    fontSize: 12,
  },

  /* pagination */
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginTop: 18,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    border: `1px solid ${THEME.border}`,
    display: "grid",
    placeItems: "center",
    color: THEME.textMut,
    cursor: "pointer",
    background: "#FFFFFF",
    fontWeight: 700,
    fontSize: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  pageCurrent: {
    minWidth: 32,
    height: 32,
    borderRadius: 10,
    background: THEME.card,
    display: "grid",
    placeItems: "center",
    color: THEME.text,
    fontWeight: 900,
    border: `1px solid ${THEME.border}`,
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
};

function maskKey(key) {
  if (!key) return "";
  if (key.length <= 8) return key;
  return `${key.slice(0, 10)}...${key.slice(-3)}`;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  // fallback
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export default function ApiKeys() {
  const navigate = useNavigate();

  // ขยับจาก MOCK_KEYS ให้เป็น state เพื่อรองรับการลบ
  const [rows, setRows] = useState(MOCK_KEYS);

  // search จาก Topbar
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null); // แสดงสถานะ Copied! ต่อแถว
  const handleSearchChange = (q) => setSearch(q || "");

  const filtered = useMemo(
    () =>
      rows.filter(
        (k) =>
          k.name.toLowerCase().includes(search.toLowerCase()) ||
          k.key.toLowerCase().includes(search.toLowerCase()) ||
          k.scopes.join(", ").toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

  const handleCopy = async (row) => {
    const ok = await copyToClipboard(row.key);
    if (ok) {
      setCopiedId(row.id);
      setTimeout(() => setCopiedId((cur) => (cur === row.id ? null : cur)), 1500);
    } else {
      alert("Copy failed. Please copy manually.");
    }
  };

  const handleDelete = (row) => {
    const confirmMsg = `ยืนยันลบ API Key?\n\nName: ${row.name}\nKey: ${row.key}\n\nการลบจะไม่สามารถยกเลิกได้`;
    if (!window.confirm(confirmMsg)) return;
    // TODO: เชื่อมต่อ API ลบจริงที่นี่ (เช่น DELETE /api-keys/:id)
    setRows((prev) => prev.filter((r) => r.id !== row.id));
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
                placeholder="Search API keys"
                onSearchChange={handleSearchChange}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span>Setting / Logs</span> &nbsp;&gt;&nbsp; <span>Setting</span> &nbsp;&gt;&nbsp;{" "}
            <span style={{ color: "#3B82F6" }}>API Keys</span>
          </div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div />
            <button style={styles.btnPrimary} onClick={() => navigate("/create-api")}>
              + Create API Keys
            </button>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Name</div>
              <div>Key</div>
              <div>Scopes</div>
              <div>Status</div>
              <div>Last Used</div>
              <div style={{ textAlign: "right" }}>Actions</div>
            </div>

            {filtered.map((k) => (
              <div key={k.id} style={styles.row}>
                <div>{k.name}</div>

                {/* Key + Copy (tight) */}
                <div style={styles.keyCell} title={k.key}>
                  <span style={styles.keyText}>{maskKey(k.key)}</span>
                  {copiedId === k.id ? (
                    <span style={styles.copiedBadge} aria-live="polite">Copied!</span>
                  ) : (
                    <button
                      style={styles.copyBtn}
                      onClick={() => handleCopy(k)}
                      aria-label={`Copy API key for ${k.name}`}
                      title="Copy full key"
                    >
                      Copy
                    </button>
                  )}
                </div>

                <div style={styles.scopes} title={k.scopes.join(", ")}>
                  {k.scopes.join(", ")}
                </div>
                <div>
                  <span style={styles.statusBadge(k.status)}>
                    {k.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                <div>{k.lastUsed}</div>

                {/* Actions */}
                <div style={styles.actionsCell}>
                  <button
                    style={styles.btnDangerOutline}
                    onClick={() => handleDelete(k)}
                    title={`Delete ${k.name}`}
                    aria-label={`Delete ${k.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!filtered.length && (
              <div style={{ padding: 16, color: THEME.textFaint }}>No API keys found</div>
            )}
          </div>

          {/* pagination */}
          <div style={styles.pagination}>
            <div style={styles.pageBtn} aria-label="Previous Page">‹</div>
            <div style={styles.pageCurrent}>1</div>
            <div style={styles.pageBtn} aria-label="Next Page">›</div>
          </div>
        </div>
      </div>
    </div>
  );
}
