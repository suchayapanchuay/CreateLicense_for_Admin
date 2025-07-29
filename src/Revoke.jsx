import React, { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function RevokeApiKeyModal({ apiKey, onCancel, onRevoke }) {
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleRevoke = () => {
    console.log("Revoking key:", apiKey, "Reason:", reason);
    onRevoke(reason);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconRow}>
          <FiAlertTriangle size={28} color="#dc2626" />
          <span style={styles.title}>Are you sure you want to revoke this API Key?</span>
        </div>

        <p style={styles.text}>
          This action will permanently disable the key:
          <br />
          <span style={styles.keyText}>{apiKey}</span>
        </p>

        <p style={styles.subText}>It cannot be used to access the API anymore.</p>

        <label style={styles.label}>Reason (optional):</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={styles.textarea}
          placeholder="Enter reason for revoking"
        />

        <div style={styles.buttonRow}>
          <button style={styles.cancelButton} onClick={() => navigate(`/api-keys`)}
          >Cancel</button>
          <button onClick={handleRevoke} style={styles.revokeButton}>🔴 Revoke Key</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: "30px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    fontFamily: "Segoe UI, sans-serif",
  },
  iconRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
  },
  text: {
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 6,
  },
  keyText: {
    fontFamily: "monospace",
    color: "#334155",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 6,
    display: "block",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    borderRadius: 6,
    padding: "10px",
    fontSize: 14,
    border: "1px solid #cbd5e1",
    resize: "vertical",
    marginBottom: 20,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#64748b",
    color: "white",
    fontWeight: "bold",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  revokeButton: {
    backgroundColor: "#dc2626",
    color: "white",
    fontWeight: "bold",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
