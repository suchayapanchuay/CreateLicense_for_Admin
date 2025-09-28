// src/app/EditClient.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
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

/* STYLES (ตัด topbar / notifications เดิมออก) */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },

  typeSelectWrap: { position: "relative", width: 220, marginBottom: 12 },
  typeSelect: {
    width: "100%", appearance: "none", background: "rgba(255,255,255,0.08)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 40px 10px 12px", fontWeight: 700, cursor: "pointer"
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: {
    width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none"
  },

  credBox: { border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16, marginTop: 12 },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: { border: "none", padding: "8px 10px", fontWeight: 700, borderRadius: 8, cursor: "pointer" },
  smallBtnBlue: { background: "#52B1E6", color: "#062033" },
  smallBtnGreen: { background: "#3DD9B0", color: "#062033" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text },
};

export default function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams(); // ถ้า route เป็น /client/:id/edit

  /* Form: เริ่มจากข้อมูลเดิม (mock) */
  const [reqType, setReqType] = useState("trial");
  const [form, setForm] = useState({
    firstName: "Suchaya",
    lastName: "Panchuai",
    email: "suchaya19@gmail.com",
    phone: "0631234567",
    company: "BlankSpace",
    industry: "Software Engineer",
    country: "Thailand",
    estimateUser: "10",
    message: "Please contact us within this month.",
    trialDays: "15 days",
    username: "User101",
    password: "U12S36",
  });

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const randomUsername = () => {
    const base = ["User", "Client", "Member", "Acct", "Cust"];
    const name = base[Math.floor(Math.random() * base.length)] + (100 + Math.floor(Math.random() * 900));
    patch("username", name);
  };
  const randomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pw = "";
    for (let i = 0; i < 6; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    patch("password", pw);
  };

  const onSave = () => {
    const payload = { id, requestType: reqType, ...form };
    console.log("Save Client (mock) →", payload);
    alert("Changes saved (mock). ดู payload ใน console");
    // TODO: call API PATCH/PUT แล้ว navigate ไปหน้า detail จริง
  };

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar กลาง (รีใช้ซ้ำ) */}
          <Topbar
            placeholder="Search clients"
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          {/* Heading */}
          <div style={styles.title}>Edit Client</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp;
            <span style={{ cursor: "pointer" }} onClick={() => navigate(`/client-details/${id || 1}`)}>Client Detail</span>
            &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>Edit Client</span>
          </div>

          {/* Form Card */}
          <div style={styles.card}>
            {/* Request type (pill style select) */}
            <div style={styles.typeSelectWrap}>
              <select value={reqType} onChange={(e) => setReqType(e.target.value)} style={styles.typeSelect}>
                <option value="trial">Trial Request</option>
                <option value="purchase">Purchase Request</option>
                <option value="support">Support Request</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            {/* Rows */}
            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>First Name</div>
                <input value={form.firstName} onChange={(e) => patch("firstName", e.target.value)} style={styles.pillInput} />
              </div>
              <div>
                <div style={styles.label}>Last Name</div>
                <input value={form.lastName} onChange={(e) => patch("lastName", e.target.value)} style={styles.pillInput} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Email</div>
                <input value={form.email} onChange={(e) => patch("email", e.target.value)} style={styles.pillInput} />
              </div>
              <div>
                <div style={styles.label}>Phone</div>
                <input value={form.phone} onChange={(e) => patch("phone", e.target.value)} style={styles.pillInput} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Country</div>
                <input value={form.country} onChange={(e) => patch("country", e.target.value)} style={styles.pillInput} />
              </div>
              <div>
                <div style={styles.label}>Company</div>
                <input value={form.company} onChange={(e) => patch("company", e.target.value)} style={styles.pillInput} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Industry</div>
                <input value={form.industry} onChange={(e) => patch("industry", e.target.value)} style={styles.pillInput} />
              </div>
              <div>
                <div style={styles.label}>Message</div>
                <input value={form.message} onChange={(e) => patch("message", e.target.value)} style={styles.pillInput} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Estimate User</div>
                <input value={form.estimateUser} onChange={(e) => patch("estimateUser", e.target.value)} style={styles.pillInput} />
              </div>
              <div>
                <div style={styles.label}>Trial</div>
                <input value={form.trialDays} onChange={(e) => patch("trialDays", e.target.value)} style={styles.pillInput} />
              </div>
            </div>

            {/* Credentials */}
            <div style={styles.credBox}>
              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>Username</div>
                  <div style={styles.inline}>
                    <input value={form.username} onChange={(e) => patch("username", e.target.value)} style={styles.pillInput} />
                    <button style={{ ...styles.smallBtn, ...styles.smallBtnBlue }} onClick={randomUsername}>Random Username</button>
                  </div>
                </div>
                <div>
                  <div style={styles.label}>Password</div>
                  <div style={styles.inline}>
                    <input value={form.password} onChange={(e) => patch("password", e.target.value)} style={styles.pillInput} />
                    <button style={{ ...styles.smallBtn, ...styles.smallBtnGreen }} onClick={randomPassword}>Random Password</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onSave}>Save Changes</button>
              <button style={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </div>
          {/* /Form Card */}
        </div>
      </div>
    </div>
  );
}
