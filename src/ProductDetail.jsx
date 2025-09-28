// src/pages/ProductDetail.jsx
import React from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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

  /* topbar row (Topbar only) */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 8 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  section: { padding: 16 },
  sectionHead: { fontWeight: 900, color: THEME.text, marginBottom: 12, opacity: 0.9 },
  divider: { height: 1, background: THEME.border, border: "none" },

  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  field: { display: "grid", gap: 8 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 8 },

  input: {
    width: "80%",
    background: "rgba(255,255,255,0.07)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
    marginBottom: 8,
  },
  inputRead: {
    opacity: 1,
    pointerEvents: "none",
    background: "rgba(255,255,255,0.08)",
  },
  selectWrap: { position: "relative", width: "80%" },
  select: {
    width: "100%",
    appearance: "none",
    background: "rgba(255,255,255,0.07)",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 38px 10px 12px",
    outline: "none",
    fontWeight: 600,
  },
  selectRead: { pointerEvents: "none", opacity: 1 },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  checksRow: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },

  actions: { display: "flex", gap: 10, marginTop: 16 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
};

export default function ProductDetail() {
  const navigate = useNavigate();

  // ให้เหมือน ClientDetails.jsx: ส่ง no-op กัน onSearchChange error
  const onSearchNoop = () => {};

  /* Read-only product data (mock) */
  const form = {
    productName: "Smart Audit",
    productCode: "smartaudit",
    status: "active",
    description: "Audit and compliance management tool",
    version: "1.0.0",
    category: "Accounting Software",
    typeTrial: true,
    typeSubscription: false,
    typePerpetual: true,
    licenseDuration: "365",
    limitSeatsEnabled: true,
    limitSeats: "100",
    limitDeviceEnabled: true,
    limitDevice: "5",
    rateLimitEnabled: true,
    rateLimit: "100 req/day",
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (ไม่มีไอคอนกระดิ่งซ้ำในหน้านี้) */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search products"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading & breadcrumb */}
          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>Product</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Product Detail</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            {/* Section: Product Information */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Product Information</div>

              <div style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Product Name</div>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.productName} readOnly />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Product Code</div>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.productCode} readOnly />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Status</div>
                  <div style={{ ...styles.selectWrap, ...styles.selectRead }}>
                    <select style={{ ...styles.select, ...styles.selectRead }} value={form.status} disabled>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>

              <div style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Description</div>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.description} readOnly />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Version</div>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.version} readOnly />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Category</div>
                  <div style={{ ...styles.selectWrap, ...styles.selectRead }}>
                    <select style={{ ...styles.select, ...styles.selectRead }} value={form.category} disabled>
                      <option>Accounting Software</option>
                      <option>Cloud Services</option>
                      <option>Developer Tools</option>
                      <option>HR & Payroll</option>
                      <option>Security</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* Section: License Policy */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>License Policy</div>

              <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 16, justifyContent: "start", alignItems: "end" }}>
                <div>
                  <div style={styles.label}>Supported License Types</div>
                  <div style={{ ...styles.checksRow, marginTop: 8 }}>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeTrial} disabled /> Trial
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeSubscription} disabled /> Subscription
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typePerpetual} disabled /> Perpetual
                    </label>
                  </div>
                </div>

                <div style={{ justifySelf: "start", width: 220 }}>
                  <div style={styles.label}>License Duration</div>
                  <div style={{ ...styles.selectWrap, ...styles.selectRead, width: "100%" }}>
                    <select style={{ ...styles.select, ...styles.selectRead }} value={form.licenseDuration} disabled>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">365 days</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* Section: Constraints */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Constraints</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.limitSeatsEnabled} disabled /> Max Seats
                  </label>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.limitSeats} readOnly />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.limitDeviceEnabled} disabled /> Max Device
                  </label>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.limitDevice} readOnly />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input type="checkbox" checked={form.rateLimitEnabled} disabled /> Rate Limit
                  </label>
                  <input style={{ ...styles.input, ...styles.inputRead }} value={form.rateLimit} readOnly />
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={() => navigate("/products/edit/:id")}>Edit Product</button>
              </div>
            </div>
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  );
}
