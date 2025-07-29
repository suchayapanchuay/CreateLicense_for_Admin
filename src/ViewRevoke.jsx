import React from "react";
import { useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import { FaUser, FaShieldAlt } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineStop } from "react-icons/ai";
import { TbNote } from "react-icons/tb";

export default function ViewApiKey() {
  const navigate = useNavigate();

  const data = {
    name: "Internal Tool",
    key: "sk_int_12ab...z8F",
    client: "Internal",
    createdAt: "2025-03-01",
    revokedAt: "2025-06-01",
    status: "Revoked",
    scopes: {
      verify: true,
      issue: false,
    },
    reason: "ยกเลิกหลังย้ายระบบ",
    createdBy: "admin@smartclick.co.th",
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>View API Key: {data.name}</h2>
        <div style={styles.row}><FiKey /> <span>API Key: {data.key}</span></div>
        <div style={styles.row}><FaUser /> <span>Client: {data.client}</span></div>
        <div style={styles.row}><MdCalendarToday /> <span>Created At: {data.createdAt}</span></div>
        <div style={styles.row}><AiOutlineStop />
          <span>Status: <span style={{ color: "#dc2626" }}>🔴 Revoked</span> (Revoked At: {data.revokedAt})</span>
        </div>
        <div style={styles.row}><FaShieldAlt />
          <span>Scopes: {data.scopes.verify ? "[✓ Verify]" : "[ ] Verify"} {data.scopes.issue ? "[✓ Issue]" : "[ ] Issue"}</span>
        </div>
        <div style={styles.row}><TbNote /> <span>Reason: {data.reason}</span></div>
        <div style={styles.row}><FaUser /> <span>Created By: {data.createdBy}</span></div>

        <button onClick={() => navigate("/api-keys")} style={styles.backButton}>
           ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#003d80",
    color: "white",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "white",
    color: "#1e293b",
    borderRadius: 10,
    padding: 30,
    width: "100%",
    maxWidth: 600,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
    marginBottom: 20,
    color: "#0f172a",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#1e40af",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
};
