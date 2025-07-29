import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const clients = [
  {
    id: 1,
    name: "John Doe",
    company: "Acme Corp.",
    email: "johndce@acme.co",
    phone: "081-234-5678",
    status: "Active",
  },
  {
    id: 2,
    name: "Emma Smith",
    company: "Beta Systems",
    email: "emma smith@beta",
    phone: "082-345-6789",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Liam Johnson",
    company: "Gamma Innovations",
    email: "liam@gamma.com",
    phone: "083-456-7890",
    status: "Active",
  },
];

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
  clientControls: {
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
    alignSelf: "flex-start"
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

export default function ClientList() {
  const [showNoti, setShowNoti] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filteredClients = clients.filter(
    (c) => statusFilter === "All" || c.status === statusFilter
  );

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
              <IoClose
                onClick={() => setShowNoti(false)}
                style={{ cursor: "pointer" }}
              />
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
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={styles.addClientButton}
              onClick={() => navigate("/client/add")}
            >
              + Add Client
            </button>

            <button
              style={{ ...styles.addClientButton, backgroundColor: "#22c55e" }}
              onClick={() => navigate("/create")}
            >
              + Create License
            </button>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Client Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index}>
                <td style={styles.td}>
                  <strong>{client.name}</strong>
                  <br />
                  <span style={{ color: "#6b7280", fontSize: 13 }}>
                    {client.company}
                  </span>
                </td>
                <td style={styles.td}>{client.company}</td>
                <td style={styles.td}>{client.email}</td>
                <td style={styles.td}>{client.phone}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      backgroundColor:
                        client.status === "Active" ? "#bbf7d0" : "#cbd5e1",
                      color: "#000",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {client.status}
                  </span>
                </td>
              <td style={styles.td}>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          color: "#2563eb",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => navigate(`/client-details/${client.id}`)}
                      >
                        View Details
                      </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
