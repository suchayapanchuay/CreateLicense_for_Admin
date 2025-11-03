// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config"; // หรือ ../app/config ตามโปรเจกต์ของคุณ

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
  danger: "#DC2626",
};

const styles = {
  root: {
    display: "flex",
    minHeight: "1024px",
    background: THEME.pageBg,
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
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
  inputRead: { opacity: 1, pointerEvents: "none", background: "#FFFFFF" },

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
  selectRead: { pointerEvents: "none", opacity: 1 },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

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
  btnDanger: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    background: THEME.danger,
    color: "#fff",
    boxShadow: "0 4px 10px rgba(220,38,38,.18)",
  },
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // /product-details/:id
  const onSearchNoop = () => {};

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);

      const base = (API_BASE || "").replace(/\/$/, "");
      const endpoints = [
        `${base}/api/products/${id}`,
        `http://127.0.0.1:8000/api/products/${id}`,
      ].filter(Boolean);

      try {
        let lastErr = null;
        for (const url of endpoints) {
          try {
            const res = await fetch(url);
            const text = await res.text();
            const isMaybeHtml = /^\s*</.test(text);
            if (!res.ok) {
              if (!isMaybeHtml) {
                try {
                  const j = JSON.parse(text);
                  throw new Error(j?.detail || `HTTP ${res.status}`);
                } catch {
                  throw new Error(text || `HTTP ${res.status}`);
                }
              } else {
                throw new Error("Not Found (frontend dev server) — เช็ค API_BASE หรือ proxy");
              }
            }
            const json = isMaybeHtml ? null : (text ? JSON.parse(text) : {});
            if (alive) setData(json);
            lastErr = null;
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (lastErr) throw lastErr;
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [id]);

  const onDelete = async () => {
    if (!id) return;
    const ok = window.confirm("ต้องการลบสินค้านี้หรือไม่? การลบไม่สามารถย้อนกลับได้");
    if (!ok) return;

    setDeleting(true);
    setErr(null);
    try {
      const base = (API_BASE || "").replace(/\/$/, "");
      const endpoints = [
        `${base}/api/products/${id}`,
        `http://127.0.0.1:8000/api/products/${id}`,
      ];
      let lastErr = null;

      for (const url of endpoints) {
        try {
          const res = await fetch(url, { method: "DELETE" });
          if (res.status === 204) {
            navigate("/product"); // กลับหน้า list
            return;
          }
          const txt = await res.text();
          let detail = null;
          try { detail = txt ? JSON.parse(txt) : null; } catch {}
          throw new Error((detail && detail.detail) || txt || `HTTP ${res.status}`);
        } catch (e) {
          lastErr = e;
        }
      }
      if (lastErr) throw lastErr;
    } catch (e) {
      setErr(e?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const form = useMemo(() => {
    if (!data) return null;
    const meta = data.meta || {};
    const licensePolicy = meta.licensePolicy || {};
    const constraints = meta.constraints || {};
    const supported = new Set(licensePolicy.supportedTypes || []);
    return {
      productName: data.name || "",
      productCode: data.sku || "",
      status: data.isActive ? "active" : "inactive",
      description: data.description || "",
      version: meta.version || "",
      category: data.category || "Accounting Software",
      typeTrial: supported.has("trial"),
      typeSubscription: supported.has("subscription"),
      typePerpetual: supported.has("perpetual"),
      licenseDuration: String(licensePolicy.durationDays ?? ""),
      limitSeatsEnabled: constraints.maxSeats != null,
      limitSeats: constraints.maxSeats != null ? String(constraints.maxSeats) : "",
      limitDeviceEnabled: constraints.maxDevice != null,
      limitDevice: constraints.maxDevice != null ? String(constraints.maxDevice) : "",
      rateLimitEnabled: constraints.rateLimit != null && constraints.rateLimit !== "",
      rateLimit: constraints.rateLimit || "",
    };
  }, [data]);

  if (loading) {
    return (
      <div style={styles.root}>
        <Sidebar />
        <div style={styles.content}>
          <div style={styles.stage}>
            <div style={styles.topbarRow}>
              <div style={{ flex: 1 }}>
                <Topbar placeholder="Search products" onSearchChange={onSearchNoop} defaultFilter="all" onViewAllPath="/Noti" />
              </div>
            </div>
            <div style={{ color: THEME.text, opacity: 0.9 }}>Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={styles.root}>
        <Sidebar />
        <div style={styles.content}>
          <div style={styles.stage}>
            <div style={styles.topbarRow}>
              <div style={{ flex: 1 }}>
                <Topbar placeholder="Search products" onSearchChange={onSearchNoop} defaultFilter="all" onViewAllPath="/Noti" />
              </div>
            </div>
            <div style={{ color: "#DC2626", fontWeight: 700, marginBottom: 8 }}>Error: {err}</div>
            <button style={styles.btnPrimary} onClick={() => navigate("/product")}>Back to Products</button>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar placeholder="Search products" onSearchChange={onSearchNoop} defaultFilter="all" onViewAllPath="/Noti" />
            </div>
          </div>

          <div style={styles.title}>Products</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/product")}>Product</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#1D4ED8", fontWeight: 700 }}>Product Detail</span>
          </div>

          <div style={styles.card}>
            {/* Product Information */}
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

            {/* License Policy */}
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

            {/* Constraints */}
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
                <button
                  style={styles.btnPrimary}
                  onClick={() => navigate(`/products/edit/${id}`)}
                >
                  Edit Product
                </button>
                <button
                  style={styles.btnDanger}
                  onClick={onDelete}
                  disabled={deleting}
                  title="Delete this product"
                >
                  {deleting ? "Deleting..." : "Delete"}
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
