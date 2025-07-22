import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";
import { FiSearch,
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const apikeys = [
  { id: 1,name: "Partner API", key: "Partner API", date: "2025-12-11", status: "Active" },
  { id: 2,name: "Internal Tool", key: "Internal Tool", date: "2025-03-15", status: "Inactive" },
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
  keyControls: {
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
  addKeyButton: {
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

export default function Apikeys() {
  const [showNoti, setShowNoti] = useState(false);
  const navigate = useNavigate();


  return (
    <div style={styles.container}>
      <Sidebar/>

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
          <div style={styles.title}>API keys</div>
        </div>

        <div style={styles.keyControls}>
          <button
            style={styles.addKeyButton}
            onClick={() => navigate("/api-keys/add")}
          >
            + Create New Key
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Key</th>
              <th style={styles.th}>Create Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {apikeys.map((key, index) => (
              <tr key={index}>
                <td style={styles.td}>{key.name}</td>
                <td style={styles.td}>{key.key}</td>
                <td style={styles.td}>{key.date}</td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: key.status === "Active" ? "#bbf7d0" : "#cbd5e1",
                    color: "#000",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                    {key.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
