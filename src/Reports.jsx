// src/pages/Reports.jsx
import React, { useMemo, useRef, useState, forwardRef } from "react";
import Sidebar from "./SideBar";
import {
  FiChevronDown,
  FiDownload,
  FiPrinter,
  FiRefreshCcw,
  FiCalendar,
} from "react-icons/fi";
//import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

/* ---- Charts ---- */
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

/* ---- Date Picker ---- */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  accent2: "#67B3FF",
};

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* topbar row (Topbar only to match ProductDetail.jsx) */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* filters row */
  filtersRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  selectWrap: { position: "relative" },
  select: {
    appearance: "none", background: THEME.card, color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 10,
    padding: "10px 40px 10px 12px", fontWeight: 700, minWidth: 160, cursor: "pointer",
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },
  actBtn: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, background: "#1B365A", color: THEME.text, padding: "10px 14px", borderRadius: 10, fontWeight: 800, cursor: "pointer" },
  actBtnDisabled: { opacity: 0.6, pointerEvents: "none" },

  /* stat cards */
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 },
  statCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16 },
  statTitle: { color: THEME.textMut, fontWeight: 800, marginBottom: 10 },
  statNum: { fontSize: 48, fontWeight: 900, color: THEME.text, lineHeight: 1 },
  statNumWarn: { fontSize: 48, fontWeight: 900, color: "#FF6969", lineHeight: 1 },

  /* grid for charts */
  gridCharts: { display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: 16, marginBottom: 16 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16 },
  cardHead: { fontWeight: 900, color: THEME.text, marginBottom: 12 },

  /* table */
  tableWrap: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  tableHeader: { background: "rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "12px 16px", fontWeight: 800, color: THEME.text },
  tableRow: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text },

  /* progress bars */
  barRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 12 },
  bar: { height: 10, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" },
  barFill: (w) => ({ height: "100%", width: `${w}%`, background: THEME.accent2 }),
};

/* Donut chart (SVG) */
function Donut({ valueA = 20, valueB = 26, valueC = 52, offset = -12 }) {
  const r = 56, cx = 100, cy = 100;
  const circ = 2 * Math.PI * r;
  const seg = (p) => `${(p / 100) * circ} ${circ}`

  return (
    <div style={{ display: "flex", gap: 16, marginLeft: offset }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="20" fill="none" />
        <circle cx={cx} cy={cy} r={r} stroke="#9DBBFF" strokeWidth="20" fill="none" strokeDasharray={seg(valueA)} transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} stroke="#6CA0FF" strokeWidth="20" fill="none" strokeDasharray={seg(valueB)} transform={`rotate(${(360 * valueA) / 100 - 90} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} stroke="#2F6BD2" strokeWidth="20" fill="none" strokeDasharray={seg(valueC)} transform={`rotate(${(360 * (valueA + valueB)) / 100 - 90} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={36} fill="#0D2039" />
        <text x={cx} y={cy + 6} textAnchor="middle" fill={THEME.text} fontWeight="800" fontSize="20">{valueA}%</text>
      </svg>

      <div style={{ display: "grid", gap: 10, alignContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: THEME.text, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 999, background: "#9DBBFF" }} /> 0 - 7 days <span style={{ marginLeft: 10, color: THEME.textMut }}>20 %</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: THEME.text, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 999, background: "#6CA0FF" }} /> 8 - 30 days <span style={{ marginLeft: 10, color: THEME.textMut }}>26 %</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: THEME.text, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 999, background: "#2F6BD2" }} /> &gt; 30 days <span style={{ marginLeft: 10, color: THEME.textMut }}>52 %</span></div>
      </div>
    </div>
  );
}

/* Custom input for DatePicker */
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
      minWidth: 180,
      justifyContent: "space-between",
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <FiCalendar />
      {value || "calendar"}
    </span>
    <FiChevronDown style={{ color: THEME.textFaint }} />
  </button>
));

/* Helper */
const fmt = (d) =>
  d
    ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    : "";

export default function Reports() {
  const stageRef = useRef(null);

  // ให้เหมือน ProductDetail.jsx: ใช้ Topbar และส่ง no-op กัน onSearchChange error
  const onSearchNoop = () => {};

  /* filters */
  const [range, setRange] = useState("7");
  const [licenseType, setLicenseType] = useState("all");

  // calendar (date range)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const rangeLabel =
    startDate && endDate ? `${fmt(startDate)} - ${fmt(endDate)}` : startDate ? `${fmt(startDate)} - …` : "";

  /* ----------- DATA (state) ----------- */
  const [series, setSeries] = useState({
    active: [120, 350, 680, 640, 700, 820, 780],
    trial: [120, 200, 300, 300, 420, 520, 620],
  });

  const usageData = useMemo(
    () =>
      Array.from({ length: Math.max(series.active.length, series.trial.length) }, (_, i) => ({
        x: i * 5,
        active: series.active[i] ?? null,
        trial: series.trial[i] ?? null,
      })),
    [series]
  );

  const [table, setTable] = useState([
    { date: "20/08/2025", new: 3, expired: 1, revoked: 3 },
    { date: "21/08/2025", new: 2, expired: 0, revoked: 2 },
    { date: "22/08/2025", new: 4, expired: 2, revoked: 4 },
  ]);

  const [topClients] = useState([
    { name: "Client A", pct: 68 },
    { name: "Client B", pct: 42 },
    { name: "Client C", pct: 80 },
  ]);

  const [renewing, setRenewing] = useState(false);

  /* ----------- ACTIONS: EXPORT / PRINT / RENEW ----------- */
  const handleExport = () => {
    const lines = [];

    // Section 1: Usage
    lines.push("License Usage Over Time");
    lines.push("x,active,trial");
    usageData.forEach((r) => lines.push([r.x, r.active ?? "", r.trial ?? ""].join(",")));
    lines.push("");

    // Section 2: Daily table
    lines.push("Daily Summary");
    lines.push("date,new,expired,revoked");
    table.forEach((r) => lines.push([r.date, r.new, r.expired, r.revoked].join(",")));
    lines.push("");

    // Section 3: Top clients
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
            body { background: ${THEME.pageBg}; color: ${THEME.text}; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
            .stage { background: ${THEME.stageBg}; color: ${THEME.text}; border: 1px solid ${THEME.border}; border-radius: 16px; padding: 24px; }
            .hide-print { display: none; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="stage">${stageRef.current?.innerHTML || ""}</div>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleRenew = () => {
    if (renewing) return;
    setRenewing(true);

    // mock transform: randomize trends a bit
    const jitter = () => Array.from({ length: 7 }, (_, i) => Math.max(0, Math.round(100 + i * 90 + (Math.random() - 0.5) * 120)));
    const jitter2 = () => Array.from({ length: 7 }, (_, i) => Math.max(0, Math.round(80 + i * 70 + (Math.random() - 0.5) * 100)));

    setTimeout(() => {
      setSeries({ active: jitter(), trial: jitter2() });
      setTable((prev) =>
        prev.map((r) => ({
          ...r,
          new: Math.max(0, r.new + Math.round((Math.random() - 0.5) * 4)),
          expired: Math.max(0, r.expired + Math.round((Math.random() - 0.5) * 2)),
          revoked: Math.max(0, r.revoked + Math.round((Math.random() - 0.5) * 3)),
        }))
      );
      setRenewing(false);
    }, 800);
  };

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage} ref={stageRef}>
          {/* Topbar (เหมือน ProductDetail.jsx: ใช้คอมโพเนนต์ Topbar แทนกระดิ่ง/แผงแจ้งเตือนภายในหน้า) */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search reports"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          <div style={styles.title}>Reports</div>

          {/* Filters */}
          <div style={styles.filtersRow}>
            {/* Calendar (Date Range) */}
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={onDateChange}
              isClearable
              customInput={<RangeButton value={rangeLabel} />}
              popperPlacement="bottom-start"
            />

            {/* Last N days */}
            <div style={styles.selectWrap}>
              <select value={range} onChange={(e) => setRange(e.target.value)} style={styles.select}>
                <option>Today</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            {/* License type */}
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
              <button
                style={{ ...styles.actBtn }}
                onClick={handleExport}
                title="Export CSV"
              >
                <FiDownload /> Export
              </button>

              <button
                style={{ ...styles.actBtn }}
                onClick={handlePrint}
                title="Print"
              >
                <FiPrinter /> Print
              </button>

              <button
                style={{ ...styles.actBtn, ...(renewing ? styles.actBtnDisabled : {}) }}
                onClick={handleRenew}
                title="Renew Data"
              >
                <FiRefreshCcw style={renewing ? { animation: "spin .9s linear infinite" } : {}} />
                {renewing ? "Renewing..." : "Renew Data"}
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Active Licenses</div>
              <div style={styles.statNum}>35</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Expiring 7 days</div>
              <div style={styles.statNumWarn}>5</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Trial Licenses</div>
              <div style={styles.statNum}>19</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Rework License</div>
              <div style={styles.statNum}>10</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={styles.gridCharts}>
            {/* License Usage Over Time */}
            <div style={styles.card}>
              <div style={styles.cardHead}>License Usage Over Time</div>

              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart data={usageData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <XAxis dataKey="x" stroke="rgba(255,255,255,0.55)" />
                    <YAxis stroke="rgba(255,255,255,0.55)" />
                    <Tooltip
                      contentStyle={{
                        background: "#0E1D33",
                        border: `1px solid ${THEME.border}`,
                        color: THEME.text,
                      }}
                      labelStyle={{ color: THEME.textMut }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#67B3FF" strokeWidth={3} dot={false} name="Active" />
                    <Line type="monotone" dataKey="trial" stroke="rgba(255,255,255,0.6)" strokeDasharray="6 6" dot={false} name="Trial" />
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut */}
            <div style={styles.card}>
              <div style={styles.cardHead}>License Expiry</div>
              <Donut valueA={20} valueB={26} valueC={52} offset={-16} />
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
              {table.map((r, i) => (
                <div key={i} style={styles.tableRow}>
                  <div>{r.date}</div>
                  <div>{r.new}</div>
                  <div>{r.expired}</div>
                  <div>{r.revoked}</div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHead}>Top Client With Most License</div>

              {topClients.map((c) => (
                <div key={c.name} style={styles.barRow}>
                  <div style={{ color: THEME.text }}>{c.name}</div>
                  <div style={{ width: 240 }}>
                    <div style={styles.bar}>
                      <div style={styles.barFill(c.pct)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark theme override for react-datepicker + spinner anim */}
          <style>{`
            .react-datepicker {
              background: #0E2240;
              border: 1px solid ${THEME.border};
              color: ${THEME.text};
            }
            .react-datepicker__header {
              background-color: #10294a;
              border-bottom: 1px solid ${THEME.border};
            }
            .react-datepicker__current-month,
            .react-datepicker__day-name {
              color: ${THEME.text};
              font-weight: 700;
            }
            .react-datepicker__day { color: ${THEME.text}; }
            .react-datepicker__day--selected,
            .react-datepicker__day--in-range,
            .react-datepicker__day--keyboard-selected {
              background-color: ${THEME.accent};
            }
            .react-datepicker__day:hover { background-color: rgba(59,130,246,0.4); }

            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </div>
  );
}
