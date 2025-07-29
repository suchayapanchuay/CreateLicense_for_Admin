import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#003d80",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
    border: "1px solid #94a3b8",
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
    gap: 10,
  },
  dropdown: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    alignSelf: "flex-start",
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
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const [apikeys, setApikeys] = useState([
    {
      id: 1,
      name: "Partner API",
      key: "sk_live_73nc...mX4",
      client: "Partner Co.",
      status: "Active",
      createdAt: "2025-07-01",
      expiresAt: "2025-12-31",
    },
    {
      id: 2,
      name: "Internal Tool",
      key: "sk_int_12ab...z8F",
      client: "Internal",
      status: "Revoked",
      createdAt: "2025-03-01",
      expiresAt: "2025-06-01",
    },
  ]);

  const toggleStatus = (id) => {
    setApikeys(prev =>
      prev.map(key =>
        key.id === id
          ? { ...key, status: key.status === "Active" ? "Revoked" : "Active" }
          : key
      )
    );
  };

  return (
    <div style={styles.container}>
      <Sidebar />

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
          <select
            style={styles.dropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Revoked</option>
            <option>Expired</option>
          </select>
          <button
            style={styles.addKeyButton}
            onClick={() => navigate("/api-keys/add")}
          >
            + New API Key
          </button>
        </div>

        <table style={styles.table}>
          <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>API Key</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Expires At</th>
                <th style={styles.th}>Actions</th>
              </tr>
          </thead>
          <tbody>
            {apikeys
              .filter(key => {
                if (statusFilter === "All") return true;
                return key.status === statusFilter;
              })
              .map((key, index) => (
                <tr key={index}>
                  <td style={styles.td}>{key.name}</td>
                  <td style={styles.td}>{key.key}</td>
                  <td style={styles.td}>{key.client}</td>
                  <td style={styles.td}>
                    <span
                      onClick={() => toggleStatus(key.id)}
                      style={{
                        backgroundColor: key.status === "Active" ? "#bbf7d0" : "#fecaca",
                        color: "#000",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {key.status}
                    </span>
                  </td>
                  <td style={styles.td}>{key.createdAt}</td>
                  <td style={styles.td}>{key.expiresAt}</td>
                  <td style={styles.td}>
                  {key.status === "Revoked" ? (
                    <span
                      style={{
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: "#6b7280",
                        marginRight: 12,
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 10px",
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                      onClick={() => navigate(`/api-keys/view-revoke/${key.id}`)}
                    >
                      View
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#004185",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 10px",
                          fontWeight: 500,
                          fontSize: 12,
                        }}
                        onClick={() => navigate(`/api-keys/edit/${key.id}`)}
                      >
                        Edit
                      </span>
                      <span
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 10px",
                          fontWeight: 500,
                          fontSize: 12,
                        }}
                        onClick={() => navigate(`/api-keys/revoke/${key.id}`)}
                      >
                        Revoke
                      </span>
                    </div>
                  )}
                </td>

                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
