import React, { useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
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
  accent: "#3B82F6",
};

/* -------- STYLES (ตัดส่วน noti/topbar เดิมออก) -------- */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* toolbar row */
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  leftGroup: { display: "flex", alignItems: "center", gap: 10 },
  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
    background: THEME.card, color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "8px 40px 8px 12px", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  selectCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },

  rightGroup: { display: "flex", alignItems: "center", gap: 10 },
  btn: {
    borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
    border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text,
  },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },

  /* table */
  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  header: {
    background: "rgba(255,255,255,0.06)",
    display: "grid",
    gridTemplateColumns: "2.6fr 2fr 2.6fr 1.2fr 1fr",
    padding: "12px 16px",
    color: THEME.text,
    fontWeight: 700,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.6fr 2fr 2.6fr 1.2fr 1fr",
    alignItems: "center",
    padding: "16px 16px",
    borderTop: `1px solid ${THEME.border}`,
  },

  /* cells */
  clientCell: { display: "grid", gap: 4 },
  clientName: { color: THEME.text, fontWeight: 700 },
  clientCompanyLink: { color: "#67B3FF", fontWeight: 600, cursor: "pointer", width: "fit-content" },
  companyCol: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  email: { color: THEME.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  statusBadge: (type) => ({
    display: "inline-block", padding: "6px 10px", borderRadius: 999, fontWeight: 700, fontSize: 12,
    color: type === "active" ? "#0C2712" : "#1E293B",
    background: type === "active" ? "rgba(163,230,53,0.8)" : "rgba(148,163,184,0.6)",
  }),
  eyeBtn: {
    width: 34, height: 34, display: "grid", placeItems: "center",
    borderRadius: "999px", border: `1px solid ${THEME.border}`,
    background: "transparent", color: THEME.text, cursor: "pointer",
  },

  /* pagination */
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`,
    display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer",
    background: "transparent", fontWeight: 600, fontSize: 16,
  },
  pageCurrent: {
    minWidth: 32, height: 32, borderRadius: 8, background: THEME.card,
    display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800,
    border: `1px solid ${THEME.border}`,
  },
};

/* -------- MOCK DATA -------- */
const MOCK_CLIENTS = [
  { id: 1, name: "John Doe",  company: "Acme Corp.",          email: "johndce@acme.co",  status: "active" },
  { id: 2, name: "Emma Smith",company: "Beta Systems",        email: "emma.smith@beta",  status: "inactive" },
  { id: 3, name: "Liam Johnson", company: "Gamma Innovations",email: "liam@gamma.com",   status: "active" },
];

export default function Clients() {
  const navigate = useNavigate();

  /* search/filter clients */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return MOCK_CLIENTS.filter((c) => {
      const hit =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const statusOK = statusFilter === "all" ? true : c.status === statusFilter;
      return hit && statusOK;
    });
  }, [search, statusFilter]);

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* ใช้ Topbar ที่รีใช้ซ้ำได้ทุกหน้า */}
          <Topbar
            placeholder="Search clients"
            onSearchChange={(text) => setSearch(text)}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          <div style={styles.title}>Clients</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.leftGroup}>
              <div style={styles.selectWrap}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FiChevronDown style={styles.selectCaret} />
              </div>
            </div>

            <div style={styles.rightGroup}>
              <button style={styles.btnPrimary} onClick={() => navigate("/create")}>Create License</button>
              <button style={{ ...styles.btnPrimary, background: "#1983E6" }} onClick={() => navigate("/client/add")}>+ Add Client</button>
            </div>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Client Name</div>
              <div>Company</div>
              <div>Email</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {filtered.map((c) => (
              <div key={c.id} style={styles.row}>
                <div style={styles.clientCell}>
                  <div style={styles.clientName}>{c.name}</div>
                  <div style={styles.clientCompanyLink} title={c.company}>
                    {c.company}
                  </div>
                </div>

                <div style={styles.companyCol}>{c.company}</div>
                <div style={styles.email} title={c.email}>{c.email}</div>

                <div>
                  <span style={styles.statusBadge(c.status)}>{c.status === "active" ? "Active" : "Inactive"}</span>
                </div>

                <div>
                  {/* แก้ navigate ให้เป็นพาธจริง ไม่ใช่ :id ตายตัว */}
                  <button
                    style={styles.eyeBtn}
                    onClick={() => navigate(`/client-details/${c.id}`)}
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div style={styles.pagination}>
            <div style={styles.pageBtn}>‹</div>
            <div style={styles.pageCurrent}>1</div>
            <div style={styles.pageBtn}>›</div>
          </div>
        </div>
      </div>
    </div>
  );
}
