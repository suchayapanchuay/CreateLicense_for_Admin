import React, { useState, useEffect, useRef } from "react";
import {
   FiSearch, FiMoreHorizontal,
} from "react-icons/fi";

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

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
    backgroundColor: "#003d80",
    color: "#ffffff",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    borderBottom: "1px solid #ffffff44",
    paddingBottom: 4,
    margin: "30px 0 20px 0",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    display: "block",
  },
  inputField: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 6,
    border: "none",
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#000",
    appearance: "none",
  },
  checkboxRow: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  toggleWrapper: {
    display: "flex",
    gap: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  toggle: {
    position: "relative",
    display: "inline-block",
    width: 42,
    height: 22,
  },
  toggleSlider: (on) => ({
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: on ? "#22c55e" : "#ccc",
    borderRadius: 20,
    transition: ".4s",
  }),
  toggleCircle: (on) => ({
    position: "absolute",
    height: 16,
    width: 16,
    left: on ? 22 : 3,
    top: 3,
    backgroundColor: "white",
    borderRadius: "50%",
    transition: ".4s",
  }),
  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 30,
    position: "relative",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  menuButtonWrapper: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 8,
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: 6,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    zIndex: 10,
    minWidth: 160,
  },
  dropdownItem: {
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 14,
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 6,
    transition: "background-color 0.2s ease",
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
    color: "#000",
  },
  notiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #ccc",
    fontWeight: "bold",
    fontSize: 16,
    color: "#000"
  },
  notiItem: {
    padding: "10px 16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#000"
  }

};


export default function CreateLicense() {
  const [onlineCheckin, setOnlineCheckin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showNoti, setShowNoti] = useState(false);
  const menuRef = useRef(null);
  const notiRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    "License expired for Client ABC",
    "New client added: XYZ Co.",
    "Trial license expiring soon",
  ];

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");

  const clientOptions = ["Client A", "Client B", "Client C"];
  const productOptions = ["SmartPOS", "SmartHotel", "SmartRetail"];
  const versionOptions = ["v1.0", "v2.0", "v3.0"];

  return (
    <div style={styles.container}>
      <Sidebar/>

      <div style={styles.content}>
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch color="white" />
            <input placeholder="search" style={styles.input} />
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setShowNoti(true)}>
            <IoMdNotificationsOutline size={24} color="white" />
          </div>
        </div>

        {showNoti && (
          <div style={styles.notiPanel} ref={notiRef}>
            <div style={styles.notiHeader}>
              Notifications
              <IoClose onClick={() => setShowNoti(false)} style={{ cursor: "pointer" }} />
            </div>
            {notifications.map((msg, idx) => (
              <div key={idx} style={styles.notiItem}>{msg}</div>
            ))}
          </div>
        )}

        <h2 style={styles.title}>Create License</h2>

        <div style={styles.sectionTitle}>Select Client & Product</div>
        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              style={styles.inputField}
            >
              <option value="">-- Select Client --</option>
              {clientOptions.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={styles.inputField}
            >
              <option value="">-- Select Product --</option>
              {productOptions.map((product) => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={styles.label}>Version</label>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            style={styles.inputField}
          >
            <option value="">-- Select Version --</option>
            {versionOptions.map((version) => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </div>

        <div style={styles.checkboxRow}>
          <label><input type="checkbox" /> Trial</label>
          <label><input type="checkbox" /> Subscription</label>
          <label><input type="checkbox" /> Perpetual</label>
        </div>

        <div style={styles.sectionTitle}>Activation & Constraints</div>
        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Max Activations</label>
            <input type="number" style={styles.inputField} />
          </div>
        </div>

        <div style={styles.toggleWrapper}>
          <label><input type="checkbox" /> IP Lock</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Online Check-in</span>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={onlineCheckin}
                onChange={() => setOnlineCheckin(!onlineCheckin)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={styles.toggleSlider(onlineCheckin)} />
              <span style={styles.toggleCircle(onlineCheckin)} />
            </label>
          </div>
        </div>

        <div style={styles.sectionTitle}>Notes & Internal Reference</div>
        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Internal Notes</label>
            <input type="text" style={styles.inputField} />
          </div>
        </div>

        <div style={styles.buttonRow} ref={menuRef}>
          <button style={{ ...styles.button, backgroundColor: "#3b82f6", color: "white" }}>
            Generate License
          </button>
          <button style={{ ...styles.button, backgroundColor: "#ffffff", color: "#000000" }}>
            Download
          </button>
          <div style={styles.menuButtonWrapper}>
            <button
              onClick={toggleMenu}
              style={{ ...styles.button, backgroundColor: "#ffffff", color: "#000000" }}
            >
              <FiMoreHorizontal />
            </button>
            {menuOpen && (
              <div style={styles.dropdownMenu}>
                {["Send to Client", "Save Draft"].map((label) => (
                  <div
                    key={label}
                    onClick={() => {
                      alert(label);
                      setMenuOpen(false);
                    }}
                    onMouseEnter={() => setHoveredItem(label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      ...styles.dropdownItem,
                      backgroundColor: hoveredItem === label ? "#b9b9b9ff" : "#fff",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}