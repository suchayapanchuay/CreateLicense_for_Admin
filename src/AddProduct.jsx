// src/pages/AddProduct.jsx
import React, { useState } from "react";
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

/* base input ใช้ซ้ำในหลายที่ */
const baseInput = {
  width: "80%",
  background: "rgba(255,255,255,0.07)",
  color: THEME.text,
  marginBottom: 8,
  border: `1px solid ${THEME.border}`,
  borderRadius: 8,
  padding: "10px 12px",
  outline: "none",
};

const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 8px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 16 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden" },
  section: { padding: 16 },
  sectionHead: { fontWeight: 900, color: THEME.text, marginBottom: 12, opacity: 0.9 },
  divider: { height: 1, background: THEME.border, border: "none" },

  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  field: { display: "grid", gap: 6 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 8 },
  input: baseInput,
  selectWrap: { position: "relative" },
  select: {
    width: "100%",
    appearance: "none",
    background: "rgba(255,255,255,0.07)",
    color: THEME.text,
    marginBottom: 8,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 38px 10px 12px",
    outline: "none",
    fontWeight: 600,
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  checksRow: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },

  constraintWrap: { display: "grid", gap: 10, width: 360 },
  constraintInput: (enabled) => ({
    ...baseInput,
    opacity: enabled ? 1 : 0.5,
    pointerEvents: enabled ? "auto" : "none",
  }),

  actions: { display: "flex", gap: 10, marginTop: 16 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text },
};

export default function AddProduct() {
  const navigate = useNavigate();

  // ✅ ต้อง destructure เป็น [state, setter]
  const [search, setSearch] = useState("");

  /* Form state */
  const [form, setForm] = useState({
    productName: "",
    productCode: "",
    status: "active",
    description: "",
    version: "",
    category: "Accounting Software",

    // License policy
    typeTrial: false,
    typeSubscription: false,
    typePerpetual: false,
    licenseDuration: "365",

    // Constraints
    limitSeatsEnabled: false,
    limitSeats: "",
    limitDeviceEnabled: false,
    limitDevice: "",
    rateLimitEnabled: false,
    rateLimit: "",
  });

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onCreate = () => {
    const payload = {
      product: {
        name: form.productName,
        code: form.productCode,
        status: form.status,
        description: form.description,
        version: form.version,
        category: form.category,
      },
      licensePolicy: {
        supportedTypes: [
          form.typeTrial && "trial",
          form.typeSubscription && "subscription",
          form.typePerpetual && "perpetual",
        ].filter(Boolean),
        durationDays: Number(form.licenseDuration),
      },
      constraints: {
        maxSeats: form.limitSeatsEnabled ? Number(form.limitSeats || 0) : null,
        maxDevice: form.limitDeviceEnabled ? Number(form.limitDevice || 0) : null,
        rateLimit: form.rateLimitEnabled ? form.rateLimit : null,
      },
      // แถม: ใส่ search ถ้าอยากดูค่าที่พิมพ์ใน topbar
      search,
    };
    console.log("Create Product (mock) →", payload);
    alert("Product created (mock). ดู payload ใน console");
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar แบบเดียวกับหน้า Clients/Products */}
          <Topbar
            placeholder="Search products"
            onSearchChange={setSearch}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          {/* Heading & breadcrumb */}
          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>Product</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Add Product</span>
          </div>

          {/* Card */}
          <div style={styles.card}>
            {/* Section: Product Information */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Product Information</div>
              <div className="row-1" style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Product Name</div>
                  <input style={styles.input} value={form.productName} onChange={(e) => patch("productName", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Product Code</div>
                  <input style={styles.input} value={form.productCode} onChange={(e) => patch("productCode", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Status</div>
                  <div style={styles.selectWrap}>
                    <select style={styles.select} value={form.status} onChange={(e) => patch("status", e.target.value)}>
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
                  <input style={styles.input} value={form.description} onChange={(e) => patch("description", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Version</div>
                  <input style={styles.input} value={form.version} onChange={(e) => patch("version", e.target.value)} />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Category</div>
                  <div style={styles.selectWrap}>
                    <select style={styles.select} value={form.category} onChange={(e) => patch("category", e.target.value)}>
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

              <div className="policy" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
                <div>
                  <div style={styles.label}>Supported License Types</div>
                  <div style={{ ...styles.checksRow, marginTop: 8 }}>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeTrial} onChange={(e) => patch("typeTrial", e.target.checked)} />
                      Trial
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typeSubscription} onChange={(e) => patch("typeSubscription", e.target.checked)} />
                      Subscription
                    </label>
                    <label style={styles.check}>
                      <input type="checkbox" checked={form.typePerpetual} onChange={(e) => patch("typePerpetual", e.target.checked)} />
                      Perpetual
                    </label>
                  </div>
                </div>

                <div style={{ justifySelf: "start", width: 220 }}>
                  <div style={styles.label}>License Duration</div>
                  <div style={styles.selectWrap}>
                    <select style={styles.select} value={form.licenseDuration} onChange={(e) => patch("licenseDuration", e.target.value)}>
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
                <div style={styles.constraintWrap}>
                  <label style={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.limitSeatsEnabled}
                      onChange={(e) => patch("limitSeatsEnabled", e.target.checked)}
                    />
                    Max Seats
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={form.limitSeats}
                    onChange={(e) => patch("limitSeats", e.target.value)}
                    style={styles.constraintInput(form.limitSeatsEnabled)}
                  />
                </div>

                <div style={styles.constraintWrap}>
                  <label style={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.limitDeviceEnabled}
                      onChange={(e) => patch("limitDeviceEnabled", e.target.checked)}
                    />
                    Max Device
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={form.limitDevice}
                    onChange={(e) => patch("limitDevice", e.target.value)}
                    style={styles.constraintInput(form.limitDeviceEnabled)}
                  />
                </div>

                <div style={styles.constraintWrap}>
                  <label style={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.rateLimitEnabled}
                      onChange={(e) => patch("rateLimitEnabled", e.target.checked)}
                    />
                    Rate Limit
                  </label>
                  <input
                    placeholder="e.g. 100 req/min"
                    value={form.rateLimit}
                    onChange={(e) => patch("rateLimit", e.target.value)}
                    style={styles.constraintInput(form.rateLimitEnabled)}
                  />
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={onCreate}>Create Product</button>
                <button style={styles.btnGhost} onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  );
}
