import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

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
  { id: 2, type: "trial", title: "Trial Request", client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 7,  read: true  },
  { id: 3, type: "purchase", title: "Purchase Request", client: "Client C", product: "Smart Audit", requested: "31 Aug 2025", read: false },
];

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },
  sectionTitle: { color: "#99C1FF", fontWeight: 800, marginBottom: 12 },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  row: { display: "grid", gridTemplateColumns: "1fr", gap: 18, marginBottom: 12 },
  col: { display: "flex", flexDirection: "column" },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none",
  },

  selectWrap: { position: "relative", width: 180 },
  select: {
    width: "100%", appearance: "none", background: "rgba(255,255,255,0.08)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 34px 10px 12px", fontWeight: 700, cursor: "pointer"
  },
  caret: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint },

  credBox: { border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16, marginTop: 12 },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: { border: "none", padding: "8px 10px", fontWeight: 700, borderRadius: 8, cursor: "pointer" },
  smallBtnBlue: { background: "#52B1E6", color: "#062033" },
  smallBtnGreen: { background: "#3DD9B0", color: "#062033" },

  actions: { display: "flex", gap: 12, marginTop: 20 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDanger: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#DC2626", color: "#fff" },

  /* Notifications */
  notiPanelWrap: { position: "absolute", top: 90, right: 36, width: 560, background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`, fontWeight: 900, fontSize: 22 },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: { appearance: "none", background: "#183154", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  selectCaretNoti: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${THEME.border}` },
  notiBadge: { fontSize: 13, color: THEME.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: THEME.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 6, color: THEME.textFaint, fontSize: 14, marginTop: 8 },
  notiBtn: { marginTop: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer", borderTop: `1px solid ${THEME.border}` },
  
  // Custom Styles for API Keys Detail
  apiInfoRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 12 },
  apiLabel: { color: THEME.textFaint, fontSize: 16, fontWeight: 700, marginBottom: 4 },
  apiValue: { color: THEME.text, fontSize: 16, fontWeight: 500 },
  keyBox: {
    background: "rgba(255,255,255,0.06)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    wordBreak: "break-all",
    whiteSpace: "normal"
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "green", // Default active
  },
};

/* MOCK API KEY DATA */
const MOCK_API_KEY = {
  name: "Partner A - Verify",
  scopes: "issue_license",
  status: "Active",
  id: "key_7f1e2c9a",
  createdAt: "2025-09-01",
  createdBy: "admin.karn@smartclick.co.th",
  key: "sk_live_9pS3KZN3P6JyYw4dTgQXUqLmmVbA1cD"
};

export default function ApiKeysDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(MOCK_API_KEY);
  const [showNoti, setShowNoti] = useState(false);
  const [notiFilter, setNotiFilter] = useState("all");
  const notiRef = useRef(null);
  
  // Update form state when id changes, mocking a fetch from an API
  useEffect(() => {
    // In a real app, this would be an API call to fetch the API key data based on `id`
    // For this example, we'll just use the mock data
    console.log(`Fetching API Key details for ID: ${id}`);
    setForm(MOCK_API_KEY);
  }, [id]);

  useEffect(() => {
    const onClick = (e) => { if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false); };
    const onEsc = (e) => { if (e.key === "Escape") setShowNoti(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const filteredNoti = NOTI_ITEMS.filter((n) => {
    if (notiFilter === "all") return true;
    if (notiFilter === "unread") return !n.read;
    if (notiFilter === "trial") return n.type === "trial";
    if (notiFilter === "purchase") return n.type === "purchase";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "yellow";
      case "Revoked":
        return "red";
      default:
        return "gray";
    }
  };

  const handleEdit = () => {
    alert("Functionality to edit API key goes here.");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      alert("API key deleted (mock).");
      navigate("/setting/api-keys");
    }
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
                    <FiChevronDown style={styles.selectCaretNoti} />
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
                      <span><strong style={{ color: THEME.textFaint }}>Product:</strong> {n.product}</span>
                      {n.durationDays ? (
                        <span><strong style={{ color: THEME.textFaint }}>Duration:</strong> {n.durationDays} days</span>
                      ) : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested:</strong> {n.requested}</span>
                      <span />
                    </div>

                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
                <div style={{ height: 120, borderBottom: `1px solid ${THEME.border}` }} />
              </div>

              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>View All</div>
            </div>
          )}

          {/* Heading */}
          <div style={styles.title}>API Keys Detail</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting/api-keys")}>Setting</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/setting/api-keys")}>API Keys</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>API Keys Detail</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Create API Keys</div>
            <div style={{ ...styles.row2, marginBottom: 20 }}>
              <div style={{ ...styles.col, width: "auto" }}>
                <div style={styles.label}>Name</div>
                <input value={form.name} readOnly={true} style={{ ...styles.input, width: "auto" }} />
              </div>
              <div style={{ ...styles.col, width: "auto" }}>
                <div style={styles.label}>Scopes</div>
                <div style={styles.selectWrap}>
                  <select value={form.scopes} disabled={true} style={{ ...styles.select, width: "auto" }}>
                    <option>issue_license</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>
            <div style={styles.apiInfoRow}>
              <div>
                <div style={styles.apiLabel}>Status</div>
                <div style={styles.statusIndicator}>
                  <div style={{ ...styles.statusCircle, backgroundColor: getStatusColor(form.status) }} />
                  <div style={styles.apiValue}>{form.status}</div>
                </div>
              </div>
              <div>
                <div style={styles.apiLabel}>ID</div>
                <div style={styles.apiValue}>{form.id}</div>
              </div>
              <div>
                <div style={styles.apiLabel}>Created At</div>
                <div style={styles.apiValue}>{form.createdAt}</div>
              </div>
            </div>
            <div style={styles.apiInfoRow}>
              <div style={{ gridColumn: "span 2" }}>
                <div style={styles.apiLabel}>Key</div>
                <div style={styles.keyBox}>{form.key}</div>
              </div>
              <div>
                <div style={styles.apiLabel}>Created By</div>
                <div style={styles.apiValue}>{form.createdBy}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button style={{ ...styles.btnPrimary, background: "#8B9EB8" }} onClick={handleEdit}>Edit API Keys</button>
              <button style={styles.btnDanger} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}