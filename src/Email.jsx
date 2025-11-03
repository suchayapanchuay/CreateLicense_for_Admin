import React from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { IoPencilOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
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
  goodText: "#065F46",
  goodBg: "#DCFCE7",
  warnText: "#92400E",
  warnBg: "#FEF3C7",
  dangerText: "#991B1B",
  dangerBg: "#FEE2E2",
};

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: {
    width: 1152,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
  },
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 18 },
  btn: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
    fontWeight: 800, cursor: "pointer", border: "none",
  },
  btnPrimary: { background: THEME.accent, color: "#fff", boxShadow: "0 6px 14px rgba(37,99,235,.25)" },
  tableWrap: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden",
    marginTop: 12, boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },
  header: {
    background: "#FAFBFF", display: "grid", gridTemplateColumns: "2.6fr 3fr 2fr 1.2fr 1fr",
    padding: "12px 16px", color: THEME.text, fontWeight: 800,
  },
  row: {
    display: "grid", gridTemplateColumns: "2.6fr 3fr 2fr 1.2fr 1fr", alignItems: "center",
    padding: "16px 16px", borderTop: `1px solid ${THEME.border}`, background: "#FFFFFF",
  },
  cell: { color: THEME.textMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 },
  templateName: { color: THEME.text, fontWeight: 800 },
  subjectLine: { color: THEME.textFaint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  statusBadgeBase: {
    display: "inline-block", padding: "6px 10px", borderRadius: 999, fontWeight: 800, fontSize: 12, border: `1px solid ${THEME.border}`,
  },
  statusActive: { color: THEME.goodText, background: THEME.goodBg },
  statusDraft: { color: THEME.warnText, background: THEME.warnBg },
  statusDisabled: { color: THEME.dangerText, background: THEME.dangerBg },
  actionBtn: {
    width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 999,
    border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.text, cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  pagination: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 20, color: THEME.textFaint },
  pageBtn: {
    minWidth: 36, height: 36, padding: "0 10px", borderRadius: 10, border: `1px solid ${THEME.border}`,
    background: "#FFFFFF", color: THEME.textMut, cursor: "pointer", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  paginationCurrent: {
    fontWeight: 900, color: THEME.text, background: THEME.card, borderRadius: 10, padding: "8px 12px",
    border: `1px solid ${THEME.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
  loading: { padding: 16, color: THEME.textFaint },
  err: { color: THEME.dangerText, marginBottom: 12, fontWeight: 800 },
};

export default function EmailTemplateList() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const view = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  React.useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`${API_BASE}/email-templates`, { signal: ctrl.signal });
        if (!r.ok) throw new Error(await r.text());
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const getStatusClass = (s) =>
    s === "Active" ? styles.statusActive : s === "Draft" ? styles.statusDraft : styles.statusDisabled;

  const fmt = (iso) => {
    if (!iso) return "-";
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar placeholder="Search templates" onSearchChange={() => {}} defaultFilter="all" onViewAllPath="/Noti" />
            </div>
          </div>

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span>Setting / Logs</span>&nbsp;&gt;&nbsp;<span style={{ color: "#3B82F6" }}>Email Template</span>
          </div>

          {/* Action */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => navigate("/email-template/create-email")}>
              + Create New Template
            </button>
          </div>

          {/* Errors / Loading */}
          {err && <div style={styles.err}>{err}</div>}
          {loading && <div style={styles.loading}>Loading templates…</div>}

          {/* Table */}
          {!loading && (
            <div style={styles.tableWrap}>
              <div style={styles.header}>
                <div>Template Name</div>
                <div>Subject Line</div>
                <div>Last Updated</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {view.map((t) => (
                <div key={t.id} style={styles.row}>
                  <div style={{ ...styles.cell, ...styles.templateName }}>
                    {t.name} <span style={{ opacity: 0.7 }}>({t.slug})</span>
                  </div>
                  <div style={{ ...styles.cell, ...styles.subjectLine }}>{t.subject}</div>
                  <div style={styles.cell}>{fmt(t.updated_at)}</div>
                  <div>
                    <span style={{ ...styles.statusBadgeBase, ...getStatusClass(t.status) }}>{t.status}</span>
                  </div>
                  <div>
                    <button
                      title="Edit"
                      style={styles.actionBtn}
                      onClick={() => navigate(`/email-template/edit-email/${t.id}`)}
                    >
                      <IoPencilOutline size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {!view.length && <div style={{ padding: 16, color: THEME.textFaint }}>No templates</div>}
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <div style={styles.pagination}>
              <button style={styles.pageBtn} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                &lt;
              </button>
              <span style={styles.paginationCurrent}>{page}</span>
              <button style={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
