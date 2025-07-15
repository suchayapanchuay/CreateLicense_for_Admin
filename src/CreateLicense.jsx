import React from "react";
import {
  FiHome, FiKey, FiUser, FiBox, FiBarChart2, FiUsers, FiSettings, FiSearch,
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import logo from "./logo_smartclick.png";

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
    marginBottom: 4,
    color: "#ffffff",
  },
  form: {
  backgroundColor: "#003d80",
  borderRadius: 10,
  padding: 30,
  width: "100%",         
  maxWidth: 1000,        
  margin: "0 auto",      
  color: "#ffffff",      
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "#ffffff",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "600",
    color: "#ffffff",
  },
  h2: {
  color: "#ffffff",     
  },  
  inputField: {
    width: "100%",
    padding: 8,
    borderRadius: 4,
    border: "none",
    marginBottom: 16,
  },
  flexRow: {
  display: "flex",
  gap: 20,
  alignItems: "center",
  },

  buttonRow: {
    marginTop: 30,
    display: "flex",
    gap: 12,
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    minWidth: 120,            
    fontSize: 14,
}

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

export default function CreateLicense() {
  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img src={logo} alt="SmartClick Logo" style={styles.logo} />
        {navItems.map((item) => {
          const isActive = item.label === "Create License";
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
            <FiSearch />
            <input placeholder="search" style={styles.input} />
          </div>
          <IoMdNotificationsOutline size={24} />
        </div>

        <div style={styles.form}>
          <h2>Create License</h2>

          <div style={styles.sectionTitle}>Select Client & Product</div>
          <div style={styles.flexRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Client</label>
              <select style={styles.inputField}></select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Product</label>
              <select style={styles.inputField}></select>
            </div>
          </div>
          <div>
            <label style={styles.label}>Version</label>
            <select style={styles.inputField}></select>
          </div>
          <div>
            <input type="checkbox" /> Trial
            <input type="checkbox" style={{ marginLeft: 16 }} /> Subscription
            <input type="checkbox" style={{ marginLeft: 16 }} /> Perpetual
          </div>

          <div style={styles.sectionTitle}>Activation & Constraints</div>
          <label style={styles.label}>Max Activations</label>
          <input type="number" style={styles.inputField} />

          <div style={{ ...styles.flexRow, justifyContent: "space-between" }}>
            <div>
              <input type="checkbox" /> IP Lock
            </div>
            <div>
              Online Check-in
              <input type="radio" name="checkin" defaultChecked /> Off
              <input type="radio" name="checkin" style={{ marginLeft: 16 }} /> Online Check-in
            </div>
          </div>

          <div style={styles.sectionTitle}>Notes & Internal Reference</div>
          <label style={styles.label}>Internal Notes</label>
          <input type="text" style={styles.inputField} />

          <div style={styles.buttonRow}>
            <button style={{ ...styles.button, backgroundColor: "#1e40af", color: "white" }}>Generate License</button>
            <button style={{ ...styles.button, backgroundColor: "#cbd5e1" }}>Download</button>
            <button style={{ ...styles.button, backgroundColor: "#e5e7eb" }}>...</button>
          </div>
        </div>
      </div>
    </div>
  );
}
