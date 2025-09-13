import React, { useEffect, useRef, useState } from "react";
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

  /* Topbar */
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 220, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 8 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  section: { padding: 16 },
  sectionHead: { fontWeight: 900, color: THEME.text, marginBottom: 12, opacity: 0.9 },
  divider: { height: 1, background: THEME.border, border: "none" },

  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  field: { display: "grid", gap: 8 }, 
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700 ,marginBottom: 8}, 
  input: {
    width: "80%",
    background: "rgba(255,255,255,0.07)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
    marginBottom: 8
  },
  selectWrap: { position: "relative", width: "80%" },
  select: {
    width: "100%",
    appearance: "none",
    background: "rgba(255,255,255,0.07)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 38px 10px 12px",
    outline: "none",
    fontWeight: 600,
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  checksRow: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },

  actions: { display: "flex", gap: 10, marginTop: 16 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDangerGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: "#E26D64" },

  /* Notifications panel */
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

export default function EditProduct() {
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

  /* Form (prefill) */
  const [form, setForm] = useState({
    productName: "Smart Audit",
    productCode: "smartaudit",
    status: "active",
    description: "Audit and compliance management tool",
    version: "1.0.0",
    category: "Accounting Software",
    typeTrial: true,
    typeSubscription: true,
    typePerpetual: true,
    licenseDuration: "365",
    limitSeatsEnabled: true,
    limitSeats: "100",
    limitDeviceEnabled: true,
    limitDevice: "5",
    rateLimitEnabled: true,
    rateLimit: "100 req/day",
  });

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onSave = () => {
    console.log("Save Product (mock) →", form);
    alert("Changes saved (mock). ดู payload ใน console");
    // navigate("/product/1"); // ถ้าต้องกลับหน้า detail
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
                      {n.durationDays ? <span><strong style={{ color: THEME.textFaint }}>Duration :</strong> {n.durationDays} days</span> : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested :</strong> {n.requested}</span>
                      <span />
                    </div>
                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
              </div>
              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>Veiw All</div>
            </div>
          )}

          {/* Heading & breadcrumb */}
          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>Product</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/product-details/:id")}>Product Detail</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Edit Product</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            {/* Product Information */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Product Information</div>

              <div style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Product Name</div>
                  <input style={styles.input} value={form.productName} onChange={(e) => patch("productName", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Product Code</div>
                  <input style={styles.input} value={form.productCode} onChange={(e) => patch("productCode", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Status</div>
                  <div style={styles.selectWrap}>
                    <select style={styles.select} value={form.status} onChange={(e) => patch("status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>

              <div style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Description</div>
                  <input style={styles.input} value={form.description} onChange={(e) => patch("description", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Version</div>
                  <input style={styles.input} value={form.version} onChange={(e) => patch("version", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Category</div>
                  <div style={styles.selectWrap}>
                    <select style={styles.select} value={form.category} onChange={(e) => patch("category", e.target.value)}>
                      <option>Accounting Software</option>
                      <option>Cloud Services</option>
                      <option>Developer Tools</option>
                      <option>HR & Payroll</option>
                      <option>Security</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* License Policy */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>License Policy</div>

              <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 16, justifyContent: "start", alignItems: "end" }}>
                <div>
                  <div style={styles.label}>Supported License Types</div>
                  <div style={{ ...styles.checksRow, marginTop: 8 }}>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeTrial} onChange={(e) => patch("typeTrial", e.target.checked)} /> Trial
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeSubscription} onChange={(e) => patch("typeSubscription", e.target.checked)} /> Subscription
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typePerpetual} onChange={(e) => patch("typePerpetual", e.target.checked)} /> Perpetual
                    </label>
                  </div>
                </div>

                <div style={{ justifySelf: "start", width: 220 }}>
                  <div style={styles.label}>License Duration</div>
                  <div style={{ ...styles.selectWrap, width: "100%" }}>
                    <select style={styles.select} value={form.licenseDuration} onChange={(e) => patch("licenseDuration", e.target.value)}>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">365 days</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* Constraints */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Constraints</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.limitSeatsEnabled} onChange={(e) => patch("limitSeatsEnabled", e.target.checked)} /> Max Seats
                  </label>
                  <input style={styles.input} type="number" value={form.limitSeats} onChange={(e) => patch("limitSeats", e.target.value)} />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.limitDeviceEnabled} onChange={(e) => patch("limitDeviceEnabled", e.target.checked)} /> Max Device
                  </label>
                  <input style={styles.input} type="number" value={form.limitDevice} onChange={(e) => patch("limitDevice", e.target.value)} />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.rateLimitEnabled} onChange={(e) => patch("rateLimitEnabled", e.target.checked)} /> Rate Limit
                  </label>
                  <input style={styles.input} value={form.rateLimit} onChange={(e) => patch("rateLimit", e.target.value)} />
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={onSave}>Save Change</button>
                <button style={styles.btnDangerGhost} onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  );
}
