// Updated Email Template page with styled editable form and working preview
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Sidebar from "./SideBar";

const emailTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    des: "Email sent to new users upon registration",
    update: "2023-05-15",
    subject: "Welcome to SmartClick!",
    body: "Dear {{user_name}},\n\nWelcome to SmartClick! Your account is ready to use.",
    enabled: true,
  },
  {
    id: 2,
    name: "License Expiry",
    des: "Reminder before license expires",
    update: "2025-03-30",
    subject: "Your License is Expiring Soon",
    body: "Hi {{user_name}},\n\nYour license will expire on {{expiry_date}}. Please renew.",
    enabled: true,
  },
  {
    id: 3,
    name: "License Issued",
    des: "Notify user when a new license is issued",
    update: "2025-07-29",
    subject: "Your License Key for {{product_name}}",
    body: "Dear {{user_name}},\n\nYour license key for {{product_name}} is: {{license_key}}.\n\nStart Date: {{start_date}}\nExpiry Date: {{expiry_date}}",
    enabled: true,
  },
  {
    id: 4,
    name: "License Activated",
    des: "Confirmation after license activation",
    update: "2025-07-29",
    subject: "License Activated Successfully",
    body: "Hi {{user_name}},\n\nYour license {{license_key}} has been activated on device {{device_id}}.",
    enabled: true,
  },
  {
    id: 5,
    name: "License Revoked",
    des: "Inform when license is revoked",
    update: "2025-07-28",
    subject: "Your License has been Revoked",
    body: "Dear {{user_name}},\n\nYour license for {{product_name}} has been revoked and is no longer active.",
    enabled: true,
  },
  {
    id: 6,
    name: "Invalid Activation Attempt",
    des: "Alert on failed license activation attempt",
    update: "2025-07-29",
    subject: "Activation Failed",
    body: "Hi {{user_name}},\n\nThere was an invalid attempt to activate your license {{license_key}}.\nPlease ensure your key is valid and not expired.",
    enabled: true,
  },
];

const replacePlaceholders = (template, values) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || `{{${key}}}`);
};

const renderPreview = (template) => {
  const sampleData = {
    user_name: "John Doe",
    license_key: "ABCD-1234",
    product_name: "SmartGuard Pro",
    start_date: "2025-08-01",
    expiry_date: "2026-08-01",
    device_id: "Device-XYZ",
  };
  return replacePlaceholders(template, sampleData);
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#003d80", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  content: { flex: 1, backgroundColor: "#003d80", display: "flex", flexDirection: "column", padding: "30px", overflowX: "hidden", position: "relative" },
  topbar: { backgroundColor: "#003d80", padding: "12px 20px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, color: "white" },
  searchBox: { display: "flex", alignItems: "center", backgroundColor: "#003d80", border: "1px solid white", borderRadius: 10, padding: "4px 12px", color: "#ffffff" },
  input: { border: "none", padding: "4px 8px", outline: "none", backgroundColor: "transparent", color: "#ffffff" },
  table: { width: "100%", marginTop: 30, borderCollapse: "collapse", backgroundColor: "white", borderRadius: 8, overflow: "hidden" },
  th: { backgroundColor: "#1e3a8a", color: "white", padding: "12px", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #e5e7eb" },
  actionButton: { backgroundColor: "#004185", color: "white", border: "none", borderRadius: 4, padding: "6px 10px", marginRight: 6, cursor: "pointer" },
  editPanel: { backgroundColor: "#f8fafc", padding: 45, borderRadius: 10, marginTop: 25, maxWidth: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  label: { fontWeight: "bold", marginTop: 20, display: "block", color: "#1e293b" },
  inputBox: { width: "100%", padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15 },
  textarea: { width: "100%", height: 160, padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15, lineHeight: "1.6" },
  previewBox: { backgroundColor: "#ffffff", border: "1px solid #d1d5db", padding: 20, borderRadius: 10, marginTop: 30, whiteSpace: "pre-wrap", fontFamily: "'Segoe UI', Tahoma", fontSize: 15 },
  saveButton: { backgroundColor: "#10b981", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginTop: 24 },
};

export default function Email() {
  const [showNoti, setShowNoti] = useState(false);
  const [editing, setEditing] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [enabled, setEnabled] = useState(true);

  const handleEdit = (email) => {
    setEditing(email);
    setSubject(email.subject);
    setBody(email.body);
    setEnabled(email.enabled);
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

        <h2 style={{ color: "white", marginTop: 20 }}>Email Template</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Template Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates.map((email) => (
              <tr key={email.id}>
                <td style={styles.td}>{email.name}</td>
                <td style={styles.td}>{email.des}</td>
                <td style={styles.td}>
                  <button style={styles.actionButton} onClick={() => handleEdit(email)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editing && (
          <div style={styles.editPanel}>
            <h3>Editing: {editing.name}</h3>

            <div style={styles.label}>Subject</div>
            <input style={styles.inputBox} value={subject} onChange={(e) => setSubject(e.target.value)} />

            <div style={styles.label}>
            Body (use placeholders like {"{{user_name}}"}, {"{{license_key}}"})
          </div>

            <textarea style={styles.textarea} value={body} onChange={(e) => setBody(e.target.value)} />

            <div style={{ marginTop: 16 }}>
              <label>
                <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enable this email
              </label>
            </div>

            <button style={styles.saveButton}>Save Changes</button>

            <div style={styles.label}>Preview</div>
            <div style={styles.previewBox}>{renderPreview(body)}</div>
          </div>
        )}
      </div>
    </div>
  );
}