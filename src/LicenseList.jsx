import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: 1200,
    margin: "80px auto",
    padding: 32,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(to bottom right, #eff6ff, #dbeafe)",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(30, 64, 175, 0.15)",
    border: "1px solid #c7d2fe",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "700",
    color: "#1e3a8a",
  },
  backButton: {
    display: "inline-block",
    marginBottom: 24,
    padding: "10px 22px",
    backgroundColor: "#1e40af",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
  },
  th: {
    backgroundColor: "#bfdbfe",
    borderBottom: "1px solid #93c5fd",
    padding: 12,
    textAlign: "center",
    fontWeight: "600",
    color: "#1e3a8a",
  },
  td: {
    borderBottom: "1px solid #e2e8f0",
    padding: 12,
    textAlign: "center",
    color: "#1e40af",
    backgroundColor: "#f8fafc",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: 14,
    border: "1px solid #fca5a5",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: "500",
  },
  deleteButton: {
    padding: "6px 14px",
    backgroundColor: "#dc2626",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    transition: "background-color 0.2s ease",
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
      await fetchLicenses(); // refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/")}
        style={styles.backButton}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1e3a8a")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1e40af")}
      >
        ← Back
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
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
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
