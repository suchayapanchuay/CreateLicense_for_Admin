// src/app/Clients.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* -------- THEME: match Dashboard (Light Blue) -------- */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#E8F0FE",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  accent: "#2563EB",
  faintBg: "#F9FBFF",
  warn: "#DC2626",
};

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "20px 16px", position: "relative" },
  stage: {
    width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16,
    border: `1px solid ${THEME.border}`, padding: 24, position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.08)"
  },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* toolbar row */
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  leftGroup: { display: "flex", alignItems: "center", gap: 10 },
  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
    background: THEME.stageBg, color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "8px 40px 8px 12px", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  selectCaret: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    pointerEvents: "none", color: THEME.textMut, fontSize: 18
  },

  rightGroup: { display: "flex", alignItems: "center", gap: 10 },
  btn: {
    borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
    border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text,
  },
  btnPrimary: {
    borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
    border: "none", background: THEME.accent, color: "#fff",
  },

  /* table */
  tableWrap: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden"
  },
  header: {
    background: THEME.faintBg,
    display: "grid",
    gridTemplateColumns: "2.6fr 2fr 2.6fr 1.2fr 1fr", // Name | Company | Email | Type | Actions
    padding: "12px 16px",
    color: THEME.text,
    fontWeight: 800,
    borderBottom: `1px solid ${THEME.border}`,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.6fr 2fr 2.6fr 1.2fr 1fr",
    alignItems: "center",
    padding: "16px 16px",
    borderTop: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
  },

  /* cells */
  clientCell: { display: "grid", gap: 4 },
  clientName: { color: THEME.text, fontWeight: 800 },
  clientCompanyLink: { color: "#1D4ED8", fontWeight: 600, cursor: "pointer", width: "fit-content" },
  companyCol: {
    color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
  },
  email: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  typeBadge: (t) => {
    const map = {
      trial: { bg: "rgba(37,99,235,0.12)", fg: "#1E40AF" },      // blue
      purchase: { bg: "rgba(16,185,129,0.14)", fg: "#065F46" },  // green
      support: { bg: "rgba(234,179,8,0.18)", fg: "#92400E" },    // amber
      default: { bg: "rgba(148,163,184,0.18)", fg: "#334155" },  // slate
    };
    const c = map[t] || map.default;
    return {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 12,
      background: c.bg,
      color: c.fg,
      textTransform: "capitalize",
      border: `1px solid ${THEME.border}`,
    };
  },
  eyeBtn: {
    width: 36, height: 36, display: "grid", placeItems: "center",
    borderRadius: "10px", border: `1px solid ${THEME.border}`,
    background: THEME.stageBg, color: THEME.text, cursor: "pointer",
  },

  /* pagination (placeholder) */
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`,
    display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer",
    background: THEME.stageBg, fontWeight: 600, fontSize: 16,
  },
  pageCurrent: {
    minWidth: 32, height: 32, borderRadius: 8, background: THEME.card,
    display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800,
    border: `1px solid ${THEME.border}`,
  },
};

/* -------- HELPERS -------- */
function normalizeClient(c) {
  const fn = c.firstName ?? c.first_name ?? "";
  const ln = c.lastName ?? c.last_name ?? "";
  return {
    id: c.id,
    name: (fn || ln) ? `${fn} ${ln}`.trim() : (c.name || "-"),
    company: c.company || "-",
    email: c.email || "-",
    type: (c.requestType ?? c.request_type ?? "-"),
    created_at: c.created_at || null,
    raw: c,
  };
}

export default function Clients() {
  const navigate = useNavigate();

  const [search] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // trial | purchase | support
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(`${API_BASE}/clients`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const list = Array.isArray(data) ? data.map(normalizeClient) : [];
      setClients(list);
    } catch (e) {
      setErr(e?.message || "Failed to load clients");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return clients.filter((c) => {
      const hit =
        !kw ||
        c.name.toLowerCase().includes(kw) ||
        c.company.toLowerCase().includes(kw) ||
        c.email.toLowerCase().includes(kw);
      const typeOK = typeFilter === "all" ? true : (c.type === typeFilter);
      return hit && typeOK;
    });
  }, [clients, search, typeFilter]);

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (แผง noti ใช้ของเดิมได้) */}
          <Topbar defaultFilter="all" onViewAllPath="/Noti" />

          <div style={styles.title}>Clients</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.leftGroup}>
              <div style={styles.selectWrap}>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">All types</option>
                  <option value="trial">Trial</option>
                  <option value="purchase">Purchase</option>
                  <option value="support">Support</option>
                </select>
                <FiChevronDown style={styles.selectCaret} />
              </div>
            </div>

            <div style={styles.rightGroup}>

              <button style={styles.btn} onClick={loadClients} disabled={loading}>
                {loading ? "Loading..." : "Reload"}
              </button>
              <button style={styles.btnPrimary} onClick={() => navigate("/client/add")}>+ Add Client</button>
            </div>
          </div>

          {/* error / empty states */}
          {err ? (
            <div style={{ color: THEME.warn, marginBottom: 12, fontWeight: 700 }}>{err}</div>
          ) : null}

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Client Name</div>
              <div>Company</div>
              <div>Email</div>
              <div>Type</div>
              <div>Actions</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: 16, color: THEME.textMut, background: "#FFFFFF" }}>
                {loading ? "Loading..." : "No clients found"}
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} style={styles.row}>
                  <div style={styles.clientCell}>
                    <div style={styles.clientName}>{c.name}</div>
                    <div style={styles.clientCompanyLink} title={c.company}>
                      {c.company}
                    </div>
                  </div>

                  <div style={styles.companyCol} title={c.company}>{c.company}</div>
                  <div style={styles.email} title={c.email}>{c.email}</div>

                  <div>
                    <span style={styles.typeBadge(c.type)}>{c.type || "-"}</span>
                  </div>

                  <div>
                    <button
                      style={styles.eyeBtn}
                      onClick={() => navigate(`/client-details/${c.id}`)}
                      title="View details"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* pagination (placeholder – ถ้า backend ยังไม่รองรับ) */}
          <div style={styles.pagination}>
            <div style={styles.pageBtn} aria-disabled>‹</div>
            <div style={styles.pageCurrent}>1</div>
            <div style={styles.pageBtn} aria-disabled>›</div>
          </div>
        </div>
      </div>
    </div>
  );
}
