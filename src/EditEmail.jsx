// src/pages/EditEmail.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "./config";

/* THEME — Light (ให้เหมือน CreateNewTemplate.jsx) */
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

/* STYLES — ยึดโครงจาก CreateNewTemplate.jsx */
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

  // status pill
  statusPill: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    background:
      status === "Active"
        ? "rgba(34,197,94,0.12)"
        : status === "Disabled"
        ? "rgba(239,68,68,0.08)"
        : "rgba(148,163,184,0.18)",
    color:
      status === "Active"
        ? "#15803D"
        : status === "Disabled"
        ? "#B91C1C"
        : "#475569",
    border:
      status === "Active"
        ? "1px solid rgba(34,197,94,0.4)"
        : status === "Disabled"
        ? "1px solid rgba(239,68,68,0.4)"
        : "1px solid rgba(148,163,184,0.5)",
  }),

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
  previewBody: {
    color: THEME.text,
    whiteSpace: "pre-wrap",
    fontSize: 13.5,
    lineHeight: 1.55,
  },

  // helper / dashed
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

  helperCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#F9FAFB",
    border: `1px dashed ${THEME.border}`,
    fontSize: 11,
    color: THEME.textFaint,
  },
  helperTag: {
    display: "inline-block",
    background: "#E5EDFF",
    color: THEME.text,
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    marginRight: 6,
    marginBottom: 4,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
  },

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
  btnDangerOutline: {
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: THEME.card,
    color: THEME.dangerText,
    boxShadow: "0 4px 10px rgba(0,0,0,.04)",
    fontSize: 13,
  },
  btnLink: {
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    fontSize: 12,
    color: THEME.accent,
    fontWeight: 700,
    textDecoration: "underline",
  },

  // util
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
  success: {
    color: THEME.goodText,
    background: THEME.goodBg,
    borderRadius: 8,
    padding: "6px 8px",
    marginTop: 6,
    fontSize: 12,
  },
  hr: { border: "none", height: 1, background: "rgba(0,0,0,0.06)", margin: "14px 0" },
};

const INIT = { slug: "", name: "", subject: "", body: "", status: "Active", is_html: true };

// helper สำหรับ client dropdown
function normalizeClientOption(c) {
  const fn = c.firstName ?? c.first_name ?? "";
  const ln = c.lastName ?? c.last_name ?? "";
  const name = (fn || ln) ? `${fn} ${ln}`.trim() : (c.name || "-");
  return {
    id: String(c.id),
    name,
    email: c.email || "",
  };
}

export default function EditEmail() {
  const navigate = useNavigate();
  const { templateId } = useParams();

  const [form, setForm] = useState(INIT);
  const [preview, setPreview] = useState({ subject: "", body: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Advanced panel (ซ่อนไว้ให้ทีม Dev)
  const [showAdvanced, setShowAdvanced] = useState(false);

  // real preview variables
  const [clientQuery, setClientQuery] = useState("");
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [includePlainPassword, setIncludePlainPassword] = useState(false);
  const [loadedClient, setLoadedClient] = useState(null);
  const [loadedLicense, setLoadedLicense] = useState(null);

  // test email (แก้เป็น dropdown client)
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsErr, setClientsErr] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState("");

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

  // load template
  useEffect(() => {
    if (!templateId) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const r = await fetch(`${API_BASE}/email-templates/${templateId}`, { signal: ctrl.signal });
        if (!r.ok) throw new Error(await r.text());
        const data = await r.json();
        setForm({
          slug: data.slug || "",
          name: data.name || "",
          subject: data.subject || "",
          body: data.body || "",
          status: data.status || "Draft",
          is_html: !!data.is_html,
        });
      } catch (e) {
        if (e.name !== "AbortError") setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [templateId]);

  // load clients สำหรับ dropdown test email
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setClientsLoading(true);
        setClientsErr("");
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/clients`, {
          headers,
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data) ? data.map(normalizeClientOption) : [];
        setClients(list);
      } catch (e) {
        if (e.name !== "AbortError") {
          setClientsErr(e?.message || "Failed to load clients for test email");
          setClients([]);
        }
      } finally {
        setClientsLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // build variables for preview
  const buildPreviewVars = useCallback(() => {
    if (loadedClient || loadedLicense) {
      const client = loadedClient || {};
      const license = loadedLicense || {};
      return {
        client: {
          first_name: client.first_name || client.firstName || client.name || "",
          last_name: client.last_name || client.lastName || "",
          email: client.email || "",
          company: client.company || client.org || "",
          country: client.country || "",
          username: client.username || client.user_name || client.email || "",
          plain_password: includePlainPassword
            ? client.plain_password || client.password_plain || "(not provided)"
            : "(hidden)",
        },
        license: {
          license_key: license.license_key || license.key || license.licenseKey || "",
          term: license.term || license.duration || "",
          product_sku: license.product_sku || license.productSku || "",
          expires_at: license.expires_at || license.expiresAt || license.expires || "",
          issued_at: license.issued_at || license.issuedAt || license.issued || "",
          max_activations: license.max_activations || license.maxActivations || 0,
          activations_used: license.activations_used || license.activationsUsed || 0,
          status: license.status || "",
        },
        meta: { app_name: "SmartAudit", portal_url: window.location.origin },
      };
    }
    return previewVars;
  }, [loadedClient, loadedLicense, includePlainPassword, previewVars]);

  // live preview (debounce)
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const vars = buildPreviewVars();
        const r = await fetch(`${API_BASE}/email-templates/render/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({ subject: form.subject, body: form.body, variables: vars }),
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
  }, [form.subject, form.body, buildPreviewVars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      const r = await fetch(`${API_BASE}/email-templates/${templateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          subject: form.subject,
          body: form.body,
          status: form.status,
          is_html: form.is_html,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      window.alert("บันทึกเทมเพลตเรียบร้อย");
      navigate("/email-template");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!templateId) return;
    if (!window.confirm(`ต้องการลบเทมเพลต "${form.name || form.slug}" ใช่หรือไม่?`)) return;

    setDeleting(true);
    setErr("");
    try {
      const r = await fetch(`${API_BASE}/email-templates/${templateId}`, { method: "DELETE" });
      if (!r.ok && r.status !== 204) {
        let msg = "";
        try {
          msg = await r.text();
        } catch {}
        throw new Error(msg || `Delete failed with status ${r.status}`);
      }
      window.alert("ลบเทมเพลตเรียบร้อย");
      navigate("/email-template");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setDeleting(false);
    }
  };

  // load client & latest license (Advanced)
  const handleLoadClient = async () => {
    if (!clientQuery) {
      setClientError("กรุณากรอก Client ID หรืออีเมล");
      return;
    }
    setClientError("");
    setClientLoading(true);
    setLoadedClient(null);
    setLoadedLicense(null);

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      let clientData = null;

      // by ID
      try {
        const r1 = await fetch(`${API_BASE}/clients/${encodeURIComponent(clientQuery)}`, {
          headers,
        });
        if (r1.ok) clientData = await r1.json();
      } catch {}

      // fallback by email
      if (!clientData) {
        const r2 = await fetch(
          `${API_BASE}/clients?email=${encodeURIComponent(clientQuery)}`,
          { headers }
        );
        if (r2.ok) {
          const list = await r2.json();
          clientData = Array.isArray(list) && list.length ? list[0] : null;
        }
      }

      if (!clientData) {
        setClientError("ไม่พบ client (ตรวจสอบ ID/อีเมล และสิทธิ์การเข้าถึง API)");
        setClientLoading(false);
        return;
      }

      setLoadedClient(clientData);

      // load username if exists
      try {
        const rCred = await fetch(
          `${API_BASE}/clients/${encodeURIComponent(clientData.id)}/credentials`,
          { headers }
        );
        if (rCred.ok) {
          const cred = await rCred.json();
          setLoadedClient((prev) => ({ ...prev, username: cred.username }));
        }
      } catch {}

      // latest license
      let licenseData = null;
      try {
        const rL = await fetch(
          `${API_BASE}/licenses?client_id=${encodeURIComponent(
            clientData.id
          )}&limit=1&sort=issued_at:desc`,
          { headers }
        );
        if (rL.ok) {
          const list = await rL.json();
          licenseData = Array.isArray(list) ? list[0] || null : list;
        }
      } catch {}

      if (!licenseData) {
        try {
          const rL2 = await fetch(
            `${API_BASE}/clients/${encodeURIComponent(clientData.id)}/licenses?limit=1`,
            { headers }
          );
          if (rL2.ok) {
            const list2 = await rL2.json();
            licenseData = Array.isArray(list2) ? list2[0] || null : list2;
          }
        } catch {}
      }

      setLoadedLicense(licenseData || null);
    } catch (e) {
      setClientError(String(e?.message || e));
    } finally {
      setClientLoading(false);
    }
  };

  const handleLoadUsername = async () => {
    if (!loadedClient?.id) return;
    try {
      const r = await fetch(
        `${API_BASE}/clients/${encodeURIComponent(loadedClient.id)}/credentials`
      );
      if (!r.ok) throw new Error(await r.text());
      const cred = await r.json();
      setLoadedClient((prev) => ({ ...prev, username: cred.username }));
      window.alert(`ดึง Username สำเร็จ: ${cred.username}`);
    } catch (e) {
      window.alert(String(e?.message || e));
    }
  };

  // Generate temporary password & send by email
  const handleGenerateTempPasswordAndSend = async () => {
    if (!loadedClient?.id) return;
    if (!loadedClient?.email) return window.alert("Client นี้ไม่มีอีเมลสำหรับส่งรหัสผ่าน");
    if (!window.confirm("ต้องการสร้างรหัสผ่านชั่วคราวและส่งให้ลูกค้าทางอีเมลหรือไม่?")) return;

    try {
      const payload = {
        length: 12,
        send_email: true,
        email_to: loadedClient.email,
        notify_subject: `Your ${window.location.hostname} account password`,
        notify_body_text:
          `Hello ${loadedClient.first_name || ""},\n\n` +
          `A temporary password has been generated for your account.\n\n` +
          `Username: {{username}}\n` +
          `Temporary password: {{password}}\n\n` +
          `Please log in and change your password immediately.\n`,
      };

      const r = await fetch(
        `${API_BASE}/clients/${encodeURIComponent(loadedClient.id)}/credentials/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!r.ok) throw new Error((await r.text()) || `Request failed: ${r.status}`);

      const data = await r.json();
      setLoadedClient((prev) => ({
        ...prev,
        plain_password: data.temporary_password,
        username: data.username,
      }));
      setIncludePlainPassword(true);
      window.alert(`สร้างรหัสผ่านชั่วคราวและส่งไปที่ ${loadedClient.email} แล้ว`);
    } catch (e) {
      window.alert(String(e?.message || e));
    }
  };

  const mask = (s) => {
    if (!s) return "";
    return s.length <= 2
      ? "*".repeat(s.length)
      : `${s[0]}${"*".repeat(Math.max(0, s.length - 2))}${s.slice(-1)}`;
  };

  const PreviewBody = () => {
    if (form.is_html) {
      return (
        <div
          style={styles.previewBody}
          dangerouslySetInnerHTML={{
            __html: preview.body || "(preview body)",
          }}
        />
      );
    }
    return <div style={styles.previewBody}>{preview.body || "(preview body)"}</div>;
  };

  const handleSendTestEmail = async () => {
  setTestResult("");
  if (!selectedClientId) {
    setTestResult("กรุณาเลือก Client ที่จะใช้ส่ง Email");
    return;
  }
  const client = clients.find((c) => c.id === selectedClientId);
  if (!client) {
    setTestResult("ไม่พบข้อมูล Client ที่เลือก");
    return;
  }
  if (!client.email) {
    setTestResult("Client นี้ไม่มีอีเมล");
    return;
  }

  setSendingTest(true);
  try {
    const vars = buildPreviewVars();

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const r = await fetch(`${API_BASE}/email-templates/${templateId}/send-test`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        to: client.email,
        variables: vars,
      }),
    });

    if (!r.ok) {
      // ลองอ่าน error message จาก backend
      const txt = await r.text();
      throw new Error(txt || `HTTP ${r.status}`);
    }

    setTestResult(`✅ ส่ง Email ไปที่ ${client.email} สำเร็จ!`);
  } catch (e) {
    console.error("send-test error:", e);
    setTestResult(
      `❌ ส่งไม่สำเร็จ: ${e?.message || "กรุณาตรวจสอบการตั้งค่า SMTP / API"}`
    );
  } finally {
    setSendingTest(false);
  }
};


  if (loading) {
    return (
      <div
        style={{ ...styles.root, alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ color: THEME.textFaint, fontWeight: 700 }}>Loading…</div>
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
              <div style={styles.title}>Edit email template</div>
            </div>
            <div>
              <div style={styles.statusPill(form.status)}>
                {form.status || "Draft"}
              </div>
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
            &nbsp;&gt;&nbsp;<span style={{ color: THEME.accent }}>Edit template</span>
          </div>

          <div style={styles.formContainer}>
            {/* Left: Form */}
            <div style={styles.formSection}>
              <div style={styles.formCard}>
                {err && <div style={styles.err}>{err}</div>}

                {/* Section 1: Template details */}
                <div style={styles.sectionTitle}>1. Template details</div>

                <div style={styles.dashed}>
                  <div style={styles.dashedTitle}>Automatic email to customers</div>
                </div>

                {/* Row: name + slug (slug readonly) */}
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.labelRow}>
                      <div style={styles.label}>Template name</div>
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
                    <input
                      name="slug"
                      value={form.slug}
                      readOnly
                      style={{ ...styles.input, opacity: 0.6, cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginTop: 16 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>Subject</div>
                  </div>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="[{{meta.app_name}}] Your account & license"
                    style={styles.input}
                  />
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

                {/* Section 2: Body */}
                <hr style={styles.hr} />
                <div style={styles.sectionTitle}>2. Email content</div>

                {/* HTML toggle */}
                <div
                  style={{
                    marginTop: 4,
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
                </div>

                {/* Body */}
                <div style={{ marginTop: 12 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>Body</div>
                  </div>
                  <textarea
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="เนื้อหาอีเมล... สามารถใส่ HTML หรือข้อความปกติได้"
                  />
                </div>

                {/* Helper variables */}
                <div style={styles.helperCard}>
                  <div>
                    <span style={styles.helperTag}>{"{{ client.first_name }}"}</span>
                    <span style={styles.helperTag}>{"{{ client.email }}"}</span>
                    <span style={styles.helperTag}>{"{{ license.license_key }}"}</span>
                    <span style={styles.helperTag}>{"{{ license.expires_at }}"}</span>
                    <span style={styles.helperTag}>{"{{ meta.app_name }}"}</span>
                  </div>
                </div>

                {/* Section 3: Test email */}
                <hr style={styles.hr} />
                <div style={styles.sectionTitle}>3. Send email</div>

                {/* dropdown เลือก client */}
                <div style={{ marginBottom: 6 }}>
                  <div style={styles.labelRow}>
                    <div style={styles.label}>เลือก Client เพื่อส่ง Email</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      style={{ ...styles.input, flex: 1 }}
                    >
                      <option value="">
                        {clientsLoading
                          ? "กำลังโหลดรายชื่อ Client..."
                          : "เลือก Client"}
                      </option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>

                      ))}
                    </select>
                    <button
                      onClick={handleSendTestEmail}
                      disabled={sendingTest || clientsLoading}
                      style={styles.btnPrimary}
                    >
                      {sendingTest ? "กำลังส่ง…" : "ส่ง Email"}
                    </button>
                  </div>
                  {clientsErr && (
                    <div style={{ ...styles.err, marginTop: 6 }}>{clientsErr}</div>
                  )}
                </div>

                {testResult && (
                  <div
                    style={
                      testResult.startsWith("✅")
                        ? styles.success
                        : { ...styles.err, marginTop: 4 }
                    }
                  >
                    {testResult}
                  </div>
                )}

                {/* Advanced panel */}
                <hr style={styles.hr} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <button
                    type="button"
                    style={styles.btnLink}
                    onClick={() => setShowAdvanced((s) => !s)}
                  >
                    {showAdvanced ? "ซ่อนโหมด Advanced" : "แสดงโหมด Advanced"}
                  </button>
                </div>

                {showAdvanced && (
                  <>
                    {/* Client loader */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <input
                        placeholder="Client ID หรืออีเมล (สำหรับ real preview)"
                        value={clientQuery}
                        onChange={(e) => setClientQuery(e.target.value)}
                        style={{ ...styles.input, flex: 1 }}
                      />
                      <button
                        onClick={handleLoadClient}
                        disabled={clientLoading}
                        style={styles.btnGhost}
                      >
                        {clientLoading ? "Loading…" : "Load client"}
                      </button>
                      <label
                        htmlFor="includePwd"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: THEME.textMut,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        <input
                          id="includePwd"
                          type="checkbox"
                          checked={includePlainPassword}
                          onChange={(e) => setIncludePlainPassword(e.target.checked)}
                        />
                      </label>
                    </div>
                    {clientError && (
                      <div
                        style={{
                          ...styles.err,
                          background: THEME.dangerBg,
                          color: THEME.dangerText,
                          marginTop: 8,
                        }}
                      >
                        {clientError}
                      </div>
                    )}

                    {/* Loaded client */}
                    {loadedClient && (
                      <div style={{ ...styles.dashed, marginTop: 10 }}>
                        <div
                          style={{ color: THEME.text, fontWeight: 900, marginBottom: 4 }}
                        >
                          Loaded client
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Name: {loadedClient.first_name || loadedClient.name || "(n/a)"}
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Email: {loadedClient.email || "(n/a)"}
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Username: {loadedClient.username || "(n/a)"}
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Password:{" "}
                          {includePlainPassword
                            ? loadedClient.plain_password ||
                              loadedClient.password ||
                              "(not provided)"
                            : mask(
                                loadedClient.plain_password || loadedClient.password || ""
                              )}
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <button onClick={handleLoadUsername} style={styles.btnGhost}>
                            Load Username
                          </button>
                          <button
                            onClick={handleGenerateTempPasswordAndSend}
                            style={styles.btnPrimary}
                            title="Generate & send temporary password"
                          >
                            Generate & Send password
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Loaded license */}
                    {loadedLicense && (
                      <div style={{ ...styles.dashed, marginTop: 10 }}>
                        <div
                          style={{ color: THEME.text, fontWeight: 900, marginBottom: 4 }}
                        >
                          Loaded license
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Key:{" "}
                          {loadedLicense.license_key ||
                            loadedLicense.key ||
                            "(n/a)"}
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Product:{" "}
                          {loadedLicense.product_sku ||
                            loadedLicense.product ||
                            "(n/a)"}
                        </div>
                        <div style={{ color: THEME.textMut, fontSize: 13 }}>
                          Expires:{" "}
                          {loadedLicense.expires_at ||
                            loadedLicense.expires ||
                            "(n/a)"}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <button
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    style={styles.btnDangerOutline}
                    title="Delete this template"
                  >
                    {deleting ? "กำลังลบ…" : "ลบเทมเพลตนี้"}
                  </button>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      style={styles.btnGhost}
                      onClick={() => navigate("/email-template")}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      style={styles.btnPrimary}
                      disabled={saving || deleting}
                      onClick={handleSave}
                    >
                      {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                  </div>
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
