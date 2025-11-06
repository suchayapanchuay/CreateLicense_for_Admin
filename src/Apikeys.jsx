// src/pages/ApiKeys.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import Topbar from "./Topbar";
import { listApiKeys, revokeApiKey, deleteApiKey } from "../src/lib/api"; 

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
  warnBg: "#FEF3C7",
  warnText: "#92400E",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",
};

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 780, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative", boxShadow: "0 10px 28px rgba(0,0,0,.06)" },
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 20 },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  btnPrimary: { borderRadius: 10, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff", boxShadow: "0 6px 14px rgba(37,99,235,.25)" },
  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,.05)" },
  header: { background: "#FAFBFF", display: "grid", gridTemplateColumns: "2fr 2.4fr 2fr 1fr 1.2fr 1fr", padding: "12px 16px", color: THEME.text, fontWeight: 800 },
  row: { display: "grid", gridTemplateColumns: "2fr 2.4fr 2fr 1fr 1.2fr 1fr", alignItems: "center", padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text, background: "#FFFFFF" },
  scopes: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  keyCell: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 },
  keyText: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 },
  statusBadge: (status) => {
    const map = { active: { bg: THEME.goodBg, fg: THEME.goodText, label: "Active" }, inactive: { bg: THEME.warnBg, fg: THEME.warnText, label: "Inactive" }, revoked: { bg: THEME.dangerBg, fg: THEME.dangerText, label: "Revoked" } };
    const s = map[status] || map.active;
    return { display: "inline-block", padding: "6px 10px", borderRadius: 999, fontWeight: 800, fontSize: 12, color: s.fg, background: s.bg, border: `1px solid ${THEME.border}` };
  },
  actionsCell: { display: "flex", gap: 8, justifyContent: "flex-end" },
  btnDangerOutline: { borderRadius: 10, padding: "8px 12px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.dangerText, boxShadow: "0 2px 8px rgba(0,0,0,.04)", fontSize: 12 },
  btnGhost: { borderRadius: 10, padding: "8px 12px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.text, boxShadow: "0 2px 8px rgba(0,0,0,.04)", fontSize: 12 },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 10, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer", background: "#FFFFFF", fontWeight: 700, fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,.04)" },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 10, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 900, border: `1px solid ${THEME.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.04)" },
};

export default function ApiKeys() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const handleSearchChange = (q) => setSearch(q || "");

  useEffect(() => {
    (async () => {
      try {
        const data = await listApiKeys();
        // data: [{ id, name, key_mask, scopes, status, lastUsed, expiresAt }]
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        alert("โหลด API keys ไม่ได้");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((k) => {
      const name = (k.name || "").toLowerCase();
      const mask = (k.key_mask || "").toLowerCase();
      const scopes = (k.scopes || []).join(", ").toLowerCase();
      return name.includes(q) || mask.includes(q) || scopes.includes(q);
    });
  }, [rows, search]);

  const handleRevoke = async (row) => {
    const confirmMsg = `ยืนยัน revoke API Key?\n\nName: ${row.name}\nMask: ${row.key_mask}`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await revokeApiKey(row.id);
      // อาจเลือกอัปเดตสถานะเป็น revoked แทนการลบทิ้งก็ได้
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "revoked" } : r)));
    } catch (e) {
      console.error(e);
      alert("Revoke ไม่สำเร็จ");
    }
  };

  const handleDelete = async (row) => {
    const confirmMsg = `ลบ API Key ถาวร?\n\nName: ${row.name}\nMask: ${row.key_mask}\n\nการลบจะไม่สามารถกู้คืนได้`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await deleteApiKey(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      console.error(e);
      alert("Delete ไม่สำเร็จ");
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
            <span>Setting / Logs</span> &nbsp;&gt;&nbsp; <span>Setting</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#3B82F6" }}>API Keys</span>
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

            {loading && <div style={{ padding: 16, color: THEME.textFaint }}>Loading…</div>}

            {!loading &&
              filtered.map((k) => (
                <div key={k.id} style={styles.row}>
                  <div>{k.name}</div>

                  {/* Mask only */}
                  <div style={styles.keyCell} title={k.key_mask}>
                    <span style={styles.keyText}>{k.key_mask}</span>
                  </div>

                  <div style={styles.scopes} title={(k.scopes || []).join(", ")}>
                    {(k.scopes || []).join(", ")}
                  </div>

                  <div>
                    <span style={styles.statusBadge(k.status)}>
                      {String(k.status).charAt(0).toUpperCase() + String(k.status).slice(1)}
                    </span>
                  </div>

                  <div>{k.lastUsed || "-"}</div>

                  {/* Actions */}
                  <div style={styles.actionsCell}>
                    <button
                      style={styles.btnGhost}
                      onClick={() => handleRevoke(k)}
                      title={`Revoke ${k.name}`}
                      aria-label={`Revoke ${k.name}`}
                    >
                      Revoke
                    </button>

                    <button
                      style={styles.btnDangerOutline}
                      onClick={() => handleDelete(k)}
                      title={`Delete ${k.name}`}
                      aria-label={`Delete ${k.name}`}
                    >
                      <FiTrash2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    </button>
                  </div>
                </div>
              ))}

            {!loading && !filtered.length && (
              <div style={{ padding: 16, color: THEME.textFaint }}>No API keys found</div>
            )}
          </div>

          {/* pagination (static placeholder) */}
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
