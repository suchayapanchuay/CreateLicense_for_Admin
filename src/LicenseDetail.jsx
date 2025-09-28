// src/app/LicenseDetail.jsx
import React, { useRef } from "react";
import Sidebar from "./SideBar";
import { FiFileText, FiRefreshCw, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
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

/* STYLES (ตัด topbar/notifications เดิมออก) */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

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
};

export default function LicenseDetail() {
  const navigate = useNavigate();

  // PDF target
  const pdfRef = useRef(null);

  // Export PDF (รองรับหลายหน้า)
  const handleDownloadPDF = async () => {
    const node = pdfRef.current;
    if (!node) return;

    const canvas = await html2canvas(node, {
      backgroundColor: THEME.stageBg,
      scale: window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
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

    const ts = new Date().toISOString().slice(0, 10);
    pdf.save(`License_Detail_${ts}.pdf`);
  };

  /* Mock row renderer */
  const Row = ({ label, value }) => (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={typeof value === "string" ? styles.value : undefined}>{value}</div>
    </div>
  );

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar กลาง (รีใช้ซ้ำทุกหน้า) */}
          <Topbar
            placeholder="Search licenses"
            defaultFilter="all"
            onViewAllPath="/Noti"
            onSearchChange={() => {}} // ป้องกันกรณีไม่ใช้ค่า search ในหน้านี้
          />

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>License Detail</div>
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
                  {
                    label: "Registered Email",
                    value: <a href="mailto:client@gmail.com" style={{ color: "#9CC3FF", textDecoration: "underline" }}>client@gmail.com</a>,
                  },
                ].map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
              </div>
            </div>
          </div>

          {/* Bottom Actions (อยู่นอก ref เพื่อไม่ให้ปุ่มไปอยู่ใน PDF) */}
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
