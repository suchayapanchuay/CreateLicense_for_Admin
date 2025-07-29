import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

export default function EditApiKey() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);

  const [form, setForm] = useState({
    name: "Partner Key v2",
    status: "Active",
    expirationDate: "2025-12-31",
    scopes: {
      issue_license: true,
      verify_license: true,
      revoke_license: false,
    },
    note: "ใช้เฉพาะระบบ Client A เท่านั้น",
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name in form.scopes) {
      setForm((prev) => ({
        ...prev,
        scopes: { ...prev.scopes, [name]: checked },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated API Key:", form);
    navigate("/api-keys");
  };

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
              <IoClose onClick={() => setShowNoti(false)} style={{ cursor: "pointer" }} />
            </div>
            <div style={styles.notiItem}>License expired for Client ABC</div>
            <div style={styles.notiItem}>New client added: XYZ Co.</div>
          </div>
        )}

        <div style={styles.formContainer}>
          <button onClick={() => navigate("/api-keys")} style={styles.backButton}>
            ← Back to API Keys
          </button>

          <h2 style={styles.sectionTitle}>Edit API Key</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.sectionGroup}>
              <label style={styles.label}>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.inputBox}
                required
              />

          <label style={styles.label}>Status</label>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {["Active", "Revoked","Expired"].map((option) => (
              <label
                key={option}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  color: "white",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={option}
                  checked={form.status === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

              <label style={styles.label}>Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={form.expirationDate}
                onChange={handleChange}
                style={styles.inputBox}
              />

              <label style={styles.label}>Scopes</label>
              <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
                {Object.keys(form.scopes).map((scope) => (
                  <label
                    key={scope}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "white" }}
                  >
                    <input
                      type="checkbox"
                      name={scope}
                      checked={form.scopes[scope]}
                      onChange={handleChange}
                    />
                    {scope}
                  </label>
                ))}
              </div>

              <label style={styles.label}>Note</label>
              <textarea
                name="note"
                rows={3}
                value={form.note}
                onChange={handleChange}
                style={{ ...styles.inputBox, resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", gap: 12 }}>
              <button
                type="button"
                onClick={() => navigate("/api-keys")}
                style={{ ...styles.submitButton, backgroundColor: "#64748b" }}
              >
                Cancel
              </button>
              <button type="submit" style={styles.submitButton}>Save Changes</button>
            </div>
          </form>
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
    padding: "30px",
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
  formContainer: {
    paddingTop: 32,
    paddingLeft: 30,
    paddingRight: 30,
    color: "white",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionGroup: {
    marginBottom: 32,
    maxWidth: 600,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
    display: "block",
  },
  inputBox: {
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
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
