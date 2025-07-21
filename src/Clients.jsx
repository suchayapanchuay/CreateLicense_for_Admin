import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome, FiKey, FiUser, FiBox, FiBarChart2, FiUsers,
  FiSettings, FiSearch, FiEye
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import logo from "./logo_smartclick.png";

const clients = [
  { id: 1,name: "John Doe", company: "Acme Corp.", email: "johndce@acme.co", status: "Active" },
  { id: 2,name: "Emma Smith", company: "Beta Systems", email: "emma smith@beta", status: "Inactive" },
  { id: 3,name: "Liam Johnson", company: "Gamma Innovations", email: "liam@gamma.com", status: "Active" },
];

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#003d80",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    flexShrink: 0,
    width: 180,
    backgroundColor: "#ffffff",
    padding: "20px 12px",
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
    padding: "30px",
    overflowX: "hidden",
    position: "relative",
  },
  topbar: {
    backgroundColor: "#003d80",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    color: "white",
    flexWrap: "wrap",
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
  notiPanel: {
    position: "absolute",
    top: 60,
    right: 30,
    backgroundColor: "white",
    width: 300,
    borderRadius: 10,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    maxHeight: 400,
    overflowY: "auto",
    border: "1px solid #94a3b8"
  },
  notiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #ccc",
    fontWeight: "bold",
    fontSize: 16,
  },
  notiItem: {
    padding: "10px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
  },
  clientControls: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 30px",
    gap: 10
  },
  dropdown: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  addClientButton: {
    backgroundColor: "#0284c7",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  table: {
    width: "calc(100% - 60px)",
    margin: "0 30px 30px 30px",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
};

const navItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/" },
  { label: "Create License", icon: <FiKey />, path: "/create" },
  { label: "Clients", icon: <FiUser />, path: "/client" },
  { label: "Products", icon: <FiBox />, path: "/product" },
  { label: "Reports", icon: <FiBarChart2 />, path: "/reports" },
  { label: "Admin Users & Roles", icon: <FiUsers />, path: "/admin-users" },
  { label: "Setting / Logs", icon: <FiSettings />, path: "/settings" },
];

export default function ClientList() {
  const [showNoti, setShowNoti] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();

  const filteredClients = clients.filter((c) =>
    statusFilter === "All" || c.status === statusFilter
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img src={logo} alt="SmartClick Logo" style={styles.logo} />
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              style={styles.navItem(isActive)}
              onClick={() => navigate(item.path)}
            >
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
          <div onClick={() => setShowNoti(!showNoti)} style={{ cursor: "pointer" }}>
            <IoMdNotificationsOutline size={24} color="white" />
          </div>
        </div>

        {showNoti && (
          <div style={styles.notiPanel}>
            <div style={styles.notiHeader}>
              Notifications
              <IoClose onClick={() => setShowNoti(false)} style={{ cursor: "pointer" }} />
            </div>
            <div style={styles.notiItem}>License expired for Client ABC</div>
            <div style={styles.notiItem}>New client added: XYZ Co.</div>
          </div>
        )}

        <div style={styles.header}>
          <div style={styles.title}>Clients</div>
        </div>

        <div style={styles.clientControls}>
          <select
            style={styles.dropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            style={styles.addClientButton}
            onClick={() => navigate("/client/add")}
          >
            + Add Client
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Client Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index}>
                <td style={styles.td}>
                  <strong>{client.name}</strong><br />
                  <span style={{ color: "#6b7280", fontSize: 13 }}>{client.company}</span>
                </td>
                <td style={styles.td}>{client.company}</td>
                <td style={styles.td}>{client.email}</td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: client.status === "Active" ? "#bbf7d0" : "#cbd5e1",
                    color: "#000",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                    {client.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <FiEye
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/client-details/${client.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
