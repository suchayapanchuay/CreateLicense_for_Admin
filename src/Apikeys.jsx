// src/pages/ApiKeys.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiEye } from "react-icons/fi";
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
  good: "rgba(163,230,53,0.8)",
  danger: "#FCA5A5",
};

/* -------- MOCK API KEYS -------- */
const MOCK_KEYS = [
  {
    id: 1,
    name: "Partner A – Verify",
    key: "sk_live_xxx_abcdefghijklmn_9a2",
    scopes: ["Verify License"],
    status: "active",
    lastUsed: "2025-08-28 09:10",
  },
  {
    id: 2,
    name: "Client B – Full Access",
    key: "sk_live_yyy_opqrstuvwxyz_7f5",
    scopes: ["Issue", "Verify", "Revoke"],
    status: "expired",
    lastUsed: "2025-09-01 11:22",
  },
  {
    id: 3,
    name: "Internal Service Key",
    key: "sk_live_zzz_1234567890abcd_4k7",
    scopes: ["Verify License"],
    status: "active",
    lastUsed: "2025-07-10 14:55",
  },
];

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* Topbar แทนกระดิ่ง */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 20 },

  /* toolbar */
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },

  /* table */
  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  header: {
    background: "rgba(255,255,255,0.06)",
    display: "grid",
    gridTemplateColumns: "2fr 2fr 2fr 1fr 1.2fr 0.8fr",
    padding: "12px 16px",
    color: THEME.text,
    fontWeight: 700,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 2fr 1fr 1.2fr 0.8fr",
    alignItems: "center",
    padding: "14px 16px",
    borderTop: `1px solid ${THEME.border}`,
    color: THEME.text,
  },
  scopes: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  key: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  statusBadge: (status) => ({
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    color: status === "active" ? "#052E12" : "#3E0A0A",
    background: status === "active" ? THEME.good : THEME.danger,
  }),

  eyeBtn: {
    width: 34, height: 34, display: "grid", placeItems: "center",
    borderRadius: "999px", border: `1px solid ${THEME.border}`,
    background: "transparent", color: THEME.text, cursor: "pointer",
  },

  /* pagination */
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer", background: "transparent", fontWeight: 600, fontSize: 16 },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 8, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800, border: `1px solid ${THEME.border}` },
};

function maskKey(key) {
  if (!key) return "";
  if (key.length <= 8) return key;
  return `${key.slice(0, 10)}...${key.slice(-3)}`;
}

export default function ApiKeys() {
  const navigate = useNavigate();

  // search จาก Topbar
  const [search, setSearch] = useState("");
  const handleSearchChange = (q) => setSearch(q || "");

  const filtered = useMemo(
    () =>
      MOCK_KEYS.filter(
        (k) =>
          k.name.toLowerCase().includes(search.toLowerCase()) ||
          k.key.toLowerCase().includes(search.toLowerCase()) ||
          k.scopes.join(", ").toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (ใช้คอมโพเนนต์ Topbar แทน notification panel เดิม) */}
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
            <span>Setting / Logs</span> &nbsp;&gt;&nbsp; <span>Setting</span> &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>API Keys</span>
          </div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div />
            <button style={styles.btnPrimary} onClick={() => navigate("/create-api")}>+ Create API Keys</button>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Name</div>
              <div>Key</div>
              <div>Scopes</div>
              <div>Status</div>
              <div>Last Used</div>
              <div>Actions</div>
            </div>

            {filtered.map((k) => (
              <div key={k.id} style={styles.row}>
                <div>{k.name}</div>
                <div style={styles.key} title={k.key}>{maskKey(k.key)}</div>
                <div style={styles.scopes} title={k.scopes.join(", ")}>{k.scopes.join(", ")}</div>
                <div><span style={styles.statusBadge(k.status)}>{k.status === "active" ? "Active" : "Expired"}</span></div>
                <div>{k.lastUsed}</div>
                <div>
                  <button
                    style={styles.eyeBtn}
                    onClick={() => navigate(`/api-detail`)}
                    aria-label="View API Key"
                    title="View"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
            ))}
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
