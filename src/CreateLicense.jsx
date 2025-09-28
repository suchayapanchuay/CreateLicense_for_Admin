// src/app/CreateLicense.jsx
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

/* -------- THEME -------- */
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

/* -------- STYLES -------- */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  sectionTitle: { fontSize: 18, fontWeight: 900, color: THEME.text, margin: "18px 0 10px" },
  hr: { height: 1, background: THEME.border, border: "none", margin: "12px 0 16px" },

  formCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.07)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none",
  },

  selectWrap: { position: "relative" },
  select: {
    width: "100%", appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
    background: "rgba(255,255,255,0.07)", color: THEME.text, border: `1px solid ${THEME.border}`,
    borderRadius: 8, padding: "10px 40px 10px 12px", outline: "none", fontWeight: 600,
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  checksRow: { display: "flex", gap: 18, alignItems: "center", marginTop: 10, color: THEME.text },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },

  notes: { width: "98%", height: 44, resize: "vertical", minHeight: 44, background: "rgba(255,255,255,0.07)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text },
};

export default function CreateLicense() {
  const navigate = useNavigate();

  // รับค่าค้นหาจาก Topbar (เผื่อใช้ต่อในอนาคต เช่น lookup client)
  const [search, setSearch] = useState("");

  /* ------------ Form State ------------- */
  const [form, setForm] = useState({
    client: "",
    product: "",
    licenseTypes: { trial: false, subscription: false, perpetual: false },
    maxActivations: "",
    ipLock: false,
    notes: "",
  });

  const handleChange = (patch) => setForm((f) => ({ ...f, ...patch }));
  const handleLicenseType = (key) =>
    setForm((f) => ({ ...f, licenseTypes: { ...f.licenseTypes, [key]: !f.licenseTypes[key] } }));

  const onCreate = () => {
    // TODO: call API จริง
    console.log("Create License → payload:", form, "search:", search);
    alert("License created (mock). ดู payload ใน console");
  };

  return (
    <div style={styles.root}>
      <Sidebar />

      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (รีใช้ซ้ำได้ทุกหน้า) */}
          <Topbar
            placeholder="Search clients"
            onSearchChange={setSearch}   // ✅ ส่งฟังก์ชันจริง
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          {/* Heading + Breadcrumb */}
          <div style={styles.title}>Create License</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp;
            <span style={{ color: "#9CC3FF" }}>Create License</span>
          </div>

          {/* SECTION: Select Client & Product */}
          <div style={styles.sectionTitle}>Select Client & Product</div>
          <div style={styles.formCard}>
            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Client</div>
                <div style={styles.selectWrap}>
                  <select
                    value={form.client}
                    onChange={(e) => handleChange({ client: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">Select client</option>
                    <option value="Client A">Client A</option>
                    <option value="Client B">Client B</option>
                    <option value="Client C">Client C</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>

              <div>
                <div style={styles.label}>Product</div>
                <div style={styles.selectWrap}>
                  <select
                    value={form.product}
                    onChange={(e) => handleChange({ product: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">Select product</option>
                    <option value="Smart Audit">Smart Audit</option>
                    <option value="Smart Audit Pro">Smart Audit Pro</option>
                  </select>
                  <FiChevronDown style={styles.caret} />
                </div>
              </div>
            </div>

            <div style={styles.checksRow}>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.trial}
                  onChange={() => handleLicenseType("trial")}
                />
                Trial
              </label>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.subscription}
                  onChange={() => handleLicenseType("subscription")}
                />
                Subscription
              </label>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.licenseTypes.perpetual}
                  onChange={() => handleLicenseType("perpetual")}
                />
                Perpetual
              </label>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* SECTION: Activation & Constraints */}
          <div style={styles.sectionTitle}>Activation &amp; Constraints</div>
          <div style={styles.formCard}>
            <div>
              <div style={styles.label}>Max Activations</div>
              <div style={styles.selectWrap}>
                <select
                  value={form.maxActivations}
                  onChange={(e) => handleChange({ maxActivations: e.target.value })}
                  style={styles.select}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="unlimited">Unlimited</option>
                </select>
                <FiChevronDown style={styles.caret} />
              </div>
            </div>

            <div className="iplock" style={{ marginTop: 12 }}>
              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.ipLock}
                  onChange={(e) => handleChange({ ipLock: e.target.checked })}
                />
                IP Lock
              </label>
            </div>
          </div>

          <hr style={styles.hr} />

          {/* SECTION: Notes & Internal Reference */}
          <div style={styles.sectionTitle}>Notes &amp; Internal Reference</div>
          <div style={styles.formCard}>
            <div style={styles.label}>Internal Notes</div>
            <textarea
              placeholder="Add optional notes..."
              value={form.notes}
              onChange={(e) => handleChange({ notes: e.target.value })}
              style={styles.notes}
            />
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={onCreate}>Create License</button>
            <button style={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
