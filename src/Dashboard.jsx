// src/app/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Label
} from "recharts";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";

// --- (DATA/STYLE เหมือนเดิม) ---
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

const COLORS = {
  pageBg: "#0B1A2D", stageBg: "#0E1D33", card: "#13253D",
  text: "rgba(255,255,255,0.92)", textMut: "rgba(255,255,255,0.7)",
  border: "rgba(255,255,255,0.12)", accent: "#3B82F6",
  danger: "#EF4444", good: "#22C55E",
};
const styles = {
  root: { display: "flex", minHeight: "1024px", background: COLORS.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: "988px", background: COLORS.stageBg, borderRadius: 16, boxShadow: "0 10px 28px rgba(0,0,0,.22)", border: `1px solid ${COLORS.border}`, padding: 24, position: "relative" },
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
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* ใช้ Topbar (Reusable) */}
          <Topbar
            placeholder="Search"
            onSearchChange={(text) => {
              // ใส่ logic ค้นหาในหน้านี้ หากอยากผูกกับ table/รายการใน Dashboard
              // console.log("search:", text);
            }}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

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
                          <Label value="20%" position="center" fill="#fff" fontSize={20} fontWeight={800} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {expiryDonut.map((d, i) => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
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
                <div style={{ fontWeight: 800, marginBottom: 12, color: "#fff" }}>System Health</div>
                {[
                  { label: "API Connection", color: COLORS.good },
                  { label: "Webhook Delivery", color: COLORS.good },
                  { label: "Database Connection", color: COLORS.danger },
                  { label: "All systems operational", color: COLORS.good },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, color: "#fff" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 10, background: s.color, display: "inline-block" }} />
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Expiring Soon */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 12, color: "#fff" }}>Expiring Soon</div>
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
                <div style={{ fontWeight: 800, marginBottom: 14, color: "#fff" }}>Quick Actions</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <button style={styles.btnPrimary} onClick={() => navigate("/create")} >Create License</button>
                  <button style={styles.btnSecondary}>Renew Expiring</button>
                  <button style={styles.btnSecondary} onClick={() => navigate("/client/add")}>Invite Client</button>
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
