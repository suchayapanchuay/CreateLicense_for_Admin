// src/ClientDetails.jsx
import React from "react";
import Sidebar from "./SideBar";
import { FiEye } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";

/* THEME */
const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  textFaint: "rgba(255,255,255,0.55)",
  accent: "#3B82F6",
};

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18, marginBottom: 20 },
  typePill: { background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 8, fontWeight: 700, display: "inline-block", marginBottom: 16, color: THEME.text },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: { width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDanger: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#B4534E", color: "#fff" },

  sectionTitle: { fontSize: 20, fontWeight: 900, color: THEME.text, margin: "18px 0 10px" },
  hr: { height: 1, background: THEME.border, border: "none", margin: "12px 0 16px" },

  tableWrap: { borderRadius: 10, overflow: "hidden", marginTop: 8, border: `1px solid ${THEME.border}`, background: THEME.card },
  header: { background: "rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "12px 16px", fontWeight: 700, color: THEME.text },
  row: { display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text },

  eyeBtn: { width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },
};

export default function ClientDetails() {
  const navigate = useNavigate();
  const { id: clientId = 1 } = useParams();

  /* Mock data */
  const client = {
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "BlankSpace",
    industry: "Software Engineer",
    country: "Thailand",
    estimateUser: "10",
    message: "Please contact us within this month.",
    trial: "15 days",
    username: "User101",
    password: "U12S36",
  };

  const license = {
    product: "Smart Audit",
    type: "Trial",
    key: "ABCD-1234-EFGH-5678",
    start: "August 1, 2023",
    end: "July 31, 2024",
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar กลาง: ส่งฟังก์ชัน no-op เพื่อกัน error */}
          <Topbar
            placeholder="Search clients"
            defaultFilter="all"
            onViewAllPath="/Noti"
            onSearchChange={() => {}}   // ✅ ป้องกัน onSearchChange ไม่ใช่ฟังก์ชัน
          />

          {/* Heading */}
          <div style={styles.title}>Client Detail</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>Client Detail</span>
          </div>

          {/* Client Card */}
          <div style={styles.card}>
            <div style={styles.typePill}>Trial Request</div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>First Name</div><div style={styles.pillInput}>{client.firstName}</div></div>
              <div><div style={styles.label}>Last Name</div><div style={styles.pillInput}>{client.lastName}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Email</div><div style={styles.pillInput}>{client.email}</div></div>
              <div><div style={styles.label}>Phone</div><div style={styles.pillInput}>{client.phone}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Country</div><div style={styles.pillInput}>{client.country}</div></div>
              <div><div style={styles.label}>Company</div><div style={styles.pillInput}>{client.company}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Industry</div><div style={styles.pillInput}>{client.industry}</div></div>
              <div><div style={styles.label}>Message</div><div style={styles.pillInput}>{client.message}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Estimate User</div><div style={styles.pillInput}>{client.estimateUser}</div></div>
              <div><div style={styles.label}>Trial</div><div style={styles.pillInput}>{client.trial}</div></div>
            </div>
            <div style={styles.grid2}>
              <div><div style={styles.label}>Username</div><div style={styles.pillInput}>{client.username}</div></div>
              <div><div style={styles.label}>Password</div><div style={styles.pillInput}>{client.password}</div></div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigate(`/client/${clientId}/edit`)}
              >
                Edit Client
              </button>
              <button
                style={styles.btnDanger}
                onClick={() => {
                  if (window.confirm("Delete this client?")) {
                    // TODO: call API ลบจริง
                    alert("Client deleted (mock)");
                    navigate("/client");
                  }
                }}
              >
                Delete Client
              </button>
            </div>
          </div>

          {/* License Section */}
          <div style={styles.sectionTitle}>License</div>
          <hr style={styles.hr} />
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product</div>
              <div>Type</div>
              <div>License Key</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Actions</div>
            </div>
            <div style={styles.row}>
              <div>{license.product}</div>
              <div>{license.type}</div>
              <div>{license.key}</div>
              <div>{license.start}</div>
              <div>{license.end}</div>
              <div>
                <button
                  style={styles.eyeBtn}
                  onClick={() => navigate("/license")}
                >
                  <FiEye />
                </button>
              </div>
            </div>
          </div>
          {/* /License */}
        </div>
      </div>
    </div>
  );
}
