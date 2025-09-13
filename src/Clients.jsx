import React, { useMemo, useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown, FiEye } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
};

/* -------- MOCK NOTIFICATIONS (เหมือนหน้า Dashboard) -------- */
const NOTI_ITEMS = [
  { id: 1,  type: "trial",     title: "Trial Request",    client: "Client A", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 2,  type: "trial",     title: "Trial Request",    client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 3,  type: "purchase",  title: "Purchase Request", client: "Client C", product: "Smart Audit", requested: "31 Aug 2025", read: true },
  { id: 4,  type: "trial",     title: "Trial Request",    client: "Client D", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 7,  read: true  },
  { id: 5,  type: "purchase",  title: "Purchase Request", client: "Client E", product: "Smart Audit", requested: "31 Aug 2025", read: true  },
  { id: 6,  type: "trial",     title: "Trial Request",    client: "Client F", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 30, read: false },
  { id: 7,  type: "trial",     title: "Trial Request",    client: "Client G", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: true  },
  { id: 8,  type: "purchase",  title: "Purchase Request", client: "Client H", product: "Smart Audit", requested: "31 Aug 2025", read: false },
  { id: 9,  type: "trial",     title: "Trial Request",    client: "Client I", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 10, read: true  },
  { id: 10, type: "trial",     title: "Trial Request",    client: "Client J", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 20, read: true  },
  { id: 11, type: "purchase",  title: "Purchase Request", client: "Client K", product: "Smart Audit", requested: "31 Aug 2025", read: true  },
  { id: 12, type: "trial",     title: "Trial Request",    client: "Client L", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 14, read: false },
];

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: {
    width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16,
    border: `1px solid ${THEME.border}`, padding: 24, position: "relative",
  },

  /* topbar */
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`,
    padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

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
  notiSelectCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },

  rightGroup: { display: "flex", alignItems: "center", gap: 10 },
  btn: {
    borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
    border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text,
  },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },

  /* table */
  tableWrap: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12,
    overflow: "hidden",
  },
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

  /* -------- Notifications panel (เหมือน Dashboard) -------- */
  notiPanelWrap: {
    position: "absolute", top: 90, right: 36, width: 560,
    background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10,
    boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden",
  },
  notiHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`,
    fontWeight: 900, fontSize: 22,
  },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: {
    appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
    background: "#183154", color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  selectCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${THEME.border}` },
  notiBadge: { fontSize: 13, color: THEME.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: THEME.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 6, color: THEME.textFaint, fontSize: 14, marginTop: 8 },
  notiBtn: { marginTop: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer" },
};

/* -------- MOCK DATA -------- */
const MOCK_CLIENTS = [
  { id: 1, name: "John Doe", company: "Acme Corp.", email: "johndce@acme.co", status: "active" },
  { id: 2, name: "Emma Smith", company: "Beta Systems", email: "emma smith@beta", status: "inactive" },
  { id: 3, name: "Liam Johnson", company: "Gamma Innovations", email: "liam@gamma.com", status: "active" },
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

  /* notifications (เหมือน Dashboard) */
  const [showNoti, setShowNoti] = useState(false);
  const [notiFilter, setNotiFilter] = useState("all");
  const notiRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filteredNoti = NOTI_ITEMS.filter((n) => {
    if (notiFilter === "all") return true;
    if (notiFilter === "unread") return !n.read;
    if (notiFilter === "trial") return n.type === "trial";
    if (notiFilter === "purchase") return n.type === "purchase";
    return true;
  });

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* topbar */}
          <div style={styles.topbar}>
            <div style={styles.searchBox}>
              <FiSearch />
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div onClick={() => setShowNoti((v) => !v)} style={{ cursor: "pointer" }}>
              <IoMdNotificationsOutline size={24} color={THEME.text} />
            </div>
          </div>

          {/* Notifications Panel */}
          {showNoti && (
            <div style={styles.notiPanelWrap} ref={notiRef}>
              <div style={styles.notiHead}>
                <span>Notifications ({NOTI_ITEMS.length})</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={styles.notiSelectWrap}>
                    <select
                      value={notiFilter}
                      onChange={(e) => setNotiFilter(e.target.value)}
                      style={styles.notiSelect}
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="trial">Trial</option>
                      <option value="purchase">Purchase</option>
                    </select>
                    <FiChevronDown style={styles.selectCaret} />
                  </div>
                  <IoClose size={22} onClick={() => setShowNoti(false)} style={styles.notiClose} />
                </div>
              </div>

              <div style={styles.notiList}>
                {filteredNoti.map((n) => (
                  <div key={n.id} style={styles.notiItem}>
                    <div style={styles.notiBadge}>{n.title}</div>
                    <div style={styles.notiClient}>{n.client}</div>

                    <div style={styles.notiMetaRow}>
                      <span><strong style={{ color: THEME.textFaint }}>Product :</strong> {n.product}</span>
                      {n.durationDays ? (
                        <span><strong style={{ color: THEME.textFaint }}>Duration :</strong> {n.durationDays} days</span>
                      ) : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested :</strong> {n.requested}</span>
                      <span />
                    </div>

                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
                <div style={{ height: 120, borderBottom: `1px solid ${THEME.border}` }} />
              </div>

              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>Veiw All</div>
            </div>
          )}

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
              <button style={styles.btnPrimary} onClick={() => navigate("/create")} >Create License</button>
              <button style={{ ...styles.btnPrimary, background: "#1983E6" }} onClick={() => navigate("/client/add")} >+ Add Client</button>
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
                  <button style={styles.eyeBtn} onClick={() => navigate("/client-details/:id", c.id)}>
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
