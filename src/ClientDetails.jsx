// Updated ClientDetails.jsx with improved License UI layout
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "081-234-5678",
    company: "Acme Corporation",
    joined: "January 15, 2024",
    estimatedUsers: "0 - 10",
    licenses: [
      {
        product: "Smart Audit",
        version: "1.0.0",
        type: "Subscription",
        key: "ABCD-1234",
        start: "2025-06-01",
        end: "2026-06-01",
        remaining: "315 days remaining",
        devices: "2/3 Devices",
        lastActivation: "2025-08-15",
        source: "Direct Purchase",
        notes: "Issued via corporate plan, 2025",
        clientOrg: "SmartClick Co., Ltd.",
        email: "client@gmail.com",
        activated: false,
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
      <div style={{ ...styles.container, justifyContent: "center", alignItems: "center", color: "white", gap: 15 }}>
        <h2>Client not found</h2>
        <button onClick={() => navigate("/client")} style={styles.button}>← Back to Clients</button>
      </div>
    );
  }

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
            <div style={styles.notiHeader}>Notifications<IoClose onClick={() => setShowNoti(false)} style={{ cursor: "pointer" }} /></div>
            <div style={styles.notiItem}>License expired for Client ABC</div>
            <div style={styles.notiItem}>New client added: XYZ Co.</div>
          </div>
        )}

        <div style={{ padding: "30px" }}>
          <button onClick={() => navigate("/client")} style={styles.backButton}>← Back to Clients</button>
          <h2 style={styles.title}>Client Details</h2>

          <div style={styles.card}>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Company:</strong> {client.company}</p>
            <p><strong>Joined:</strong> {client.joined}</p>
            <p><strong>Estimated Users:</strong> {client.estimatedUsers}</p>
            <div style={{ marginTop: 20 }}>
              <button style={styles.button} onClick={() => navigate(`/client/${client.id}/edit`)}>Edit Client</button>
              <button style={{ ...styles.button, backgroundColor: "#dc2626" }}>Delete Client</button>
              <button style={{ ...styles.button, backgroundColor: "#22c55e" }} onClick={() => navigate("/create")}>+ Create License</button>
            </div>
          </div>

          <h3 style={{ ...styles.title, marginTop: 40 }}>License</h3>
          {client.licenses.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 30 }}>
              <div style={styles.licenseCard}>
                <h4 style={styles.cardHeader}>License Details</h4>
                <p><strong>Status:</strong> <span style={{ color: "#10b981" }}>✓ Active</span></p>
                <p><strong>License Key:</strong> {l.key}</p>
                <p><strong>Product:</strong> {l.product}</p>
                <p><strong>Product Version:</strong> {l.version}</p>
                <p><strong>Type:</strong> {l.type}</p>
                <p><strong>Issued On:</strong> {l.start}</p>
                <p><strong>Expires On:</strong> {l.end}</p>
                <p><strong>Remaining:</strong> {l.remaining}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button style={styles.button}>Download PDF</button>
                  <button style={{ ...styles.button, backgroundColor: "#0ea5e9" }}>View Terms</button>
                </div>
              </div>

              <div style={styles.licenseCard}>
                <h4 style={styles.cardHeader}>Additional Info</h4>
                <p><strong>Devices Linked:</strong> {l.devices}</p>
                <p><strong>Last Activation:</strong> {l.lastActivation}</p>
                <p><strong>Notes:</strong> {l.notes}</p>
                <p><strong>Source:</strong> {l.source}</p>
                <p><strong>Client Org:</strong> {l.clientOrg}</p>
                <p><strong>Contact Email:</strong> {l.email}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 90 }}>
                  <button style={{ ...styles.button, backgroundColor: "#0ea5e9" }}>Renew License</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#003d80", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  content: { flex: 1, backgroundColor: "#003d80", display: "flex", flexDirection: "column", overflowX: "hidden", padding: "30px", position: "relative" },
  topbar: { backgroundColor: "#003d80", padding: "12px 20px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, color: "white" },
  searchBox: { display: "flex", alignItems: "center", backgroundColor: "#003d80", border: "1px solid white", borderRadius: 10, padding: "4px 12px", color: "#ffffff" },
  input: { border: "none", padding: "4px 8px", outline: "none", backgroundColor: "transparent", color: "#ffffff" },
  title: { fontSize: 22, fontWeight: "bold", color: "white", marginBottom: 20 },
  notiPanel: { position: "absolute", top: 60, right: 30, backgroundColor: "white", width: 300, borderRadius: 10, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", zIndex: 1000, maxHeight: 400, overflowY: "auto", border: "1px solid #94a3b8" },
  notiHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #ccc", fontWeight: "bold", fontSize: 16 },
  notiItem: { padding: "10px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14 },
  card: { backgroundColor: "#ffffff", padding: 20, borderRadius: 10, color: "#000000", maxWidth: 700 },
  button: { backgroundColor: "#1d4ed8", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 6, marginRight: 10, cursor: "pointer" },
  backButton: { backgroundColor: "#1e40af", color: "#ffffff", padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14, marginBottom: 20 },
  licenseCard: { flex: 1, minWidth: 320, backgroundColor: "white", color: "black", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#1e3a8a" },
};
