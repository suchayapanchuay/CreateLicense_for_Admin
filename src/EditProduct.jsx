// src/pages/EditProduct.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* THEME (Light) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  danger: "#ef4444",
};

/* STYLES */
const styles = {
  root: {
    display: "flex",
    minHeight: "1024px",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "18px 16px",
    position: "relative",
  },
  stage: {
    width: 1152,
    minHeight: 988,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.08)",
  },
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 8 },
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
  field: { display: "grid", gap: 8 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 8 },
  input: {
    width: "80%",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
    marginBottom: 8,
  },
  selectWrap: { position: "relative", width: "80%" },
  select: {
    width: "100%",
    appearance: "none",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 38px 10px 12px",
    outline: "none",
    fontWeight: 600,
  },
  caret: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: THEME.textFaint,
    pointerEvents: "none",
  },
  checksRow: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, color: THEME.text },
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
  btnDangerGhost: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "transparent",
    color: "#DC2626",
  },
  error: { color: "#DC2626", fontWeight: 700, marginBottom: 12 },
  note: { color: THEME.textFaint, fontSize: 12, marginTop: -4 },
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // /products/edit/:id

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        const txt = await res.text();
        if (!res.ok) {
          let detail = {};
          try {
            detail = JSON.parse(txt);
          } catch {}
          throw new Error(detail?.detail || `HTTP ${res.status}`);
        }
        const json = JSON.parse(txt || "{}");
        if (alive) setData(json);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // ฟอร์ม
  const [form, setForm] = useState(null);

  // ตั้งค่าเริ่มต้นให้ฟอร์มจาก data
  useEffect(() => {
    if (!data) return;
    const meta = data.meta || {};
    const licensePolicy = meta.licensePolicy || {};
    const constraints = meta.constraints || {};
    const supported = new Set(licensePolicy.supportedTypes || []);
    setForm({
      productName: data.name || "",
      productCode: data.sku || "",
      status: data.isActive ? "active" : "inactive",
      description: data.description || "",
      version: meta.version || "",
      category: data.category || "Accounting Software",
      typeTrial: supported.has("trial"),
      typeSubscription: supported.has("subscription"),
      typePerpetual: supported.has("perpetual"),
      licenseDuration:
        licensePolicy.durationDays != null ? String(licensePolicy.durationDays) : "",
      limitSeatsEnabled: constraints.maxSeats != null,
      limitSeats: constraints.maxSeats != null ? String(constraints.maxSeats) : "",
      limitDeviceEnabled: constraints.maxDevice != null,
      limitDevice: constraints.maxDevice != null ? String(constraints.maxDevice) : "",
      rateLimitEnabled: constraints.rateLimit != null && constraints.rateLimit !== "",
      rateLimit: constraints.rateLimit || "",
    });
  }, [data]);

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const supportedTypes = useMemo(() => {
    if (!form) return [];
    const arr = [];
    if (form.typeTrial) arr.push("trial");
    if (form.typeSubscription) arr.push("subscription");
    if (form.typePerpetual) arr.push("perpetual");
    return arr;
  }, [form]);

  const toIntOrNull = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

  const onSave = async () => {
    if (!form) return;
    setSaving(true);
    setErr("");
    try {
      // payload ตาม ProductUpdate (คง path/เมธอดเดิม)
      const payload = {
        name: form.productName || undefined,
        sku: form.productCode || undefined,
        category: form.category || undefined,
        isActive: form.status === "active",
        description: form.description || undefined,
        meta: {
          version: form.version || undefined,
          licensePolicy: {
            supportedTypes,
            durationDays: toIntOrNull(form.licenseDuration),
          },
          constraints: {
            maxSeats: form.limitSeatsEnabled ? toIntOrNull(form.limitSeats) : null,
            maxDevice: form.limitDeviceEnabled ? toIntOrNull(form.limitDevice) : null,
            rateLimit: form.rateLimitEnabled ? (form.rateLimit || null) : null,
          },
        },
      };

      pruneEmpty(payload);

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const txt = await res.text();
      let body = null;
      try {
        body = txt ? JSON.parse(txt) : null;
      } catch {}

      if (!res.ok) {
        const msg = (body && body.detail) || txt || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      navigate(`/product-details/${id}`);
    } catch (e) {
      setErr(e?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div style={styles.root}>
        <Sidebar />
        <div style={styles.content}>
          <div style={styles.stage}>
            <div style={styles.topbarRow}>
              <div style={{ flex: 1 }}>
                <Topbar
                  placeholder="Search products"
                  onSearchChange={() => {}}
                  defaultFilter="all"
                  onViewAllPath="/Noti"
                />
              </div>
            </div>
            <div style={styles.title}>Products</div>
            <div style={{ color: THEME.text }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search products"
                onSearchChange={() => {}}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading & breadcrumb */}
          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>
              Product
            </span>
            &nbsp;&gt;&nbsp;
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product-details/${id}`)}
            >
              Product Detail
            </span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#1D4ED8", fontWeight: 700 }}>Edit Product</span>
          </div>

          {err ? <div style={styles.error}>Error: {err}</div> : null}

          {/* Card */}
          <div style={styles.card}>
            {/* Section: Product Information */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>Product Information</div>

              <div style={styles.grid3}>
                <div style={styles.field}>
                  <div style={styles.label}>Product Name</div>
                  <input
                    style={styles.input}
                    value={form.productName}
                    onChange={(e) => patch("productName", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.label}>Product Code (SKU)</div>
                  <input
                    style={styles.input}
                    value={form.productCode}
                    onChange={(e) => patch("productCode", e.target.value)}
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
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.label}>Version</div>
                  <input
                    style={styles.input}
                    value={form.version}
                    onChange={(e) => patch("version", e.target.value)}
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

            {/* Section: License Policy */}
            <div style={styles.section}>
              <div style={styles.sectionHead}>License Policy</div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: 16,
                  justifyContent: "start",
                  alignItems: "end",
                }}
              >
                <div>
                  <div style={styles.label}>Supported License Types</div>
                  <div style={{ ...styles.checksRow, marginTop: 8 }}>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typeTrial}
                        onChange={(e) => patch("typeTrial", e.target.checked)}
                      />{" "}
                      Trial
                    </label>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typeSubscription}
                        onChange={(e) => patch("typeSubscription", e.target.checked)}
                      />{" "}
                      Subscription
                    </label>
                    <label style={styles.check}>
                      <input
                        type="checkbox"
                        checked={form.typePerpetual}
                        onChange={(e) => patch("typePerpetual", e.target.checked)}
                      />{" "}
                      Perpetual
                    </label>
                  </div>
                </div>

                <div style={{ justifySelf: "start", width: 220 }}>
                  <div style={styles.label}>License Duration (days)</div>
                  <div style={{ ...styles.selectWrap, width: "100%" }}>
                    <select
                      style={styles.select}
                      value={form.licenseDuration}
                      onChange={(e) => patch("licenseDuration", e.target.value)}
                    >
                      <option value="">—</option>
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
                    <input
                      type="checkbox"
                      checked={form.limitSeatsEnabled}
                      onChange={(e) => patch("limitSeatsEnabled", e.target.checked)}
                    />{" "}
                    Max Seats
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    value={form.limitSeats}
                    onChange={(e) => patch("limitSeats", e.target.value)}
                    disabled={!form.limitSeatsEnabled}
                    placeholder="เว้นว่าง = ไม่จำกัด"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.limitDeviceEnabled}
                      onChange={(e) => patch("limitDeviceEnabled", e.target.checked)}
                    />{" "}
                    Max Device
                  </label>
                  <input
                    style={styles.input}
                    type="number"
                    value={form.limitDevice}
                    onChange={(e) => patch("limitDevice", e.target.value)}
                    disabled={!form.limitDeviceEnabled}
                    placeholder="เว้นว่าง = ไม่จำกัด"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.rateLimitEnabled}
                      onChange={(e) => patch("rateLimitEnabled", e.target.checked)}
                    />{" "}
                    Rate Limit
                  </label>
                  <input
                    style={styles.input}
                    value={form.rateLimit}
                    onChange={(e) => patch("rateLimit", e.target.value)}
                    disabled={!form.rateLimitEnabled}
                    placeholder='เช่น "100 req/day" หรือเว้นว่าง'
                  />
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={onSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Change"}
                </button>
                <button
                  style={styles.btnDangerGhost}
                  onClick={() => navigate(`/product-details/${id}`)}
                  disabled={saving}
                >
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

/* ---------- utils ---------- */
function pruneEmpty(obj) {
  if (obj == null || typeof obj !== "object") return;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && typeof v === "object") {
      pruneEmpty(v);
      if (Object.keys(v).length === 0) delete obj[k];
    } else if (v === undefined) {
      delete obj[k];
    }
  }
}
