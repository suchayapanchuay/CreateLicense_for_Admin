import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

export default function AddProduct() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New product:", form);
    navigate("/product");
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
          <button onClick={() => navigate("/product")} style={styles.backButton}>
            ← Back to Products
          </button>

          <h2 style={styles.sectionTitle}>Add Product</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.sectionGroup}>
              <h3 style={styles.subSection}>Product Information</h3>

              <label style={styles.label}>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.inputBox}
                required
              />

              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={styles.inputBox}
              >
                <option value="">Select a category</option>
                <option value="Accounting Software">Accounting Software</option>
                <option value="Cloud Services">Cloud Services</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="HR & Payroll">HR & Payroll</option>
                <option value="Security">Security</option>
              </select>

              <label style={styles.label}>Status</label>
              <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "white" }}>
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={form.status === "Active"}
                    onChange={handleChange}
                  />
                  Active
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "white" }}>
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={form.status === "Inactive"}
                    onChange={handleChange}
                  />
                  Inactive
                </label>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", gap: 12 }}>
              <button type="submit" style={styles.submitButton}>Add Product</button>
              <button
                type="button"
                onClick={() => setForm({ name: "", category: "", status: "Active" })}
                style={{ ...styles.submitButton, backgroundColor: "#64748b" }}
              >
                Clear
              </button>
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
  subSection: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#ffffff",
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
