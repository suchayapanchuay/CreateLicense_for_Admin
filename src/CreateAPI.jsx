import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
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
  btnCancel: "#8B3E37",
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

  /* topbar */
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 20 },

  /* card */
  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },
  sectionTitle: { color: "#99C1FF", fontWeight: 800, marginBottom: 16 },

  row: { display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: 18, marginBottom: 16 },
  label: { color: THEME.text, fontWeight: 800, fontSize: 14 },
  input: { background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", minWidth: 280 },

selectWrap: { 
  position: "relative", 
  display: "inline-block", 
  minWidth: 180 
},
select: {
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  background: "rgba(255,255,255,0.08)",
  color: THEME.text,
  border: `1px solid ${THEME.border}`,
  borderRadius: 8,
  padding: "10px 36px 10px 12px", // มี padding ขวา 36px กัน icon ทับข้อความ
  minWidth: 180,
  fontWeight: 700,
  cursor: "pointer",
},
caret: { 
  position: "absolute", 
  right: 12,      // ห่างจากขอบขวา 12px
  top: "50%", 
  transform: "translateY(-50%)", // จัดให้ icon กลางแนวตั้ง
  pointerEvents: "none",          // ไม่ให้บังคลิก
  color: THEME.textFaint 
},

  statusWrap: { display: "flex", gap: 20, alignItems: "center" },
  statusItem: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },
  statusDot: (c) => ({ width: 14, height: 14, borderRadius: 3, background: c, border: `1px solid ${THEME.border}` }),

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnCancel: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.btnCancel, color: "#fff", opacity: 0.9 },

  /* Notifications */
  notiPanelWrap: { position: "absolute", top: 90, right: 36, width: 560, background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`, fontWeight: 900, fontSize: 22 },
  // ลบ notiSelectWrap / notiSelect เดิมไปเลย เพื่อใช้ selectWrap / select ข้างบนร่วมกัน
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${THEME.border}` },
  notiBadge: { fontSize: 13, color: THEME.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: THEME.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 6, color: THEME.textFaint, fontSize: 14, marginTop: 8 },
  notiBtn: { marginTop: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer" },
};

export default function CreateApiKey() {
  const navigate = useNavigate();

  /* form state */
  const [name, setName] = useState("Partner A – Verify");
  const [scope, setScope] = useState("issue_license");
  const [status, setStatus] = useState("active"); // active | inactive | revoke

  const onCreate = () => {
    const payload = { name, scope, status };
    console.log("Create API Key (mock):", payload);
    alert("Created! (mock)\n" + JSON.stringify(payload, null, 2));
    navigate("/settings/api-keys");
  };

  /* notifications */
  const [showNoti, setShowNoti] = useState(false);
  const [notiFilter, setNotiFilter] = useState("all");
  const notiRef = useRef(null);

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

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* topbar */}
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
                  {/* ใช้ selectWrap / select เดียวกัน */}
                  <div style={styles.selectWrap}>
                    <select value={notiFilter} onChange={(e) => setNotiFilter(e.target.value)} style={styles.select}>
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="trial">Trial</option>
                      <option value="purchase">Purchase</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
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
                      {n.durationDays ? <span><strong style={{ color: THEME.textFaint }}>Duration :</strong> {n.durationDays} days</span> : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested :</strong> {n.requested}</span>
                    </div>
                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
              </div>

              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>View All</div>
            </div>
          )}

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} >Setting</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/api-keys")}  >API Keys</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }} >Create API Keys</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Create API Keys</div>

            <div style={styles.row}>
              <div style={styles.label}>Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Scopes</div>
                      <div>
                        <div style={styles.selectWrap}>
                          <select
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            style={styles.select}
                          >
                            <option value="issue_license">issue_license</option>
                            <option value="verify_license">verify_license</option>
                            <option value="revoke_license">revoke_license</option>
                            <option value="full_access">full_access</option>
                          </select>
                          <FiChevronDown style={styles.caret} />
                        </div>
                      </div>
            </div>

            <div style={styles.row}>
              <div style={styles.label}>Status</div>
              <div style={styles.statusWrap}>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#3B82F6")} />
                  <input type="radio" name="status" value="active" checked={status === "active"} onChange={(e) => setStatus(e.target.value)} />
                  Active
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("rgba(255,255,255,0.25)")} />
                  <input type="radio" name="status" value="inactive" checked={status === "inactive"} onChange={(e) => setStatus(e.target.value)} />
                  Inactive
                </label>
                <label style={styles.statusItem}>
                  <span style={styles.statusDot("#EF4444")} />
                  <input type="radio" name="status" value="revoke" checked={status === "revoke"} onChange={(e) => setStatus(e.target.value)} />
                  Revoke
                </label>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onCreate}>Create API Keys</button>
              <button style={styles.btnCancel} onClick={() => navigate("/api-keys")}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
