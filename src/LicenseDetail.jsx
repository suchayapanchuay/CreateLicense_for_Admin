import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch, FiChevronDown, FiFileText, FiRefreshCw, FiDownload } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  ok: "#22C55E",
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
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 20 },

  detailCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 22, marginTop: 8 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },

  row: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` },
  label: { color: THEME.textMut, fontWeight: 800, fontSize: 14 },
  value: { color: THEME.text, fontSize: 14 },
  valueFaint: { color: THEME.textFaint, fontSize: 14 },

  cardHeader: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 6 },
  statusBadgeOk: { display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, color: THEME.ok },

  bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 },
  leftActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  rightActions: { display: "flex", justifyContent: "flex-start" },
  btn: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 8, padding: "10px 12px", fontWeight: 800, cursor: "pointer", border: "none" },
  btnPrimary: { background: THEME.accent, color: "#fff" },
  btnGhost: { background: "rgba(255,255,255,0.08)", color: THEME.text, border: `1px solid ${THEME.border}` },

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

export default function LicenseDetail() {
  const navigate = useNavigate();

  // --- PDF target ref ---
  const pdfRef = useRef(null);

  // Notifications
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

  // --- Export PDF (multi-page safe) ---
  const handleDownloadPDF = async () => {
    const node = pdfRef.current;
    if (!node) return;

    // เพิ่มสีพื้นหลังป้องกันเป็นโปร่งใสตอน export
    const canvas = await html2canvas(node, {
      backgroundColor: THEME.stageBg,
      scale: window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio, // คมชัด
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;                 // ยืดเต็มความกว้าง A4
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let pos = 0;

    pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      pos = heightLeft - imgHeight;
      pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const ts = new Date().toISOString().slice(0,10);
    pdf.save(`License_Detail_${ts}.pdf`);
  };

  /* Mock license detail */
  const Row = ({ label, value }) => (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );

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
                      <span><strong style={{ color: THEME.textFaint }}>Product:</strong> {n.product}</span>
                      {n.durationDays && <span><strong style={{ color: THEME.textFaint }}>Duration:</strong> {n.durationDays} days</span>}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: THEME.textFaint }}>Requested:</strong> {n.requested}</span>
                    </div>
                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
              </div>
              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>View All</div>
            </div>
          )}

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Clients</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/client-details/1")}>Client Detail</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>License Detail</span>
          </div>

          {/* Detail Card (PDF target) */}
          <div style={styles.detailCard} ref={pdfRef}>
            {/* Header: Status + Activation */}
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.row}>
                  <div style={styles.label}>License Status</div>
                  <div style={styles.statusBadgeOk}><span style={{ fontSize: 18 }}>✔</span> Active</div>
                </div>
              </div>
              <div>
                <div style={styles.row}>
                  <div style={styles.label}>Activation Status</div>
                  <div style={styles.valueFaint}>Not Activated on this device</div>
                </div>
              </div>
            </div>

            {/* 2 columns */}
            <div style={styles.twoCol}>
              <div>
                {[
                  { label: "Issue Date", value: "2025-06-01" },
                  { label: "Expiration Date", value: "2026-06-01" },
                  { label: "Remaining Days", value: "315 days remaining" },
                  { label: "Product Name", value: "Smart Audit" },
                  { label: "Devices Linked", value: "2/3 Devices" },
                  { label: "Last Activation Date", value: "2025-08-15" },
                ].map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
              </div>
              <div>
                {[
                  { label: "Notes / Internal Ref.", value: "Issued via corporate plan, 2025" },
                  { label: "License Source", value: "Direct Purchase" },
                  { label: "License Type", value: "Subscription" },
                  { label: "Client / Organization", value: "BlankSpaceCo., Ltd." },
                  { label: "Registered Email", value: <a href="mailto:client@gmail.com" style={{ color: "#9CC3FF", textDecoration: "underline" }}>client@gmail.com</a> },
                ].map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
              </div>
            </div>
          </div>

          {/* Bottom Actions (อยู่นอก ref เพื่อให้ปุ่มไม่ไปอยู่ใน PDF) */}
          <div style={{ ...styles.bottomRow, marginTop: 16 }}>
            <div style={styles.leftActions}>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleDownloadPDF}>
                <FiDownload /> Download PDF
              </button>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => alert("View Terms (mock)")}>
                <FiFileText /> View Terms
              </button>
            </div>
            <div style={styles.rightActions}>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => alert("Renew License (mock)")}>
                <FiRefreshCw /> Renew License
              </button>
            </div>
          </div>
          {/* /Bottom Actions */}
        </div>
      </div>
    </div>
  );
}
