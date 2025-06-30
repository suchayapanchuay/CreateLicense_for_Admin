import React, { useState } from "react";
import logo from "./logo_smartclick.png"; 
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    padding: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#e9f0fb",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(30, 64, 175, 0.2)",
    border: "1px solid #c7d2fe",
  },
  logo: {
    display: "block",
    margin: "0 auto 20px",
    width: 120,
    height: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "600",
    color: "#1e40af",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #93c5fd",
    fontSize: 16,
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#1e3a8a",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1e40af",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    marginTop: 10,
    transition: "background-color 0.2s",
  },
  messageSuccess: {
    marginTop: 20,
    padding: 15,
    border: "1px solid #28a745",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: 6,
  },
  messageError: {
    marginTop: 20,
    padding: 15,
    border: "1px solid #ef4444",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: 6,
  },
};

const td = {
  border: "1px solid #e2e8f0",
  padding: "8px",
  textAlign: "center",
};

const formatDate = (str) =>
  new Date(str).toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function CreateLicense() {
  const [form, setForm] = useState({
    product_name: "",
    license_type_id: "",
    duration_days: 30,
    max_activations: 3,
    user_id: "",
  });
  const navigate = useNavigate();
  const handleLoadLicenses = () => {
    navigate("/licenses");
  };

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [licenses] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);

    const body = {
      product_name: form.product_name,
      license_type_id: form.license_type_id
        ? Number(form.license_type_id)
        : null,
      duration_days: Number(form.duration_days),
      max_activations: Number(form.max_activations),
      user_id: form.user_id ? Number(form.user_id) : null,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create license");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="SmartClick Logo" style={styles.logo} />
      <h2 style={styles.title}>Create License Key</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="product_name">
            Product Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="product_name"
            name="product_name"
            type="text"
            style={styles.input}
            value={form.product_name}
            onChange={handleChange}
            placeholder="e.g. SmartAudit Pro"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="license_type_id">
            License Type ID
          </label>
          <input
            id="license_type_id"
            name="license_type_id"
            type="number"
            style={styles.input}
            value={form.license_type_id}
            onChange={handleChange}
            placeholder="e.g. 1"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="duration_days">
            Duration (days) <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="duration_days"
            name="duration_days"
            type="number"
            min={1}
            style={styles.input}
            value={form.duration_days}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="max_activations">
            Max Activations <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="max_activations"
            name="max_activations"
            type="number"
            min={1}
            style={styles.input}
            value={form.max_activations}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="user_id">
            User ID (optional)
          </label>
          <input
            id="user_id"
            name="user_id"
            type="number"
            style={styles.input}
            value={form.user_id}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create License"}
        </button>

        <button
          type="button"
          style={{ ...styles.button, backgroundColor: "#059669" }}
          onClick={handleLoadLicenses}
        >
          All Licenses
        </button>
      </form>

      {error && <div style={styles.messageError}>Error: {error}</div>}
      {result && (
        <div style={styles.messageSuccess}>
          <h3>License Created Successfully!</h3>
          <p>
            <strong>License Key:</strong> {result.license_key}
          </p>
          <p>
            <strong>Product:</strong> {result.product_name}
          </p>
          <p>
            <strong>Expire Date:</strong>{" "}
            {new Date(result.expire_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {licenses.length > 0 && (
        <div style={{ marginTop: 40, overflowX: "auto" }}>
          <h3 style={{ ...styles.title, fontSize: 20 }}>All Licenses</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ backgroundColor: "#bfdbfe" }}>
              <tr>
                {[
                  "ID", "License Key", "Product", "User ID", "Type ID",
                  "Issued", "Expire", "Max", "Used", "Status",
                  "Created At", "Updated At",
                ].map((head) => (
                  <th key={head} style={{ border: "1px solid #cbd5e1", padding: "8px" }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {licenses.map((lic) => (
                <tr key={lic.id} style={{ backgroundColor: "#f8fafc" }}>
                  <td style={td}>{lic.id}</td>
                  <td style={td}>{lic.license_key}</td>
                  <td style={td}>{lic.product_name}</td>
                  <td style={td}>{lic.user_id ?? "-"}</td>
                  <td style={td}>{lic.license_type_id ?? "-"}</td>
                  <td style={td}>{formatDate(lic.issued_date)}</td>
                  <td style={td}>{formatDate(lic.expire_date)}</td>
                  <td style={td}>{lic.max_activations}</td>
                  <td style={td}>{lic.activations}</td>
                  <td style={td}>{lic.status}</td>
                  <td style={td}>{formatDate(lic.created_at)}</td>
                  <td style={td}>{formatDate(lic.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
