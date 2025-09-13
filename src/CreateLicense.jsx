import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown } from "react-icons/fi";
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

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  sectionTitle: { fontSize: 18, fontWeight: 900, color: THEME.text, margin: "18px 0 10px" },
  hr: { height: 1, background: THEME.border, border: "none", margin: "12px 0 16px" },

  formCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.07)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none",
  },
  selectWrap: { position: "relative" },
  select: {
    width: "100%", appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
    background: "rgba(255,255,255,0.07)", color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "10px 40px 10px 12px", outline: "none", fontWeight: 600,
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  checksRow: { display: "flex", gap: 18, alignItems: "center", marginTop: 10, color: THEME.text },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },

  notes: { width: "98%", height: 44, resize: "vertical", minHeight: 44, background: "rgba(255,255,255,0.07)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text },

  /* -------- Notifications panel -------- */
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

export default function CreateLicense() {
  const navigate = useNavigate();

  /* ------------ Notifications ------------- */
  const [showNoti, setShowNoti] = useState(false);
  const [notiFilter, setNotiFilter] = useState("all");
  const notiRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false);
    };
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

  /* ------------ Form State ------------- */
  const [form, setForm] = useState({
    client: "",
    product: "",
    licenseTypes: { trial: false, subscription: false, perpetual: false },
    maxActivations: "",
    ipLock: false,
    notes: "",
  });

  const handleChange = (patch) => setForm((f) => ({ ...f, ...patch }));
  const handleLicenseType = (key) =>
    setForm((f) => ({ ...f, licenseTypes: { ...f.licenseTypes, [key]: !f.licenseTypes[key] } }));

  const onCreate = () => {
    // TODO: call API
    console.log("Create License → payload:", form);
    alert("License created (mock). ดู payload ใน console");
  };

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

          {/* Heading */}
          <div style={styles.title}>Clients</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span> &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>Create License</span>
          </div>

          {/* SECTION: Select Client & Product */}
          <div style={styles.sectionTitle}>Select Client & Product</div>
          <div style={styles.formCard}>
            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Client</div>
                <div style={styles.selectWrap}>
                  <select
                    value={form.client}
                    onChange={(e) => handleChange({ client: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">Select client</option>
                    <option value="Client A">Client A</option>
                    <option value="Client B">Client B</option>
                    <option value="Client C">Client C</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>

              <div>
                <div style={styles.label}>Product</div>
                <div style={styles.selectWrap}>
                  <select
                    value={form.product}
                    onChange={(e) => handleChange({ product: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">Select product</option>
                    <option value="Smart Audit">Smart Audit</option>
                    <option value="Smart Audit Pro">Smart Audit Pro</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>

            <div style={styles.checksRow}>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.trial}
                  onChange={() => handleLicenseType("trial")}
                />
                Trial
              </label>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.subscription}
                  onChange={() => handleLicenseType("subscription")}
                />
                Subscription
              </label>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.perpetual}
                  onChange={() => handleLicenseType("perpetual")}
                />
                Perpetual
              </label>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* SECTION: Activation & Constraints */}
          <div style={styles.sectionTitle}>Activation &amp; Constraints</div>
          <div style={styles.formCard}>
            <div>
              <div style={styles.label}>Max Activations</div>
              <div style={styles.selectWrap}>
                <select
                  value={form.maxActivations}
                  onChange={(e) => handleChange({ maxActivations: e.target.value })}
                  style={styles.select}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="unlimited">Unlimited</option>
                </select>
                <FiChevronDown style={styles.caret} />
              </div>
            </div>

            <div className="iplock" style={{ marginTop: 12 }}>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.ipLock}
                  onChange={(e) => handleChange({ ipLock: e.target.checked })}
                />
                IP Lock
              </label>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* SECTION: Notes & Internal Reference */}
          <div style={styles.sectionTitle}>Notes &amp; Internal Reference</div>
          <div style={styles.formCard}>
            <div style={styles.label}>Internal Notes</div>
            <textarea
              placeholder="Add optional notes..."
              value={form.notes}
              onChange={(e) => handleChange({ notes: e.target.value })}
              style={styles.notes}
            />
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={onCreate}>Create License</button>
            <button style={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
