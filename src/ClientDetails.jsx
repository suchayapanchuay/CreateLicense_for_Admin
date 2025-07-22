import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Corporation",
    joined: "January 15, 2024",
    estimatedUsers: "0 - 10",
    licenses: [
      {
        product: "MySoftware",
        type: "Subscription",
        key: "ABCD-1234-EFGH-5678",
        start: "August 1, 2023",
        end: "July 31, 2024",
      },
    ],
  },
];



export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showNoti, setShowNoti] = useState(false);

  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div style={{ ...styles.container, justifyContent: "center", alignItems: "center", color: "white" ,gap:15}}>
        <h2>Client not found</h2>
        <button onClick={() => navigate("/client")} style={styles.button}>← Back to Clients</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch color="white" />
            <input placeholder="search" style={styles.input} />
          </div>
          <div onClick={() => setShowNoti(!showNoti)} style={{ cursor: "pointer" }}>
            <IoMdNotificationsOutline size={24} color="white" />
          </div>
        </div>

        {/* Notification Panel */}
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

        <div style={{ padding: "30px" }}>
          <button onClick={() => navigate("/client")} style={styles.backButton}>
                 ← Back to Clients
               </button>
          <h2 style={styles.title}>Client Details</h2>

          <div style={styles.card}>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Company:</strong> {client.company}</p>
            <p><strong>Joined:</strong> {client.joined}</p>
            <p><strong>Estimated Users:</strong> {client.estimatedUsers}</p>
            <div style={{ marginTop: 20 }}>
              <button style={styles.button}>Edit Client</button>
              <button style={{ ...styles.button, backgroundColor: "#dc2626" }}>Delete Client</button>
            </div>
          </div>

          <h3 style={{ ...styles.title, marginTop: 40 }}>License</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Key</th>
                <th style={styles.th}>Start Date</th>
                <th style={styles.th}>End Date</th>
              </tr>
            </thead>
            <tbody>
              {client.licenses.map((l, i) => (
                <tr key={i}>
                  <td style={styles.td}>{l.product}</td>
                  <td style={styles.td}>{l.type}</td>
                  <td style={styles.td}>{l.key}</td>
                  <td style={styles.td}>{l.start}</td>
                  <td style={styles.td}>{l.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
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
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    color: "#000000",
    maxWidth: 700,
  },
  button: {
    backgroundColor: "#1d4ed8",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    marginRight: 10,
    cursor: "pointer",

  },
  table: {
    width: "100%",
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    overflow: "hidden",
    borderCollapse: "collapse",
    marginTop: 12,
  },
  th: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: 12,
    textAlign: "left",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
  },
  backButton: {
  backgroundColor: "#1e40af",
  color: "#ffffff",
  padding: "6px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  marginBottom: 20,
},
};
