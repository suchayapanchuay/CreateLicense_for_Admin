import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import {
  FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import Sidebar from "./SideBar";

export default function ProductEdit() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const [form, setForm] = useState({
    name: "Product A",
    cat: "Accounting Software",
    status: "Active"

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin invited:", form);
    navigate("/products");
  };

  return (
    <div style={styles.container}>
      <Sidebar />


      {/* Main Content */}
      <div style={styles.content}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch color="white" />
            <input placeholder="search" style={styles.input} />
          </div>
          <div onClick={() => setShowNoti(!showNoti)} style={{ cursor: "pointer" }}>
            <IoMdNotificationsOutline size={24} color="white" />
          </div>
        </div>

        {/* Notification Panel */}
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
          <h2 style={styles.title}>Edit Product</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.inputBox}
            />

            <label style={styles.label}>Category</label>
            <input
              name="cat"
              value={form.cat}
              onChange={handleChange}
              style={styles.inputBox}
            />

            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.inputBox}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <div>
              <button
                type="submit"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#0092D8",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontWeight: 500,

                }}
              >
                Save Changes
              </button>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontWeight: 500,
                   marginLeft: 10,
                }}
                onClick={navigate("/products")}
              >
                Cancel
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
    display: "flex",
    flexDirection: "column",
    padding: "40px 30px",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    maxWidth: 480,
    width: "100%",
  },
  form: {
    width: "100%",
    maxWidth: 600,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontSize: 20,
    color: "white"
  },
  inputBox: {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    width: "100%",
    alignSelf: "center",
    boxSizing: "border-box",
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontWeight: "bold",
    padding: "10px",
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
    alignSelf: "flex-start",
  },
};
