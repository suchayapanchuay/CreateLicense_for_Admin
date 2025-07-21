import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FiHome, FiKey, FiUser, FiBox, FiBarChart2,
  FiUsers, FiSettings, FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import logo from "./logo_smartclick.png";

const navItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/" },
  { label: "Create License", icon: <FiKey />, path: "/create" },
  { label: "Clients", icon: <FiUser />, path: "/client" },
  { label: "Products", icon: <FiBox />, path: "/product" },
  { label: "Reports", icon: <FiBarChart2 />, path: "/reports" },
  { label: "Admin Users & Roles", icon: <FiUsers />, path: "/admin-users" },
  { label: "Setting / Logs", icon: <FiSettings />, path: "/settings" },
];

export default function EditClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [showNoti, setShowNoti] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    estimatedUsers: "0 - 10",
    notes: "",
  });

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load client", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock update, replace with actual API call
    fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Client updated successfully!");
        setTimeout(() => navigate("/client"), 1500);
      })
      .catch(() => toast.error("Failed to update client"));
  };

  if (loading) return <div style={{ padding: 30, color: "white" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.sidebar}>
        <img src={logo} alt="SmartClick Logo" style={styles.logo} />
        {navItems.map((item) => {
          const isActive =
            item.path === "/client"
              ? location.pathname.startsWith("/client")
              : location.pathname === item.path;

          return (
            <div
              key={item.label}
              style={styles.navItem(isActive)}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </div>
          );
        })}
      </div>

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
          <button onClick={() => navigate(`/client-details/${id}`)} style={styles.backButton}>
            ← Back to Client Details
          </button>          
          <h2 style={styles.title}>Edit Client</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Company Name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              style={styles.inputBox}
              required
            />

            <label style={styles.label}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.inputBox}
              required
            />

            <label style={styles.label}>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.inputBox}
              type="email"
              required
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

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => navigate("/client")}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" style={styles.submitButton}>
                Save Change
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
  sidebar: {
    flexShrink: 0,
    width: 180,
    backgroundColor: "#ffffff",
    padding: "20px 12px",
  },
  logo: {
    width: 160,
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
    padding: "30px",
    position: "relative",
  },
  topbar: {
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
  cancelButton: {
    backgroundColor: "transparent",
    color: "#003d80",
    border: "1px solid #003d80",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
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
