// src/pages/AddProduct.jsx
import React, { useCallback, useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* THEME (Light to match other pages) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
};

/* base input ใช้ซ้ำในหลายที่ */
const baseInput = {
  width: "80%",
  background: "#FFFFFF",
  color: THEME.text,
  marginBottom: 8,
  border: `1px solid ${THEME.border}`,
  borderRadius: 8,
  padding: "10px 12px",
  outline: "none",
};

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "20px 16px", position: "relative" },
  stage: {
    width: 1152,
    minHeight: 800,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.08)",
  },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 8px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 16 },

  card: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.06)",
  },
  section: { padding: 16, background: "#FFFFFF" },
  sectionHead: { fontWeight: 900, color: THEME.text, marginBottom: 12, opacity: 0.95 },
  divider: { height: 1, background: THEME.border, border: "none" },

  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  field: { display: "grid", gap: 6 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 8 },
  input: baseInput,
  inputError: { ...baseInput, border: "1px solid #DC2626", boxShadow: "0 0 0 3px rgba(220,38,38,0.08)" },
  hint: { color: THEME.textFaint, fontSize: 12, marginTop: -4, marginBottom: 8 },

  selectWrap: { position: "relative" },
  select: {
    width: "100%",
    appearance: "none",
    background: "#FFFFFF",
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
  constraintInput: (enabled, hasError) => ({
    ...baseInput,
    opacity: enabled ? 1 : 0.6,
    pointerEvents: enabled ? "auto" : "none",
    border: hasError ? "1px solid #DC2626" : baseInput.border,
    boxShadow: hasError ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
  }),

  actions: { display: "flex", gap: 10, marginTop: 16 },
  btnPrimary: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    background: THEME.accent,
    color: "#fff",
    boxShadow: "0 4px 10px rgba(37,99,235,.25)",
  },
  btnGhost: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.text,
  },

  noticeError: { marginTop: 8, color: "#DC2626", fontWeight: 700 },
  noticeOk: { marginTop: 8, color: "#16A34A", fontWeight: 800 },
};

const initialForm = {
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
};

export default function AddProduct() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [fieldErr, setFieldErr] = useState({}); // เก็บ error ราย field

  const [form, setForm] = useState(initialForm);
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* ---------- Helpers ---------- */
  const numOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const sanitizePayload = (payload) => {
    // ลบ key ที่เป็น null/undefined ออกเพื่อลด noise
    const prune = (obj) => {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
          if (v === null || v === undefined || v === "") continue;
          out[k] = prune(v);
        }
        return out;
      }
      if (Array.isArray(obj)) return obj.filter((x) => x != null);
      return obj;
    };
    return prune(payload);
  };

  const validate = useCallback(() => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Please fill Product Name";

    // ถ้า enable แล้วต้องมีค่าตัวเลข
    if (form.limitSeatsEnabled && !numOrNull(form.limitSeats)) {
      errs.limitSeats = "Seats must be a positive number";
    }
    if (form.limitDeviceEnabled && !numOrNull(form.limitDevice)) {
      errs.limitDevice = "Device must be a positive number";
    }
    // license types: ถ้าตั้ง duration แต่ไม่เลือก type เลย เตือน (กัน user งง)
    const anyType =
      form.typeTrial || form.typeSubscription || form.typePerpetual;
    if ((form.licenseDuration && Number(form.licenseDuration) > 0) && !anyType) {
      errs.licenseTypes = "Select at least one license type";
    }
    return errs;
  }, [form]);

  useEffect(() => {
    // คีย์ลัด: Ctrl/Cmd + Enter = Create
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        onCreate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [form]); // eslint-disable-line

  /* ---------- Submit ---------- */
  const onCreate = async () => {
    if (submitting) return;
    setErr("");
    setOk("");
    const errs = validate();
    setFieldErr(errs);
    if (Object.keys(errs).length) {
      setErr("Please fix the highlighted fields.");
      return;
    }

    const payload = sanitizePayload({
      name: form.productName.trim(),
      sku: form.productCode?.trim() || null,
      category: form.category || null,
      isActive: form.status === "active",
      description: form.description?.trim() || null,
      meta: {
        version: form.version || null,
        licensePolicy: {
          supportedTypes: [
            form.typeTrial && "trial",
            form.typeSubscription && "subscription",
            form.typePerpetual && "perpetual",
          ].filter(Boolean),
          durationDays: numOrNull(form.licenseDuration),
        },
        constraints: {
          maxSeats: form.limitSeatsEnabled ? numOrNull(form.limitSeats) : null,
          maxDevice: form.limitDeviceEnabled ? numOrNull(form.limitDevice) : null,
          rateLimit: form.rateLimitEnabled ? (form.rateLimit || null) : null,
        },
        _searchEcho: search || null,
      },
    });

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      let text = "";
      try {
        data = await res.json();
      } catch {
        try { text = await res.text(); } catch {}
      }

      if (!res.ok) {
        const msg = (data && data.detail) ? data.detail : (text || `HTTP ${res.status}`);
        if (res.status === 409) {
          if (/SKU/i.test(msg)) throw new Error("SKU already exists");
          if (/name/i.test(msg)) throw new Error("Product name already exists");
          throw new Error("Duplicate value");
        }
        throw new Error(msg);
      }

      setOk("Product created successfully");
      setTimeout(() => navigate("/product"), 600);
    } catch (e) {
      setErr(e?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setForm(initialForm);
    setErr("");
    setOk("");
    setFieldErr({});
  };

  /* ---------- UI ---------- */
  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <Topbar
            placeholder="Search products"
            onSearchChange={typeof setSearch === "function" ? setSearch : undefined}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>Product</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#1D4ED8", fontWeight: 700 }}>Add Product</span>
          </div>

          <div style={styles.card}>
            {/* Product Information */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Product Information</div>
              <div className="row-1" style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Product Name</div>
                  <input
                    style={fieldErr.productName ? styles.inputError : styles.input}
                    value={form.productName}
                    onChange={(e) => patch("productName", e.target.value)}
                    placeholder="e.g. Smart Audit"
                  />
                  {fieldErr.productName && <div style={{ color: "#DC2626", fontSize: 12 }}>{fieldErr.productName}</div>}
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Product Code (SKU)</div>
                  <input
                    style={styles.input}
                    value={form.productCode}
                    onChange={(e) => patch("productCode", e.target.value)}
                    placeholder="e.g. SA-001"
                  />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Status</div>
                  <div style={styles.selectWrap}>
                    <select
                      style={styles.select}
                      value={form.status}
                      onChange={(e) => patch("status", e.target.value)}
                    >
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
                  <input
                    style={styles.input}
                    value={form.description}
                    onChange={(e) => patch("description", e.target.value)}
                    placeholder="Short description"
                  />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Version</div>
                  <input
                    style={styles.input}
                    value={form.version}
                    onChange={(e) => patch("version", e.target.value)}
                    placeholder="e.g. 1.0.0"
                  />
                </div>
                <div style={styles.field}>
                  <div style={styles.label}>Category</div>
                  <div style={styles.selectWrap}>
                    <select
                      style={styles.select}
                      value={form.category}
                      onChange={(e) => patch("category", e.target.value)}
                    >
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

            {/* License Policy */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>License Policy</div>
              <div className="policy" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
                <div>
                  <div style={styles.label}>Supported License Types</div>
                  <div style={{ ...styles.checksRow, marginTop: 8 }}>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typeTrial}
                        onChange={(e) => patch("typeTrial", e.target.checked)}
                      />
                      Trial
                    </label>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typeSubscription}
                        onChange={(e) => patch("typeSubscription", e.target.checked)}
                      />
                      Subscription
                    </label>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typePerpetual}
                        onChange={(e) => patch("typePerpetual", e.target.checked)}
                      />
                      Perpetual
                    </label>
                  </div>
                  {fieldErr.licenseTypes && <div style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>{fieldErr.licenseTypes}</div>}
                </div>

                <div style={{ justifySelf: "start", width: 220 }}>
                  <div style={styles.label}>License Duration</div>
                  <div style={styles.selectWrap}>
                    <select
                      style={styles.select}
                      value={form.licenseDuration}
                      onChange={(e) => patch("licenseDuration", e.target.value)}
                    >
                      <option value="7">15 days</option>
                      <option value="365">365 days</option>
                    </select>
                    <FiChevronDown style={styles.caret} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            {/* Constraints */}
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
                    style={styles.constraintInput(form.limitSeatsEnabled, !!fieldErr.limitSeats)}
                  />
                  {fieldErr.limitSeats && <div style={{ color: "#DC2626", fontSize: 12 }}>{fieldErr.limitSeats}</div>}
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
                    style={styles.constraintInput(form.limitDeviceEnabled, !!fieldErr.limitDevice)}
                  />
                  {fieldErr.limitDevice && <div style={{ color: "#DC2626", fontSize: 12 }}>{fieldErr.limitDevice}</div>}
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
                    style={styles.constraintInput(form.rateLimitEnabled, false)}
                  />
                </div>
              </div>

              {err ? <div style={styles.noticeError}>{err}</div> : null}
              {ok ? <div style={styles.noticeOk}>{ok}</div> : null}

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={onCreate} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Product"}
                </button>
                <button style={styles.btnGhost} onClick={onReset} disabled={submitting}>
                  Reset
                </button>
                <button style={styles.btnGhost} onClick={() => navigate(-1)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  );
}
