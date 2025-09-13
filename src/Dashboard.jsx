import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Label
} from "recharts";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

/* ------------------------ MOCK DATA ------------------------ */
const usageData = [
  { day: 5, usage: 10 }, { day: 7, usage: 30 }, { day: 10, usage: 25 },
  { day: 15, usage: 65 }, { day: 20, usage: 55 }, { day: 22, usage: 10 },
  { day: 26, usage: 40 }, { day: 28, usage: 70 }, { day: 30, usage: 120 },
];

const expiryDonut = [
  { name: "0–7 days", value: 20 },
  { name: "8–30 days", value: 26 },
  { name: "> 30 days", value: 52 },
];
const DONUT_COLORS = ["#60A5FA", "#38BDF8", "#93C5FD"];

const expiringSoon = [
  { client: "Client A", days: 1, pct: 90 },
  { client: "Client B", days: 3, pct: 70 },
  { client: "Client C", days: 5, pct: 55 },
  { client: "Client D", days: 7, pct: 40 },
];

const activities = [
  { who: "John", what: "creat license", when: "2 hours ago" }, // ตั้งใจให้สะกดเหมือนภาพ
  { who: "John", what: "delete license", when: "1 day ago" },
  { who: "John", what: "delete license", when: "1 day ago" },
];

/* ------------------ NOTIFICATION MOCKS ------------------ */
const NOTI_ITEMS = [
  { id: 1, type: "trial", title: "Trial Request", client: "Client A", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 2, type: "trial", title: "Trial Request", client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 3, type: "purchase", title: "Purchase Request", client: "Client C", product: "Smart Audit", requested: "31 Aug 2025", read: true },
  { id: 4, type: "trial", title: "Trial Request", client: "Client D", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 7, read: true },
  { id: 5, type: "purchase", title: "Purchase Request", client: "Client E", product: "Smart Audit", requested: "31 Aug 2025", read: true },
  { id: 6, type: "trial", title: "Trial Request", client: "Client F", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 30, read: false },
  { id: 7, type: "trial", title: "Trial Request", client: "Client G", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: true },
  { id: 8, type: "purchase", title: "Purchase Request", client: "Client H", product: "Smart Audit", requested: "31 Aug 2025", read: false },
  { id: 9, type: "trial", title: "Trial Request", client: "Client I", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 10, read: true },
  { id: 10, type: "trial", title: "Trial Request", client: "Client J", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 20, read: true },
  { id: 11, type: "purchase", title: "Purchase Request", client: "Client K", product: "Smart Audit", requested: "31 Aug 2025", read: true },
  { id: 12, type: "trial", title: "Trial Request", client: "Client L", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 14, read: false },
];

/* --------------------------- THEME --------------------------- */
const COLORS = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.7)",
  textFaint: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.12)",
  accent: "#3B82F6",
  danger: "#EF4444",
  good: "#22C55E",
};

/* --------------------------- STYLES --------------------------- */
const styles = {
  root: {
    display: "flex",
    minHeight: "1024px",
    background: COLORS.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "18px 16px",
    position: "relative",
  },
  stage: {
    width: 1152,
    minHeight: "988px",
    background: COLORS.stageBg,
    borderRadius: 16,
    boxShadow: "0 10px 28px rgba(0,0,0,.22)",
    border: `1px solid ${COLORS.border}`,
    padding: 24,
    position: "relative",
  },

  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, paddingBottom: 8 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.text,
    padding: "6px 10px", borderRadius: 10, minWidth: 200,
  },
  input: { border: "none", outline: "none", background: "transparent", color: COLORS.text, width: "100%" },

  heading: { fontSize: 40, fontWeight: 800, color: COLORS.text, marginTop: 6, marginBottom: 16 },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 },
  statCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 },
  statTitle: { fontSize: 13, color: COLORS.textMut, marginBottom: 12, fontWeight: 600 },
  statValue: (color = COLORS.text) => ({ fontSize: 40, fontWeight: 800, color }),

  grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 },

  panel: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" },
  panelHeader: { padding: "10px 14px", color: COLORS.text, fontWeight: 800, borderBottom: `1px solid ${COLORS.border}` },

  sideCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 },
  btnPrimary: { width: "100%", padding: "10px 12px", borderRadius: 8, fontWeight: 700, border: "none", background: COLORS.accent, color: "white", cursor: "pointer" },
  btnSecondary: { width: "100%", padding: "10px 12px", borderRadius: 8, fontWeight: 700, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.text, cursor: "pointer" },
  legendDot: (c) => ({ width: 10, height: 10, borderRadius: 10, background: c, display: "inline-block", marginRight: 8 }),
  progressWrap: { height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" },
  progressInner: (pct) => ({ width: `${pct}%`, height: "100%", background: COLORS.accent }),

  /* -------- Notifications panel -------- */
  notiPanelWrap: {
    position: "absolute", top: 90, right: 36, width: 560,
    background: "#0E2240",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    boxShadow: "0 14px 34px rgba(0,0,0,.4)",
    color: COLORS.text,
    zIndex: 60,
    overflow: "hidden",
  },
  notiHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: `1px solid ${COLORS.border}`,
    fontWeight: 900, fontSize: 22,
  },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: {
    appearance: "none",
    background: "#183154",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "10px 40px 10px 14px",
    fontWeight: 600,
    fontSize: 14,
    color: COLORS.text,
    cursor: "pointer",
  },
  selectCaret: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
  },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${COLORS.border}` },
  notiBadge: { fontSize: 13, color: COLORS.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: COLORS.text },
  notiMetaRow: {
    display: "flex", justifyContent: "flex-start",gap: "4px",
    color: COLORS.textFaint, fontSize: 14, marginTop: 8
  },
  notiBtn: {
    marginTop: 10, border: `1px solid ${COLORS.border}`,
    background: "transparent", color: COLORS.text,
    padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer"
  },
  notiFooter: {
    display: "flex", justifyContent: "flex-end",
    padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer",
    borderTop: `1px solid ${COLORS.border}`,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef(null);
  const [notiFilter, setNotiFilter] = useState("all"); // all | unread | trial | purchase

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
          {/* Topbar */}
          <div style={styles.topbar}>
            <div style={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search" style={styles.input} />
            </div>
            <div onClick={() => setShowNoti((v) => !v)} style={{ cursor: "pointer" }}>
              <IoMdNotificationsOutline size={24} color={COLORS.text} />
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
                      <span><strong style={{ color: COLORS.textFaint }}>Product :</strong> {n.product}</span>
                      {n.durationDays ? (
                        <span><strong style={{ color: COLORS.textFaint }}>Duration :</strong> {n.durationDays} days</span>
                      ) : <span />}
                    </div>
                    <div style={{ ...styles.notiMetaRow, marginTop: 6 }}>
                      <span><strong style={{ color: COLORS.textFaint }}>Requested :</strong> {n.requested}</span>
                      <span />
                    </div>

                    <button style={styles.notiBtn} onClick={() => navigate("/Noti")}>View All</button>
                  </div>
                ))}
                <div style={{ height: 120, borderBottom: `1px solid ${COLORS.border}` }} />
              </div>

              <div style={styles.notiFooter} onClick={() => navigate("/Noti")}>View All</div>
            </div>
          )}

          {/* Heading */}
          <div style={styles.heading}>Dashboard</div>

          {/* Stat cards */}
          <div style={styles.statGrid}>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Active Licenses</div>
              <div style={styles.statValue()}>{35}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Expiring 7 days</div>
              <div style={styles.statValue(COLORS.danger)}>{5}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Trial Licenses</div>
              <div style={styles.statValue()}>{19}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Alerts</div>
              <div style={styles.statValue(COLORS.good)}>OK</div>
            </div>
          </div>

          {/* Main grid */}
          <div style={styles.grid}>
            {/* Left column */}
            <div style={{ display: "grid", gap: 20 }}>
              {/* License Usage */}
              <div style={styles.panel}>
                <div style={styles.panelHeader}>License Usage</div>
                <div style={{ padding: 12, height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="day" stroke={COLORS.textMut} />
                      <YAxis stroke={COLORS.textMut} />
                      <Tooltip contentStyle={{ background: "#0b1830", border: `1px solid ${COLORS.border}`, color: COLORS.text }} />
                      <Line type="monotone" dataKey="usage" stroke="#FFFFFF" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* License Expiry */}
              <div style={styles.panel}>
                <div style={styles.panelHeader}>License Expiry</div>
                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 8, padding: 12, alignItems: "center" }}>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expiryDonut} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
                          {expiryDonut.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                          {/* ตัวเลขกลางวง */}
                          <Label value="20%" position="center" fill={COLORS.text} fontSize={20} fontWeight={800} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {expiryDonut.map((d, i) => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: COLORS.text }}>
                        <div><span style={styles.legendDot(DONUT_COLORS[i])} />{d.name}</div>
                        <div style={{ color: COLORS.textMut }}>{d.value} %</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "grid", gap: 20 }}>
              {/* System Health */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 12, color: COLORS.text }}>System Health</div>
                {[
                  { label: "API Connection", color: COLORS.good },
                  { label: "Webhook Delivery", color: COLORS.good },
                  { label: "Database Connection", color: COLORS.danger },
                  { label: "All systems operational", color: COLORS.good },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, color: COLORS.text }}>
                    <span style={{ width: 10, height: 10, borderRadius: 10, background: s.color, display: "inline-block" }} />
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Expiring Soon */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 12, color: COLORS.text }}>Expiring Soon</div>
                {expiringSoon.map((e) => (
                  <div key={e.client} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textMut, fontSize: 13 }}>
                      <span>{e.client}</span><span>{e.days} {e.days === 1 ? "day" : "days"}</span>
                    </div>
                    <div style={styles.progressWrap}><div style={styles.progressInner(e.pct)} /></div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 14, color: COLORS.text }}>Quick Actions</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <button style={styles.btnPrimary} onClick={() => navigate("/create")} >Create License</button>
                  <button style={styles.btnSecondary}>Renew Expiring</button>
                  <button style={styles.btnSecondary} onClick={() => navigate("/client/add")}>Invite Client</button>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 10, color: COLORS.text }}>Recent Activity</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {activities.map((a, i) => (
                    <div key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 10 }}>
                      <div style={{ color: COLORS.text }}>{a.who} {a.what}</div>
                      <div style={{ color: COLORS.textMut, fontSize: 12 }}>{a.when}</div>
                    </div>
                  ))}
                  <div
                    style={{ textAlign: "right", color: COLORS.text, fontWeight: 600, cursor: "pointer" }}
                    onClick={() => navigate("/Noti")}
                  >
                    View All
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Main grid */}
        </div>
      </div>
    </div>
  );
}
