// src/pages/CreateNewTemplate.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./config";

/* THEME — Light (เหมือน EditEmail.jsx) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.10)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  goodText: "#065F46",
  goodBg: "#DCFCE7",
  warnText: "#92400E",
  warnBg: "#FEF3C7",
  dangerText: "#991B1B",
  dangerBg: "#FEE2E2",
};

/* STYLES */
const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "24px 32px",
  },
  stage: {
    width: "100%",
    maxWidth: 1180,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
  },

  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 6,
    marginBottom: 6,
  },
  titleBlock: { display: "flex", flexDirection: "column", gap: 4 },
  title: { fontSize: 32, fontWeight: 900, color: THEME.text },
  subtitle: { fontSize: 14, color: THEME.textFaint, maxWidth: 520 },

  breadcrumb: {
    color: THEME.textFaint,
    fontWeight: 600,
    marginTop: 4,
    marginBottom: 18,
    fontSize: 13,
  },

  // layout
  formContainer: {
    display: "flex",
    gap: 24,
    marginTop: 12,
    alignItems: "stretch",
  },

  formSection: { flex: 1, display: "flex", flexDirection: "column", gap: 16 },
  formCard: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.04,
    color: THEME.textFaint,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: THEME.textFaint,
    marginBottom: 10,
  },

  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 800 },
  labelRequired: { color: "#DC2626", fontSize: 12, fontWeight: 800 },

  input: {
    width: "100%",
    background: THEME.card,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    background: THEME.card,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    minHeight: 200,
    resize: "vertical",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
    fontSize: 14,
  },

  radioGroup: {
    display: "flex",
    gap: 18,
    alignItems: "center",
    marginTop: 2,
    color: THEME.text,
    flexWrap: "wrap",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    color: THEME.text,
    fontSize: 13,
  },

  smallMuted: { color: THEME.textFaint, fontSize: 12, marginTop: 6 },

  // preview
  previewSection: {
    flexBasis: "40%",
    maxWidth: 420,
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
    display: "flex",
    flexDirection: "column",
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewTitle: { color: THEME.text, fontSize: 14, fontWeight: 800 },
  previewBadge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    background: "#EEF2FF",
    color: THEME.accent,
    fontWeight: 700,
  },
  previewSubject: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 8,
  },
  previewBodyWrapper: {
    borderTop: `1px solid ${THEME.border}`,
    paddingTop: 10,
    marginTop: 4,
    flex: 1,
    overflow: "auto",
  },
  previewBody: { color: THEME.text, whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.55 },

  // buttons
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  btnPrimary: {
    borderRadius: 10,
    padding: "10px 16px",
    fontWeight: 900,
    cursor: "pointer",
    border: "none",
    background: THEME.accent,
    color: "#fff",
    boxShadow: "0 6px 14px rgba(37,99,235,.25)",
    fontSize: 14,
  },
  btnGhost: {
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: THEME.card,
    color: THEME.text,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)",
    fontSize: 14,
  },

  // util
  dashed: {
    border: `1px dashed ${THEME.border}`,
    borderRadius: 12,
    padding: 10,
    background: "#FAFBFF",
    marginBottom: 12,
  },
  dashedTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: THEME.text,
    marginBottom: 4,
  },
  err: {
    color: THEME.dangerText,
    fontWeight: 900,
    marginBottom: 10,
    background: THEME.dangerBg,
    border: `1px solid ${THEME.border}`,
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 13,
  },

  variableTags: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  tag: {
    background: "#FAFBFF",
    border: `1px solid ${THEME.border}`,
    color: THEME.text,
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },
};

const EMPTY_FORM = { slug: "", name: "", subject: "", body: "", status: "Active", is_html: true };

export default function CreateNewTemplate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [varsList, setVarsList] = useState({ client: [], license: [], meta: [] });
  const [preview, setPreview] = useState({ subject: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const bodyRef = useRef(null);

  // ค่า preview เริ่มต้น
  const previewVars = useMemo(
    () => ({
      client: {
        first_name: "Suchaya",
        last_name: "Panchuay",
        email: "user@example.com",
        username: "suchaya",
        plain_password: "(hidden)",
      },
      license: {
        license_key: "AAAAA-BBBBB-CCCCC-DDDDD",
        term: "trial",
        product_sku: "SMART_AUDIT_TRIAL",
        expires_at: "2025-12-31T15:00:00",
      },
      meta: { app_name: "SmartAudit", portal_url: window.location.origin },
    }),
    []
  );

  // โหลดรายการตัวแปรจาก API
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/email-templates/variables/list`, { signal: ctrl.signal });
        if (r.ok) {
          const data = await r.json();
          setVarsList({
            client: Array.isArray(data?.client) ? data.client : [],
            license: Array.isArray(data?.license) ? data.license : [],
            meta: Array.isArray(data?.meta) ? data.meta : [],
          });
        }
      } catch {
        /* ignore */
      }
    })();
    return () => ctrl.abort();
  }, []);

  // Live preview (debounce)
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`${API_BASE}/email-templates/render/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({ subject: form.subject, body: form.body, variables: previewVars }),
        });
        if (r.ok) setPreview(await r.json());
      } catch {
        /* ignore */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [form.subject, form.body, previewVars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // แทรกแท็กตัวแปร ณ caret ใน textarea
  const handleInsert = (tag) => {
    const inserted = `{{${tag}}}`;
    setForm((f) => {
      const ta = bodyRef.current;
      if (!ta) {
        return {
          ...f,
          body: `${f.body}${f.body && !f.body.endsWith("\n") ? "\n" : ""}${inserted}`,
        };
      }
      const start = ta.selectionStart ?? f.body.length;
      const end = ta.selectionEnd ?? f.body.length;
      const before = f.body.slice(0, start);
      const after = f.body.slice(end);
      const newVal = before + inserted + after;
      requestAnimationFrame(() => {
        const pos = start + inserted.length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      });
      return { ...f, body: newVal };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      if (!form.slug || !form.name || !form.subject) {
        throw new Error("Please fill in Template name, Slug, and Subject.");
      }
      const r = await fetch(`${API_BASE}/email-templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error(await r.text());
      window.alert("Template created.");
      navigate("/email-template");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const PreviewBody = () => {
    if (form.is_html) {
      return (
        <div
          style={styles.previewBody}
          dangerouslySetInnerHTML={{ __html: preview.body || "(preview body)" }}
        />
      );
    }
    return <div style={styles.previewBody}>{preview.body || "(preview body)"}</div>;
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search notification & templates"
                onSearchChange={() => {}}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Header */}
          <div style={styles.headerRow}>
            <div style={styles.titleBlock}>
              <div style={styles.title}>Create email template</div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "default" }}>Settings</span>
            &nbsp;&gt;&nbsp;
            <span
              style={{ cursor: "pointer", color: THEME.accent }}
              onClick={() => navigate("/email-template")}
            >
              Email templates
            </span>
            &nbsp;&gt;&nbsp;<span style={{ color: THEME.accent }}>Create new template</span>
          </div>

          <div style={styles.formContainer}>
            {/* Left: Form */}
            <div style={styles.formSection}>
              <div style={styles.formCard}>
                {err && <div style={styles.err}>{err}</div>}

                <div style={styles.sectionTitle}>1. Template details</div>

                <div style={styles.dashed}>
                  <div style={styles.dashedTitle}>Automatic email to customers</div>
                </div>

                {/* Row: Template name + Slug */}
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.labelRow}>
                      <div style={styles.label}>Template name</div>
                      <span style={styles.labelRequired}>*</span>
                    </div>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Welcome / Credentials + License"
                      style={styles.input}
                    />
                    <div style={styles.smallMuted}>
                      <span style={{ fontStyle: "italic" }}>"Welcome email"</span>
                    </div>
                  </div>

                  <div style={{ width: "38%" }}>
                    <div style={styles.labelRow}>
                      <div style={styles.label}>Slug</div>
                      <span style={styles.labelRequired}>*</span>
                    </div>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="welcome"
                      style={styles.input}
                    />

                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginTop: 16 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>Subject</div>
                    <span style={styles.labelRequired}>*</span>
                  </div>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="[{{meta.app_name}}] Your account & license"
                    style={styles.input}
                  />
                  <div style={styles.smallMuted}>
                    หัวข้ออีเมลที่ลูกค้าจะเห็นในกล่องจดหมาย รองรับตัวแปร เช่น{" "}
                    {"{{meta.app_name}}"}
                  </div>
                </div>

                {/* Status */}
                <div style={{ marginTop: 18 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>Status</div>
                  </div>
                  <div style={styles.radioGroup}>
                    {["Active", "Draft", "Disabled"].map((s) => (
                      <label key={s} style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={form.status === s}
                          onChange={handleChange}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                {/* HTML toggle */}
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: THEME.text,
                  }}
                >
                  <input
                    id="is_html"
                    type="checkbox"
                    name="is_html"
                    checked={form.is_html}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_html" style={{ fontSize: 13 }}>
                    Send as HTML
                  </label>
                </div>

                {/* Body */}
                <div style={{ marginTop: 20 }}>
                  <div style={styles.sectionTitle}>2. Email content</div>

                  <div style={styles.labelRow}>
                    <div style={styles.label}>Body</div>
                  </div>
                  <textarea
                    ref={bodyRef}
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="HTML or Text. Use {{client.first_name}} etc."
                  />
                </div>

                {/* Variables */}
                <div style={{ marginTop: 16 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>Variables</div>
                  </div>
                  <div style={styles.variableTags}>
                    {["client", "license", "meta"].flatMap((ns) =>
                      (varsList[ns] || []).map((key) => (
                        <div
                          key={`${ns}.${key}`}
                          style={styles.tag}
                          onClick={() => handleInsert(`${ns}.${key}`)}
                          title="Click to insert"
                        >
                          {`{{${ns}.${key}}}`}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.btnRow}>
                  <button
                    style={styles.btnGhost}
                    onClick={() => navigate("/email-template")}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button style={styles.btnPrimary} disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save template"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div style={styles.previewSection}>
              <div style={styles.previewHeader}>
                <div style={styles.previewTitle}>Live preview</div>
                <div style={styles.previewBadge}>Auto-updated</div>
              </div>

              <div style={styles.previewSubject}>
                {preview.subject || "(preview subject)"}
              </div>

              <div style={styles.previewBodyWrapper}>
                <PreviewBody />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
