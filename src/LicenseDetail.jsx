// src/app/LicenseDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./SideBar";
import { FiFileText, FiRefreshCw, FiDownload, FiCopy, FiCheck } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { API_BASE } from "./config";

/* THEME */
const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  cardGrad: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.00) 100%)",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.94)",
  textMut: "rgba(255,255,255,0.72)",
  textFaint: "rgba(255,255,255,0.55)",
  accent: "#3B82F6",
  ok: "#22C55E",
  warn: "#F59E0B",
  danger: "#EF4444",
};

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px", letterSpacing: 0.2 },
  breadcrumb: { color: THEME.textFaint, fontWeight: 600, marginBottom: 18 },

  headerCard: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  headerGrad: {
    position: "absolute",
    inset: 0,
    background: THEME.cardGrad,
    pointerEvents: "none",
  },
  headerGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, position: "relative" },

  hTitle: { fontSize: 18, fontWeight: 900, color: THEME.text, marginBottom: 6 },
  mini: { fontSize: 13, color: THEME.textFaint, fontWeight: 700 },

  badge: (tone = "ok") => {
    const color = tone === "ok" ? THEME.ok : tone === "warn" ? THEME.warn : THEME.danger;
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.06)",
      border: `1px solid ${THEME.border}`,
      padding: "8px 12px",
      borderRadius: 999,
      fontWeight: 900,
      color,
    };
  },

  keyChipWrap: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  keyChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${THEME.border}`,
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    color: THEME.text,
    letterSpacing: 0.4,
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${THEME.border}`,
    padding: "8px 10px",
    borderRadius: 10,
    fontWeight: 800,
    color: THEME.text,
    cursor: "pointer",
  },

  usage: { marginTop: 10 },
  bar: { height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", border: `1px solid ${THEME.border}` },
  barFill: (pct) => ({ height: "100%", width: `${pct}%`, background: THEME.accent }),

  /* details table */
  table: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 16, overflow: "hidden" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "14px 18px", borderBottom: `1px solid ${THEME.border}` },
  cellLabel: { color: THEME.text, fontWeight: 900 },
  cellValue: { color: THEME.textMut, fontWeight: 800, textAlign: "right" },

  /* buttons bottom */
  bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 },
  leftActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  rightActions: { display: "flex", justifyContent: "flex-start" },
  btn: { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, padding: "10px 12px", fontWeight: 900, cursor: "pointer", border: "none" },
  btnPrimary: { background: THEME.accent, color: "#fff" },
  btnGhost: { background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}` },

  err: { marginBottom: 12, color: "#FCA5A5", fontWeight: 800 },

  /* skeleton */
  skel: { display: "inline-block", height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 8, width: 140 },
  skelWide: { display: "inline-block", height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 8, width: 220 },
};

function fmtDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return String(s);
  return d.toLocaleString();
}
function remainingDays(expiresAt) {
  if (!expiresAt) return "-";
  const ms = new Date(expiresAt) - new Date();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days >= 0 ? `${days} days` : `${-days} days overdue`;
}
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

export default function LicenseDetail() {
  const navigate = useNavigate();
  const { id: licenseId } = useParams();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const pdfRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!licenseId) { setErr("Missing license id"); setLoading(false); return; }
      setErr(""); setLoading(true);
      try {
        const lic = await getJSON(`${API_BASE}/licenses/${licenseId}`);
        if (!alive) return;
        setData(lic);
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [licenseId]);

  const devicesPct = useMemo(() => {
    const used = data?.activations_used ?? 0;
    const max = data?.max_activations ?? 0;
    if (!max) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  }, [data]);

  const rowsLeft = useMemo(() => ([
    ["License Status", loading ? <span style={styles.skelWide}/> : (data?.status || "-")],
    ["Issue Date", loading ? <span style={styles.skel}/> : fmtDate(data?.issued_at)],
    ["Expiration Date", loading ? <span style={styles.skel}/> : fmtDate(data?.expires_at)],
    ["Remaining Days", loading ? <span style={styles.skel}/> : remainingDays(data?.expires_at)],
    ["Product SKU", loading ? <span style={styles.skel}/> : (data?.product_sku || "-")],
  ]), [loading, data]);

  const rowsRight = useMemo(() => ([
    ["Activation Status", loading ? <span style={styles.skel}/> : (data?.activations_used > 0 ? "Activated" : "Not Activated")],
    ["License Type", loading ? <span style={styles.skel}/> : (data?.term || "-")],
    ["Client ID", loading ? <span style={styles.skel}/> : (data?.client_id ?? "-")],
    ["Created At", loading ? <span style={styles.skel}/> : fmtDate(data?.created_at)],
    ["License Source", "System"],
  ]), [loading, data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(data?.license_key || ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  };

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
    pdf.save(`License_${data?.license_key || licenseId}_${ts}.pdf`);
  };

  const statusTone = !data?.expires_at
    ? "ok"
    : (new Date(data.expires_at) > new Date() ? "ok" : "danger");

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <Topbar placeholder="Search licenses" defaultFilter="all" onViewAllPath="/Noti" onSearchChange={() => {}} />

          <div style={styles.title}>License Detail</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>License Detail</span>
          </div>

          {err ? <div style={styles.err}>{err}</div> : null}

          {/* ===== Header Card (สวย/กะทัดรัด) ===== */}
          <div style={styles.headerCard} ref={pdfRef}>
            <div style={styles.headerGrad} />
            <div style={styles.headerGrid}>
              {/* left: status + key */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={styles.hTitle}>Status</div>
                  <div style={styles.badge(statusTone)}>
                    <span style={{ fontSize: 16 }}>●</span>
                    {loading ? "Loading..." : (data?.status || "-")}
                  </div>
                </div>

                <div className="keychip" style={styles.keyChipWrap}>
                  <div style={styles.mini}>License Key</div>
                  <div style={styles.keyChip}>
                    {loading ? "••••-••••-••••-••••" : (data?.license_key || "-")}
                  </div>
                  <button style={styles.ghostBtn} onClick={handleCopy} title="Copy License Key">
                    {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={styles.mini}>Issue Date</div>
                    <div style={{ fontWeight: 900, color: THEME.text }}>{loading ? "Loading..." : fmtDate(data?.issued_at)}</div>
                  </div>
                  <div>
                    <div style={styles.mini}>Expiration</div>
                    <div style={{ fontWeight: 900, color: THEME.text }}>
                      {loading ? "Loading..." : fmtDate(data?.expires_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* right: devices usage */}
              <div>
                <div style={styles.hTitle}>Device Usage</div>
                <div style={styles.mini}>
                  {loading ? "Loading..." : `${data?.activations_used ?? 0} / ${data?.max_activations ?? 0} devices`}
                </div>
                <div style={styles.usage}>
                  <div style={styles.bar}>
                    <div style={styles.barFill(devicesPct)} />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={styles.mini}>Remaining Days</div>
                  <div style={{ fontWeight: 900, color: THEME.text }}>
                    {loading ? "Loading..." : remainingDays(data?.expires_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Details Table ===== */}
          <div style={styles.table}>
            {rowsLeft.map(([label, value], i) => (
              <div key={`L-${i}`} style={styles.row}>
                <div style={styles.cellLabel}>{label}</div>
                <div style={styles.cellValue}>{value}</div>
              </div>
            ))}
            {rowsRight.map(([label, value], i) => (
              <div key={`R-${i}`} style={styles.row}>
                <div style={styles.cellLabel}>{label}</div>
                <div style={styles.cellValue}>{value}</div>
              </div>
            ))}
          </div>

          {/* ===== Bottom Actions ===== */}
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
        </div>
      </div>
    </div>
  );
}
