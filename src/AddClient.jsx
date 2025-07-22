import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

export default function AddClient() {
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    estimatedUsers: "0 - 10",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client added:", form);
    navigate("/client");
  };

  return (
    <div style={styles.container}>
      <Sidebar/>

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
          <button onClick={() => navigate("/client")} style={styles.backButton}>
            ← Back to Clients
          </button>

          <h2 style={styles.title}>Add Client</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Company Name *</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              style={styles.inputBox}
              required
            />

            <label style={styles.label}>Contact Name</label>
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              style={styles.inputBox}
            />

            <label style={styles.label}>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.inputBox}
            />

            <label style={styles.label}>Estimated Users</label>
            <select
              name="estimatedUsers"
              value={form.estimatedUsers}
              onChange={handleChange}
              style={styles.inputBox}
            >
              <option>0 - 10</option>
              <option>11 - 50</option>
              <option>51 - 100</option>
              <option>101+</option>
            </select>

            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              style={{ ...styles.inputBox, height: 80 }}
            />

            <button type="submit" style={styles.submitButton}>Add</button>
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
  sidebar: {
    flexShrink: 0,
    width: 180,
    backgroundColor: "#ffffff",
    padding: "20px 12px",
  },
  logo: {
    width: 140,
    marginBottom: 40,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    fontSize: 15,
    cursor: "pointer",
    color: active ? "#ffffff" : "#000000",
    backgroundColor: active ? "#003d80" : "transparent",
    borderRadius: 6,
    paddingLeft: 12,
    marginBottom: 6,
  }),
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
    alignItems: "center",
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
    backgroundColor: "white",
    padding: "32px 24px",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  inputBox: {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    width: "95%",           
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
