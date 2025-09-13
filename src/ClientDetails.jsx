import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown, FiEye } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
};

/* MOCK NOTIFICATIONS */
const NOTI_ITEMS = [
  { id: 1, type: "trial", title: "Trial Request", client: "Client A", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 2, type: "purchase", title: "Purchase Request", client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", read: true },
];

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18, marginBottom: 20 },
  typePill: { background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 8, fontWeight: 700, display: "inline-block", marginBottom: 16 ,color: THEME.text},

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: { width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDanger: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#B4534E", color: "#fff" },

  sectionTitle: { fontSize: 20, fontWeight: 900, color: THEME.text, margin: "18px 0 10px" },
  hr: { height: 1, background: THEME.border, border: "none", margin: "12px 0 16px" },

  /* table */
  tableWrap: { borderRadius: 10, overflow: "hidden", marginTop: 8 },
  header: { background: "rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "12px 16px", fontWeight: 700, color: THEME.text },
  row: { display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text },

  eyeBtn: { width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },

  /* Notifications */
  notiPanelWrap: { position: "absolute", top: 90, right: 36, width: 560, background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`, fontWeight: 900, fontSize: 22 },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: { appearance: "none", background: "#183154", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
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

export default function ClientDetail() {
  const navigate = useNavigate();

  /* Notifications */
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

  /* Mock data */
  const client = {
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "BlankSpace",
    industry: "Software Engineer",
    country: "Thailand",
    estimateUser: "10",
    message: "Please contact us within this month.",
    trial: "15 days",
    username: "User101",
    password: "U12S36",
  };

  const license = {
    product: "Smart Audit",
    type: "Trial",
    key: "ABCD-1234-EFGH-5678",
    start: "August 1, 2023",
    end: "July 31, 2024",
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbar}>
            <div style={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search" style={styles.searchInput} />
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
                    <select value={notiFilter} onChange={(e) => setNotiFilter(e.target.value)} style={styles.notiSelect}>
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
                      {n.durationDays && <span><strong style={{ color: THEME.textFaint }}>Duration :</strong> {n.durationDays} days</span>}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested :</strong> {n.requested}</span>
                    </div>
                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
              </div>
              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>Veiw All</div>
            </div>
          )}

          {/* Heading */}
          <div style={styles.title}>Clients</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span> &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>Client Detail</span>
          </div>

          {/* Card Info */}
          <div style={styles.card}>
            <div style={styles.typePill}>Trial Request</div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>First Name</div><div style={styles.pillInput}>{client.firstName}</div></div>
              <div><div style={styles.label}>Last Name</div><div style={styles.pillInput}>{client.lastName}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Email</div><div style={styles.pillInput}>{client.email}</div></div>
              <div><div style={styles.label}>Phone</div><div style={styles.pillInput}>{client.phone}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Country</div><div style={styles.pillInput}>{client.country}</div></div>
              <div><div style={styles.label}>Company</div><div style={styles.pillInput}>{client.company}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Industry</div><div style={styles.pillInput}>{client.industry}</div></div>
              <div><div style={styles.label}>Message</div><div style={styles.pillInput}>{client.message}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Estimate User</div><div style={styles.pillInput}>{client.estimateUser}</div></div>
              <div><div style={styles.label}>Trial</div><div style={styles.pillInput}>{client.trial}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Username</div><div style={styles.pillInput}>{client.username}</div></div>
              <div><div style={styles.label}>Password</div><div style={styles.pillInput}>{client.password}</div></div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={() => navigate("/client/:id/edit")}>Edit Client</button>
              <button style={styles.btnDanger} onClick={() => alert("Delete client")}>Delete Client</button>
            </div>
          </div>

          {/* License Section */}
          <div style={styles.sectionTitle}>License</div>
          <hr style={styles.hr} />
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product</div><div>Type</div><div>License Key</div><div>Start Date</div><div>End Date</div><div>Actions</div>
            </div>
            <div style={styles.row}>
              <div>{license.product}</div>
              <div>{license.type}</div>
              <div>{license.key}</div>
              <div>{license.start}</div>
              <div>{license.end}</div>
              <div><button style={styles.eyeBtn} onClick={() => navigate("/license")}><FiEye /></button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
