// src/pages/Reports.jsx
import React, { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiDownload, FiPrinter, FiRefreshCcw, FiCalendar } from "react-icons/fi";
import Topbar from "./Topbar";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE } from "./config";

/* THEME — light */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.10)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  accent2: "#1D4ED8",
};

const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: {
    width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16,
    border: `1px solid ${THEME.border}`, padding: 24, position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)"
  },
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* Filters */
  filtersRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  selectWrap: { position: "relative" },
  select: {
    appearance: "none", background: THEME.card, color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 10,
    padding: "10px 40px 10px 12px", fontWeight: 700, minWidth: 160, cursor: "pointer",
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },
  actBtn: {
    display: "flex", alignItems: "center", gap: 8,
    border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.text,
    padding: "10px 14px", borderRadius: 10, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,.04)"
  },
  actBtnDisabled: { opacity: 0.6, pointerEvents: "none" },

  /* Stat cards */
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 },
  statCard: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)"
  },
  statTitle: { color: THEME.textMut, fontWeight: 800, marginBottom: 10 },
  statNum: { fontSize: 48, fontWeight: 900, color: THEME.text, lineHeight: 1 },
  statNumWarn: { fontSize: 48, fontWeight: 900, color: "#DC2626", lineHeight: 1 },

  /* Cards / tables */
  gridCharts: { display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: 16, marginBottom: 16 },
  card: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)"
  },
  cardHead: { fontWeight: 900, color: THEME.text, marginBottom: 12 },

  tableWrap: {
    background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)"
  },
  tableHeader: {
    background: "rgba(0,0,0,0.04)", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    padding: "12px 16px", fontWeight: 800, color: THEME.text
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text
  },

  /* Mini bars */
  barRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 12 },
  bar: { height: 10, borderRadius: 99, background: "rgba(0,0,0,0.06)", overflow: "hidden" },
  barFill: (w) => ({ height: "100%", width: `${w}%`, background: THEME.accent2 }),

  muted: { color: THEME.textMut, fontSize: 13 },
};

/* Donut */
function Donut({ valueA = 0, valueB = 0, valueC = 0, offset = -12 }) {
  const r = 56, cx = 100, cy = 100;
  const circ = 2 * Math.PI * r;
  const seg = (p) => `${(p / 100) * circ} ${circ}`;
  const total = Math.max(0, valueA + valueB + valueC) || 1;
  const aPct = Math.round((valueA / total) * 100);

  return (
    <div style={{ display: "flex", gap: 16, marginLeft: offset }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        <circle cx={cx} cy={cy} r={r} stroke="rgba(0,0,0,0.08)" strokeWidth="20" fill="none" />
        <circle cx={cx} cy={cy} r={r} stroke="#93C5FD" strokeWidth="20" fill="none" strokeDasharray={seg((valueA/total)*100)} transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} stroke="#60A5FA" strokeWidth="20" fill="none" strokeDasharray={seg((valueB/total)*100)} transform={`rotate(${(360 * (valueA/total*100)) / 100 - 90} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} stroke="#2563EB" strokeWidth="20" fill="none" strokeDasharray={seg((valueC/total)*100)} transform={`rotate(${(360 * ((valueA+valueB)/total*100)) / 100 - 90} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={36} fill="#FFFFFF" stroke="rgba(0,0,0,0.06)" />
        <text x={cx} y={cy + 6} textAnchor="middle" fill={THEME.text} fontWeight="800" fontSize="20">{aPct}%</text>
      </svg>

      <div style={{ display: "grid", gap: 10, alignContent: "center" }}>
        <LegendRow color="#93C5FD" label="0 - 7 days" value={valueA} />
        <LegendRow color="#60A5FA" label="8 - 30 days" value={valueB} />
        <LegendRow color="#2563EB" label="> 30 days" value={valueC} />
      </div>
    </div>
  );
}
const LegendRow = ({ color, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, color: THEME.text, fontWeight: 600 }}>
    <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
    {label} <span style={{ marginLeft: 10, color: THEME.textMut }}>{value}</span>
  </div>
);

const RangeButton = forwardRef(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: THEME.card,
      color: THEME.text,
      border: `1px solid ${THEME.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      fontWeight: 800,
      cursor: "pointer",
      minWidth: 220,
      justifyContent: "space-between",
      boxShadow: "0 4px 10px rgba(0,0,0,.04)"
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <FiCalendar />
      {value || "calendar"}
    </span>
    <FiChevronDown style={{ color: THEME.textFaint }} />
  </button>
));

const fmt = (d) =>
  d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}` : "";
const toYMD = (d) =>
  d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "";

export default function Reports() {
  const stageRef = useRef(null);
  const onSearchNoop = () => {};

  // ----- filters -----
  const [range, setRange] = useState("7");
  const [licenseType, setLicenseType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onDateChange = (dates) => {
    const [s, e] = dates;
    setStartDate(s);
    setEndDate(e);
  };
  const rangeLabel =
    startDate && endDate ? `${fmt(startDate)} - ${fmt(endDate)}` : startDate ? `${fmt(startDate)} - …` : "";

  // ----- data state -----
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [stats, setStats] = useState({
    active_licenses: 0,
    expiring_7d: 0,
    trial_licenses: 0,
    revoked_licenses: 0,
  });
  const [series, setSeries] = useState({ purchase: [], trial: [] });
  const [dailyRows, setDailyRows] = useState([]);
  const [buckets, setBuckets] = useState([
    { name: "0–7 days", value: 0 },
    { name: "8–30 days", value: 0 },
    { name: "> 30 days", value: 0 },
  ]);
  const [expiredCount, setExpiredCount] = useState(null);
  const [topClients, setTopClients] = useState([]);
  const [renewing, setRenewing] = useState(false);

  const usageData = useMemo(() => {
    const len = Math.max(series.purchase.length, series.trial.length);
    return Array.from({ length: len }, (_, i) => ({
      x: i,
      purchase: series.purchase[i] ?? 0,
      trial: series.trial[i] ?? 0,
    }));
  }, [series]);

  const fetchReports = async () => {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start", toYMD(startDate));
      if (endDate) params.set("end", toYMD(endDate));
      if (!startDate || !endDate) params.set("range_days", String(range || "7"));
      params.set("license_type", licenseType);
      params.set("include_expired", "true");

      const url = `${API_BASE}/reports/metrics?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
      const data = await res.json();

      setStats(data?.stats ?? stats);
      setSeries({
        purchase: data?.series?.purchase ?? data?.series?.active ?? [],
        trial: data?.series?.trial ?? [],
      });
      setDailyRows(Array.isArray(data?.daily_table) ? data.daily_table : []);
      setBuckets(Array.isArray(data?.expiry_buckets) ? data.expiry_buckets : buckets);
      setTopClients(Array.isArray(data?.top_clients) ? data.top_clients : []);
      setExpiredCount(typeof data?.expired_bucket?.value === "number" ? data.expired_bucket.value : null);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchReports();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, licenseType, startDate, endDate]);

  const handleExport = () => {
    const lines = [];
    lines.push("License Usage Over Time");
    lines.push("index,purchase,trial");
    usageData.forEach((r, i) => lines.push([i, r.purchase, r.trial].join(",")));
    lines.push("");

    lines.push("Daily Summary");
    lines.push("date,new,expired,revoked");
    dailyRows.forEach((r) => lines.push([r.date, r.new, r.expired, r.revoked].join(",")));
    lines.push("");

    lines.push("Top Client With Most License");
    lines.push("name,pct");
    topClients.forEach((c) => lines.push([c.name, c.pct].join(",")));

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `reports-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const w = window.open("", "PRINT", "height=800,width=1100");
    if (!w) return;
    const html = `
      <html>
        <head>
          <title>Reports</title>
          <style>
            body { background: ${THEME.pageBg}; color: ${THEME.text}; font-family: Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial; }
            .stage { background: ${THEME.stageBg}; color: ${THEME.text}; border: 1px solid ${THEME.border}; border-radius: 16px; padding: 24px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="stage">${stageRef.current?.innerHTML || ""}</div>
        </body>
      </html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleReload = () => {
    setRenewing(true);
    fetchReports().finally(() => setRenewing(false));
  };

  const b0 = buckets[0]?.value || 0,
    b1 = buckets[1]?.value || 0,
    b2 = buckets[2]?.value || 0;

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage} ref={stageRef}>
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar placeholder="Search reports" onSearchChange={onSearchNoop} defaultFilter="all" onViewAllPath="/Noti" />
            </div>
          </div>

          <div style={styles.title}>Reports</div>

          {/* Filters */}
          <div style={styles.filtersRow}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={onDateChange}
              isClearable
              customInput={<RangeButton value={rangeLabel} />}
              popperPlacement="bottom-start"
            />

            <div style={styles.selectWrap}>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                style={styles.select}
                disabled={!!startDate || !!endDate}
              >
                <option value="1">Today</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            <div style={styles.selectWrap}>
              <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} style={styles.select}>
                <option value="all">License type</option>
                <option value="trial">Trial</option>
                <option value="subscription">Subscription</option>
                <option value="perpetual">Perpetual</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              <button style={{ ...styles.actBtn }} onClick={handleExport} title="Export CSV">
                <FiDownload /> Export
              </button>

              <button style={{ ...styles.actBtn }} onClick={handlePrint} title="Print">
                <FiPrinter /> Print
              </button>

              <button
                style={{ ...styles.actBtn, ...(renewing ? styles.actBtnDisabled : {}) }}
                onClick={handleReload}
                title="Reload"
              >
                <FiRefreshCcw style={renewing ? { animation: "spin .9s linear infinite" } : {}} />
                {renewing ? "Reloading..." : "Reload"}
              </button>
            </div>
          </div>

          {/* Loading / Error */}
          {loading && <div style={styles.muted}>Loading reports…</div>}
          {err && !loading && <div style={{ ...styles.muted, color: "#DC2626" }}>Error: {err}</div>}

          {/* Stat cards */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Active Licenses</div>
              <div style={styles.statNum}>{stats.active_licenses ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Expiring 7 days</div>
              <div style={styles.statNumWarn}>{stats.expiring_7d ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Trial Requests</div>
              <div style={styles.statNum}>{stats.trial_licenses ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Revoked License</div>
              <div style={styles.statNum}>{stats.revoked_licenses ?? 0}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={styles.gridCharts}>
            <div style={styles.card}>
              <div style={styles.cardHead}>License Usage Over Time</div>
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart data={usageData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                    <XAxis dataKey="x" stroke="rgba(0,0,0,0.55)" />
                    <YAxis stroke="rgba(0,0,0,0.55)" />
                    <Tooltip
                      contentStyle={{ background: "#FFFFFF", border: `1px solid ${THEME.border}`, color: THEME.text }}
                      labelStyle={{ color: THEME.textMut }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="purchase" stroke={THEME.accent} strokeWidth={3} dot={false} name="Purchase" />
                    <Line type="monotone" dataKey="trial" stroke="rgba(2,6,23,0.45)" strokeDasharray="6 6" dot={false} name="Trial" />
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHead}>License Expiry</div>
              <Donut valueA={b0} valueB={b1} valueC={b2} offset={-16} />
              {b0 + b1 + b2 === 0 && (
                <div style={{ marginTop: 8, color: THEME.textMut, fontSize: 13 }}>
                  No upcoming expiries (0–30+ days).
                  {expiredCount != null && (
                    <> Expired: <b style={{ color: THEME.text }}>{expiredCount}</b></>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Table + Top Clients */}
          <div style={styles.gridCharts}>
            <div style={styles.tableWrap}>
              <div style={styles.tableHeader}>
                <div>Date</div>
                <div>New Activate</div>
                <div>Expired</div>
                <div>Revoked</div>
              </div>
              {dailyRows.map((r, i) => (
                <div key={i} style={styles.tableRow}>
                  <div>{r.date}</div>
                  <div>{r.new}</div>
                  <div>{r.expired}</div>
                  <div>{r.revoked}</div>
                </div>
              ))}
              {!dailyRows.length && (
                <div style={{ padding: 16, color: THEME.textMut }}>No data in selected range.</div>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHead}>Top Client With Most License</div>
              {(topClients.length ? topClients : []).map((c) => (
                <div key={c.name} style={styles.barRow}>
                  <div style={{ color: THEME.text }}>{c.name}</div>
                  <div style={{ width: 240 }}>
                    <div style={styles.bar}>
                      <div style={styles.barFill(c.pct)} />
                    </div>
                  </div>
                </div>
              ))}
              {!topClients.length && <div style={{ color: THEME.textMut }}>No client data.</div>}
            </div>
          </div>

          {/* Datepicker (light override) */}
          <style>{`
            .react-datepicker {
              background: #ffffff;
              border: 1px solid ${THEME.border};
              color: ${THEME.text};
              box-shadow: 0 8px 24px rgba(0,0,0,.08);
            }
            .react-datepicker__header {
              background-color: #F3F4F6;
              border-bottom: 1px solid ${THEME.border};
            }
            .react-datepicker__current-month, .react-datepicker__day-name {
              color: ${THEME.text};
              font-weight: 700;
            }
            .react-datepicker__day { color: ${THEME.text}; }
            .react-datepicker__day--selected,
            .react-datepicker__day--in-range,
            .react-datepicker__day--keyboard-selected { background-color: ${THEME.accent}; color: #fff; }
            .react-datepicker__day:hover { background-color: rgba(37,99,235,0.15); }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </div>
  );
}
