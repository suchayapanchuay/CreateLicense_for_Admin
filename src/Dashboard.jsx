import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import {
  FiHome, FiKey, FiUser, FiBox, FiBarChart2, FiUsers, FiSettings, FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import logo from "./logo_smartclick.png";

const usageData = [
  { day: 5, usage: 10 },
  { day: 7, usage: 30 },
  { day: 10, usage: 25 },
  { day: 15, usage: 65 },
  { day: 20, usage: 55 },
  { day: 22, usage: 10 },
  { day: 26, usage: 40 },
  { day: 28, usage: 70 },
  { day: 30, usage: 140 },
];

const expiryData = [
  { range: "0–30 days", value: 10 },
  { range: "31–90 days", value: 7 },
  { range: "> 90 days", value: 3 },
];

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#003d80",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: 240,
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: 20,
  },
  logo: {
    width: 160,
    marginBottom: 40,
  },
  navItem: (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 0",
  fontSize: 15,
  cursor: "pointer",
  color: active ? "#ffffff" : "#000000",
  backgroundColor: active ? "#003d80" : "transparent",
  borderRadius: 6,
  paddingLeft: 12,
  marginBottom: 6,
  }),

  content: {
    flex: 1,
    backgroundColor: "#003d80",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    backgroundColor: "#003d80",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    color: "white",

  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#003d80",
    border: "1px solid white",
    borderRadius: 10,
    padding: "4px 12px",
    color: "#ffffff",
  },
  input: {
    border: "none",
    padding: "4px 8px",
    outline: "none",
    backgroundColor: "transparent",
    color: "#ffffff",
  },
  header: {
    padding: "30px 30px 0 30px",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: 14,
  },
  mainGrid: {
    padding: 30,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    flex: 1,
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },
  card: {
    backgroundColor: "#003d80",
    color: "#ffcc00",
    padding: 20,
    borderRadius: 6,
    textAlign: "center",
    border: "1px solid #ffffff33",
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  chartBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  chartTitleBar: {
    backgroundColor: "#003d80",
    color: "white",
    padding: "6px 12px",
    fontWeight: "bold",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 10,
  },
  healthContainer: {
    display: "flex",
    alignItems: "center",
    gap: 40,
    justifyContent: "center",
  },
  healthCircle: {
    width: 160,
    height: 160,
    borderRadius: "50%",
    border: "16px solid",
    borderColor: "#22c55e #facc15 #ef4444 #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#003d80",
  },
};

const navItems = [
  { label: "Dashboard", icon: <FiHome /> },
  { label: "Create License", icon: <FiKey /> },
  { label: "Clients", icon: <FiUser /> },
  { label: "Products", icon: <FiBox /> },
  { label: "Reports", icon: <FiBarChart2 /> },
  { label: "Admin Users & Roles", icon: <FiUsers /> },
  { label: "Setting / Logs", icon: <FiSettings /> },
];

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img src={logo} alt="SmartClick Logo" style={styles.logo} />
        {navItems.map((item) => {
          const isActive = item.label === "Dashboard"; 
          return (
            <div key={item.label} style={styles.navItem(isActive)}>
              {item.icon} {item.label}
            </div>
          );
        })}

      </div>
      <div style={styles.content}>
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch color="white" />
            <input placeholder="search" style={styles.input} />
          </div>
          <IoMdNotificationsOutline size={24} color="white" />
        </div>

        <div style={styles.header}>
          <div style={styles.title}>Dashboard</div>
          <div style={styles.subtitle}>Central Hub for Personal Customization</div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftCol}>
            <div style={styles.cardGrid}>
              <Card title="Active Licenses" value="104" />
              <Card title="Expiring in 7 days" value="14" color="#ff4444" />
              <Card title="Trial Licenses" value="34" />
              <Card title="Total Clients" value="84" />
            </div>

            <div style={styles.chartBox}>
              <div style={styles.chartTitleBar}>System Health</div>
              <div style={styles.healthContainer}>
                <div style={styles.healthCircle}>Healthy</div>
                <div>
                  <p><span style={{ backgroundColor: '#22c55e', display: 'inline-block', width: 12, height: 12, borderRadius: '50%', marginRight: 8 }}></span>Healthy</p>
                  <p><span style={{ backgroundColor: '#facc15', display: 'inline-block', width: 12, height: 12, borderRadius: '50%', marginRight: 8 }}></span>Warning</p>
                  <p><span style={{ backgroundColor: '#ef4444', display: 'inline-block', width: 12, height: 12, borderRadius: '50%', marginRight: 8 }}></span>Critical</p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightCol}>
            <div style={styles.chartBox}>
              <div style={styles.chartTitleBar}>License Usage</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#003d80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartBox}>
              <div style={styles.chartTitleBar}>License Expiry</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={expiryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color = "#ffcc00" }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}