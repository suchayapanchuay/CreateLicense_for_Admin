
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    padding: 30,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  keyControls: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  formWrapper: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    maxWidth: 800,
    width: "100%",
    boxSizing: "border-box",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "#333",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnCancel: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
  },
  btnCreate: {
    backgroundColor: "#0284c7",
    color: "white",
    border: "none",
  },
};

export default function NewApiKey() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    restrictions: "None",
    expiration: "None",
    visibility: "Preview",
    usageLimit: "None",
    allowedEndpoints: "",
    permsRead: true,
    permsWrite: false,
    permsLogs: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API to create key...
    console.log("Create API Key with", form);
    navigate("/api-keys"); // กลับไป list
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>New API Key</div>
        </div>

        {/* Form */}
        <div style={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* Name */}
              <div style={styles.fullWidth}>
                <label style={styles.label}>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter key name"
                  required
                />
              </div>

              {/* Key Restrictions */}
              <div>
                <label style={styles.label}>Key Restrictions</label>
                <select
                  name="restrictions"
                  value={form.restrictions}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>None</option>
                  <option>IP Address</option>
                  <option>Domain</option>
                </select>
              </div>

              {/* Expiration Date */}
              <div>
                <label style={styles.label}>Expiration Date</label>
                <select
                  name="expiration"
                  value={form.expiration}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>None</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                </select>
              </div>

              {/* Permissions */}
              <div style={styles.checkboxGroup}>
                <label style={styles.label}>Permissions</label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="permsRead"
                    checked={form.permsRead}
                    onChange={handleChange}
                  />
                  Read
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="permsWrite"
                    checked={form.permsWrite}
                    onChange={handleChange}
                  />
                  Write
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="permsLogs"
                    checked={form.permsLogs}
                    onChange={handleChange}
                  />
                  Logs
                </label>
              </div>

              {/* Key Visibility */}
              <div>
                <label style={styles.label}>Key Visibility</label>
                <select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Preview</option>
                  <option>Hide</option>
                </select>
              </div>

              {/* Usage Limit */}
              <div>
                <label style={styles.label}>Usage Limit</label>
                <select
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>None</option>
                  <option>100 requests/day</option>
                  <option>1000 requests/day</option>
                </select>
              </div>

              {/* Allowed Endpoints */}
              <div style={styles.fullWidth}>
                <label style={styles.label}>Allowed Endpoints</label>
                <input
                  name="allowedEndpoints"
                  value={form.allowedEndpoints}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="/license/verify, /license/create"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                style={{ ...styles.btn, ...styles.btnCancel }}
                onClick={() => navigate("/api-keys")}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...styles.btn, ...styles.btnCreate }}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
