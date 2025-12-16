// src/pages/AdminUsers.jsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
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

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: {
    width: 1152, minHeight: 800, background: THEME.stageBg, borderRadius: 16,
    border: `1px solid ${THEME.border}`, padding: 24, position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)"
  },

  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none",
    background: THEME.card,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 40px 10px 12px",
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 180,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)"
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none", fontSize: 18 },

  btn: {
    borderRadius: 10, padding: "10px 14px", fontWeight: 800, cursor: "pointer",
    border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.text,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)"
  },
  btnPrimary: {
    borderRadius: 10, padding: "10px 14px", fontWeight: 800, cursor: "pointer",
    border: "none", background: THEME.accent, color: "#fff",
    boxShadow: "0 6px 14px rgba(37,99,235,.25)"
  },

  tableWrap: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)"
  },
  header: {
    background: "rgba(0,0,0,0.04)", display: "grid",
    gridTemplateColumns: "2fr 2.5fr 1.2fr 1.2fr",
    padding: "12px 16px", color: THEME.text, fontWeight: 800
  },
  row: {
    display: "grid", gridTemplateColumns: "2fr 2.5fr 1.2fr 1.2fr", alignItems: "center",
    padding: "16px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text
  },

  eyeBtn: {
    width: 34, height: 34, display: "grid", placeItems: "center",
    borderRadius: "999px", border: `1px solid ${THEME.border}`,
    background: "transparent", color: THEME.text, cursor: "pointer"
  },

  empty: { padding: 16, color: THEME.textFaint, textAlign: "center" },

  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 },
  pageBtn: {
    width: 34, height: 34, borderRadius: 10, border: `1px solid ${THEME.border}`,
    display: "grid", placeItems: "center", color: THEME.textFaint, cursor: "pointer",
    background: "#FFFFFF", fontWeight: 800, fontSize: 16, boxShadow: "0 2px 6px rgba(0,0,0,.04)"
  },
  pageCurrent: {
    minWidth: 34, height: 34, borderRadius: 10, background: THEME.card,
    display: "grid", placeItems: "center", color: THEME.text, fontWeight: 900,
    border: `1px solid ${THEME.border}`, padding: "0 8px", boxShadow: "0 2px 6px rgba(0,0,0,.04)"
  },
  totalText: { textAlign: "center", marginTop: 6, color: THEME.textFaint, fontSize: 13 },
};

export default function AdminUsers() {
  const navigate = useNavigate();

  // states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | Administrator | Editor | Viewer
  const [admins, setAdmins] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // debounce search 300ms
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const getId = (u) => u.id ?? u.user_id ?? u._id ?? u.email;

  // loader
  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const url = new URL(`${API_BASE}/admin-users`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("page_size", String(pageSize));
      if (debounced) url.searchParams.set("search", debounced);
      if (roleFilter !== "all") url.searchParams.set("role", roleFilter);

      const res = await fetch(url, { credentials: "include" })
      const txt = await res.text();
      let data = null;
      try { data = txt ? JSON.parse(txt) : null; } catch {}

      if (!res.ok) throw new Error((data && data.detail) || txt || `HTTP ${res.status}`);

      const rows = Array.isArray(data?.items) ? data.items : [];
      setAdmins(rows);
      setTotalPages(data?.total_pages ?? 1);
      setTotal(data?.total ?? rows.length);
    } catch (e) {
      setErr(e?.message || "Failed to load admins");
      setAdmins([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debounced, roleFilter]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  // handlers
  const handleSearchChange = (q) => { setSearch(q || ""); setPage(1); };
  const handleRoleChange = (e) => { setRoleFilter(e.target.value); setPage(1); };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search admin users"
                onSearchChange={handleSearchChange}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          <div style={styles.title}>Admin Users & Roles</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.selectWrap}>
              <select value={roleFilter} onChange={handleRoleChange} style={styles.select}>
                <option value="all">All roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.btn} onClick={loadAdmins} disabled={loading}>
                {loading ? "Loading..." : "Reload"}
              </button>
              <button style={styles.btnPrimary} onClick={() => navigate("/admin-users/add")}>
                + Invite Admin
              </button>
            </div>
          </div>

          {err ? <div style={{ color: "#DC2626", marginBottom: 12, fontWeight: 700 }}>{err}</div> : null}

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Actions</div>
            </div>

            {loading && <div style={styles.empty}>Loading…</div>}
            {!loading && admins.length === 0 && <div style={styles.empty}>No admins found</div>}

            {!loading && admins.map((a) => (
              <div key={getId(a)} style={styles.row}>
                <div>{a.name || "-"}</div>
                <div>{a.email}</div>
                <div>{a.role || "-"}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    style={styles.eyeBtn}
                    onClick={() => navigate(`/admin-users/${encodeURIComponent(getId(a))}`)}
                    title="View details"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              ‹
            </button>
            <div style={styles.pageCurrent}>{page}</div>
            <button
              style={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              ›
            </button>
          </div>
          <div style={styles.totalText}>{total} admin(s)</div>
        </div>
      </div>
    </div>
  );
}
