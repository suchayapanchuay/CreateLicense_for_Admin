import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: 1200,
    margin: "100px auto",
    padding: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(30, 64, 175, 0.2)",
    border: "1px solid #c7d2fe",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "700",
    color: "#1e3a8a",
  },
  backButton: {
    display: "inline-block",
    marginBottom: 20,
    padding: "10px 20px",
    backgroundColor: "#1e40af",
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  th: {
    backgroundColor: "#bfdbfe",
    borderBottom: "1px solid #93c5fd",
    padding: 10,
    textAlign: "center",
    fontWeight: "600",
    color: "#1e3a8a",
  },
  td: {
    border: "1px solid #e2e8f0",
    padding: 10,
    textAlign: "center",
    color: "#1e40af",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: 12,
    border: "1px solid #fca5a5",
    borderRadius: 6,
    marginBottom: 20,
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  },
};

const formatDate = (str) =>
  new Date(str).toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function LicenseList() {
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchLicenses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/licenses");
      if (!res.ok) throw new Error("Failed to fetch licenses");
      const data = await res.json();
      setLicenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this license?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/license/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete license");
      await fetchLicenses(); // refresh list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← Back to Create License
      </button>
      <h2 style={styles.title}>All Licenses</h2>
      {error && <div style={styles.error}>Error: {error}</div>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={{ ...styles.th, minWidth: "220px" }}>License Key</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>User ID</th>
            <th style={styles.th}>Type ID</th>
            <th style={styles.th}>Issued</th>
            <th style={styles.th}>Expire</th>
            <th style={styles.th}>Max</th>
            <th style={styles.th}>Used</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>Updated At</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((lic) => (
            <tr key={lic.id}>
              <td style={styles.td}>{lic.id}</td>
              <td style={{ ...styles.td, minWidth: "220px" }}>{lic.license_key}</td>
              <td style={styles.td}>{lic.product_name}</td>
              <td style={styles.td}>{lic.user_id ?? "-"}</td>
              <td style={styles.td}>{lic.license_type_id ?? "-"}</td>
              <td style={styles.td}>{formatDate(lic.issued_date)}</td>
              <td style={styles.td}>{formatDate(lic.expire_date)}</td>
              <td style={styles.td}>{lic.max_activations}</td>
              <td style={styles.td}>{lic.activations}</td>
              <td style={styles.td}>{lic.status}</td>
              <td style={styles.td}>{formatDate(lic.created_at)}</td>
              <td style={styles.td}>{formatDate(lic.updated_at)}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDelete(lic.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
