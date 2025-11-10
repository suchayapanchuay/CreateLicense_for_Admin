// src/app/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Label
} from "recharts";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* ===== Light Theme (Blue & White) ===== */
const COLORS = {
  pageBg: "#F5F8FF",         // ขาวอมฟ้า
  stageBg: "#FFFFFF",        // ขาว
  card: "#E8F0FE",           // ฟ้าอ่อน
  text: "#0B1A2D",           // น้ำเงินเข้ม
  textMut: "#4B5563",        // เทาอมฟ้า
  border: "rgba(0,0,0,0.08)",// เส้นขอบอ่อน
  accent: "#2563EB",         // ฟ้าน้ำเงินหลัก
  danger: "#DC2626",         // แดงแจ้งเตือน
  good: "#16A34A",           // เขียวสถานะดี
};

const DONUT_COLORS = ["#2563EB", "#60A5FA", "#93C5FD"];

/* ===== Styles ===== */
const styles = {
  root: { display: "flex", minHeight: "100vh", background: COLORS.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "20px 16px", position: "relative" },
  stage: { width: 1152, minHeight: "1000px", background: COLORS.stageBg, borderRadius: 16, boxShadow: "0 10px 28px rgba(0,0,0,.08)", border: `1px solid ${COLORS.border}`, padding: 24, position: "relative" },
  heading: { fontSize: 40, fontWeight: 800, color: COLORS.text, marginTop: 6, marginBottom: 16 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 },
  statCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 },
  statTitle: { fontSize: 13, color: COLORS.textMut, marginBottom: 12, fontWeight: 600 },
  statValue: (color = COLORS.text) => ({ fontSize: 40, fontWeight: 800, color }),
  grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 },
  panel: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" },
  panelHeader: { padding: "10px 14px", color: COLORS.text, fontWeight: 800, borderBottom: `1px solid ${COLORS.border}`, background: "#F0F4FF" },
  sideCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 },
  btnPrimary: { width: "100%", padding: "10px 12px", borderRadius: 8, fontWeight: 700, border: "none", background: COLORS.accent, color: "white", cursor: "pointer" },
  btnSecondary: { width: "100%", padding: "10px 12px", borderRadius: 8, fontWeight: 700, border: `1px solid ${COLORS.accent}`, background: "transparent", color: COLORS.accent, cursor: "pointer" },
  legendDot: (c) => ({ width: 10, height: 10, borderRadius: 10, background: c, display: "inline-block", marginRight: 8 }),
  progressWrap: { height: 10, background: "rgba(0,0,0,0.05)", borderRadius: 6, overflow: "hidden" },
  progressInner: (pct) => ({ width: `${pct}%`, height: "100%", background: COLORS.accent, transition: "width .3s ease" }),
  muted: { color: COLORS.textMut, fontSize: 13 }
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [stats, setStats] = useState({
    active_licenses: 0, expiring_7d: 0, trial_licenses: 0, alerts: "OK"
  });
  const [usage, setUsage] = useState([]);                 // [{day, usage}]
  const [expiryBuckets, setExpiryBuckets] = useState([]);  // [{name,value}]
  const [expiringSoon, setExpiringSoon] = useState([]);    // [{username/user_name/user{...}/client, days, pct}]
  const [systemHealth, setSystemHealth] = useState([]);    // [{label,status}]

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/dashboard/metrics`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;

        setStats(data?.stats ?? { active_licenses: 0, expiring_7d: 0, trial_licenses: 0, alerts: "OK" });
        setUsage(Array.isArray(data?.usage) ? data.usage : []);
        setExpiryBuckets(Array.isArray(data?.expiry_buckets) ? data.expiry_buckets : []);
        setExpiringSoon(Array.isArray(data?.expiring_soon) ? data.expiring_soon : []);
        setSystemHealth(Array.isArray(data?.system_health) ? data.system_health : []);
        setErr(null);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  // Normalize usage for line chart
  const usageData = useMemo(() => {
    if (!usage?.length) return [];
    return [...usage].sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
  }, [usage]);

  // Normalize donut data
  const donutData = useMemo(() => {
    if (!expiryBuckets?.length) {
      return [
        { name: "0–7 days", value: 0 },
        { name: "8–30 days", value: 0 },
        { name: "> 30 days", value: 0 },
      ];
    }
    return expiryBuckets;
  }, [expiryBuckets]);

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <Topbar
            placeholder="Search"
            onSearchChange={() => {}}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          <div style={styles.heading}>Dashboard</div>

          {/* Loading / Error */}
          {loading && <div style={styles.muted}>Loading dashboard…</div>}
          {err && !loading && <div style={{ ...styles.muted, color: "#DC2626" }}>Error: {err}</div>}

          {/* Stat cards */}
          <div style={styles.statGrid}>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Active Licenses</div>
              <div style={styles.statValue()}>{stats.active_licenses ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Expiring 7 days</div>
              <div style={styles.statValue(COLORS.danger)}>{stats.expiring_7d ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Trial Requests</div>
              <div style={styles.statValue()}>{stats.trial_licenses ?? 0}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statTitle}>Alerts</div>
              <div style={styles.statValue(stats.alerts === "OK" ? COLORS.good : COLORS.danger)}>
                {stats.alerts || "OK"}
              </div>
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
                      <CartesianGrid stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="day" stroke={COLORS.textMut} />
                      <YAxis stroke={COLORS.textMut} />
                      <Tooltip
                        contentStyle={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, color: COLORS.text }}
                        labelStyle={{ color: COLORS.textMut }}
                        itemStyle={{ color: COLORS.text }}
                      />
                      <Line type="monotone" dataKey="usage" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 2 }} />
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
                        <Pie data={donutData} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
                          {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                          <Label
                            value={(() => {
                              const total = donutData.reduce((s, d) => s + (d.value || 0), 0);
                              if (total === 0) return "0%";
                              const first = donutData[0]?.value || 0;
                              const pct = Math.round((first / total) * 100);
                              return `${pct}%`;
                            })()}
                            position="center"
                            fill={COLORS.text}
                            fontSize={20}
                            fontWeight={800}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {donutData.map((d, i) => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: COLORS.text }}>
                        <div>
                          <span style={styles.legendDot(DONUT_COLORS[i])} />
                          {d.name}
                        </div>
                        <div style={{ color: COLORS.textMut }}>{d.value}</div>
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
                {(systemHealth?.length ? systemHealth : [
                  { label: "API Connection", status: "ok" },
                  { label: "Webhook Delivery", status: "ok" },
                  { label: "Database Connection", status: "ok" },
                  { label: "All systems operational", status: "ok" },
                ]).map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, color: COLORS.text }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: 10,
                      background: s.status === "ok" ? COLORS.good : COLORS.danger,
                      display: "inline-block"
                    }} />
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Expiring Soon */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 12, color: COLORS.text }}>Expiring Soon</div>
                {(expiringSoon?.length ? expiringSoon : []).map((e, i) => {
                  // ----- ชื่อผู้ใช้ (รองรับหลายฟอร์แมต) -----
                  const displayName =
                    e?.user_name ||                 // snake_case
                    e?.username ||                  // username
                    e?.user?.full_name ||           // object user
                    e?.user?.name ||
                    e?.client_name ||               // ชื่อ client เต็ม
                    e?.client ||                    // ฟิลด์เดิม
                    `User #${i + 1}`;               // fallback

                  // ----- วันคงเหลือ / เปอร์เซ็นต์ bar -----
                  const daysLeft = Number.isFinite(e?.days) ? e.days
                                  : (Number.isFinite(e?.remaining_days) ? e.remaining_days : 0);
                  let pct = Number.isFinite(e?.pct) ? e.pct
                          : (Number.isFinite(e?.percentage) ? e.percentage : 0);
                  pct = Math.max(0, Math.min(100, pct));

                  return (
                    <div key={`${displayName}-${daysLeft}-${i}`} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textMut, fontSize: 13 }}>
                        <span style={{ color: COLORS.text, fontWeight: 700 }}>{displayName}</span>
                        <span>{daysLeft} {daysLeft === 1 ? "day" : "days"}</span>
                      </div>
                      <div style={styles.progressWrap}><div style={styles.progressInner(pct)} /></div>
                    </div>
                  );
                })}
                {!expiringSoon?.length && <div style={styles.muted}>No upcoming expiries.</div>}
              </div>

              {/* Quick Actions */}
              <div style={styles.sideCard}>
                <div style={{ fontWeight: 800, marginBottom: 14, color: COLORS.text }}>Quick Actions</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <button style={styles.btnPrimary} onClick={() => navigate("/client/add")} >Add Client</button>
                  <button style={styles.btnPrimary} onClick={() => navigate("/product/add")}>Add Product</button>
                  <button style={styles.btnPrimary} onClick={() => navigate("/admin-users/add")}>Add Admin</button>
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
