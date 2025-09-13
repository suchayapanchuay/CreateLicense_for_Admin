import React, { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown, FiEye } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

/* THEME (คงชุดเดิม) */
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

/* MOCK PRODUCTS */
const ALL_PRODUCTS = [
  { id: 1, name: "Smart Audit", category: "Accounting Software", status: "active" },
  { id: 2, name: "Product B",   category: "Cloud Services",       status: "active" },
  { id: 3, name: "Product D",   category: "Developer Tools",      status: "active" },
  { id: 4, name: "Product C",   category: "HR & Payroll",         status: "active" },
];

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* topbar */
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 220, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* toolbar */
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none", background: THEME.card, color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "8px 34px 8px 12px", fontWeight: 700, cursor: "pointer",
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textMut, pointerEvents: "none" },
  addBtn: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#27A9FF", color: "#062033" },

  /* table */
  tableWrap: { borderRadius: 12, overflow: "hidden", background: THEME.card, border: `1px solid ${THEME.border}` },
  header: {
    background: "rgba(255,255,255,0.08)",
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "12px 18px",
    color: THEME.text,
    fontWeight: 800,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "16px 18px",
    color: THEME.text,
    borderTop: `1px solid ${THEME.border}`,
    alignItems: "center",
  },
  statusBadge: (type) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    background: type === "active" ? "#A3E635" : "#94A3B8",
    color: type === "active" ? "#0C2712" : "#1E293B",
  }),
  eyeBtn: { width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },

  /* pagination */
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer", background: "transparent", fontWeight: 600 },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 8, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800, border: `1px solid ${THEME.border}` },

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

export default function Products() {
  const navigate = useNavigate();

  /* notifications */
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

  /* table state */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const products = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const hit =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const statusOK = statusFilter === "all" ? true : p.status === statusFilter;
      return hit && statusOK;
    });
  }, [search, statusFilter]);

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
          <div style={styles.title}>Products</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div className="left">
              <div style={styles.selectWrap}>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                  <option value="all">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FiChevronDown style={styles.caret} />
              </div>
            </div>
            <button style={styles.addBtn} onClick={() => navigate("/product/add")}>+ Add Product</button>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product Name</div>
              <div>Category</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {products.map((p) => (
              <div key={p.id} style={styles.row}>
                <div>{p.name}</div>
                <div>{p.category}</div>
                <div><span style={styles.statusBadge(p.status)}>{p.status === "active" ? "Active" : "Inactive"}</span></div>
                <div><button style={styles.eyeBtn} onClick={() => navigate("/product-details/:id")}><FiEye /></button></div>
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
