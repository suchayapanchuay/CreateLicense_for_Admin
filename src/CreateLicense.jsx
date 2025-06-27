import React, { useState } from "react";

const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
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
    border: "1px solid #dc3545",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: 6,
  },
};

export default function CreateLicense() {
  const [form, setForm] = useState({
    product_name: "",
    license_type_id: "",
    duration_days: 30,
    max_activations: 3,
    user_id: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

    // Build request body
    const body = {
      product_name: form.product_name,
      license_type_id: form.license_type_id ? Number(form.license_type_id) : null,
      duration_days: Number(form.duration_days),
      max_activations: Number(form.max_activations),
      user_id: form.user_id ? Number(form.user_id) : null,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
  
        },
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
          <small style={{ color: "#666" }}>
            (Optional, link to license_types table)
          </small>
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
          <small style={{ color: "#666" }}>
            (If you want to assign license to specific user)
          </small>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create License"}
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
    </div>
  );
}
