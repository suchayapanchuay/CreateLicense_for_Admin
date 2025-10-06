import React, { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "./config";

const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  accent: "#3B82F6",
};

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },
  formContainer: { display: "flex", gap: 24, marginTop: 20 },
  formSection: { flex: 1, display: "flex", flexDirection: "column", gap: 16 },
  formCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: { width: "90%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none" },
  textarea: { width: "95%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none", minHeight: 150, resize: "vertical" },
  radioLabel: { display: "flex", alignItems: "center", gap: 8, color: THEME.text, fontWeight: 600, cursor: "pointer" },
  radioInput: { appearance: "none", width: 16, height: 16, borderRadius: "50%", border: `2px solid ${THEME.border}`, position: "relative", outline: "none", cursor: "pointer", flexShrink: 0 },
  previewSection: { flex: 1, background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 24 },
  previewTitle: { color: THEME.text, fontSize: 18, fontWeight: 700, marginBottom: 12 },
  previewBody: { color: THEME.text, whiteSpace: "pre-wrap" },
  smallMuted: { color: THEME.textMut, fontSize: 12, marginTop: 6 },
};

const INIT = { slug: "", name: "", subject: "", body: "", status: "Active", is_html: true };

export default function EditEmail() {
  const navigate = useNavigate();
  const { templateId } = useParams();

  const [form, setForm] = useState(INIT);
  const [preview, setPreview] = useState({ subject: "", body: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // client/license for real preview
  const [clientQuery, setClientQuery] = useState(""); // client ID or email
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [includePlainPassword, setIncludePlainPassword] = useState(false);
  const [loadedClient, setLoadedClient] = useState(null);
  const [loadedLicense, setLoadedLicense] = useState(null);

  const previewVars = useMemo(
    () => ({
      client: { first_name: "Suchaya", last_name: "Panchuay", email: "user@example.com", username: "suchaya", plain_password: "(hidden)" },
      license: { license_key: "AAAAA-BBBBB-CCCCC-DDDDD", term: "trial", product_sku: "SMART_AUDIT_TRIAL", expires_at: "2025-12-31T15:00:00" },
      meta: { app_name: "SmartAudit", portal_url: "http://localhost:3000" },
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

  // build variables for preview (stable)
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
            ? (client.plain_password || client.password_plain || "(not provided)")
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

  // live preview (debounced)
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
      window.alert("Template updated.");
      navigate("/email-template");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!templateId) return;
    if (!window.confirm(`Delete template "${form.name || form.slug}" ?`)) return;

    setDeleting(true);
    setErr("");
    try {
      const r = await fetch(`${API_BASE}/email-templates/${templateId}`, { method: "DELETE" });
      if (!r.ok && r.status !== 204) {
        let msg = "";
        try { msg = await r.text(); } catch {}
        throw new Error(msg || `Delete failed with status ${r.status}`);
      }
      window.alert("Template deleted.");
      navigate("/email-template");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setDeleting(false);
    }
  };

  // load client & latest license
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

      // try by ID
      try {
        const r1 = await fetch(`${API_BASE}/clients/${encodeURIComponent(clientQuery)}`, { headers });
        if (r1.ok) clientData = await r1.json();
      } catch {}

      // fallback by email
      if (!clientData) {
        const r2 = await fetch(`${API_BASE}/clients?email=${encodeURIComponent(clientQuery)}`, { headers });
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

      // 🔹 โหลด username อัตโนมัติ (ถ้ามี)
      try {
        const rCred = await fetch(`${API_BASE}/clients/${encodeURIComponent(clientData.id)}/credentials`, { headers });
        if (rCred.ok) {
          const cred = await rCred.json(); // {client_id, username, created_at}
          setLoadedClient((prev) => ({ ...prev, username: cred.username }));
        }
      } catch {}

      // latest license
      let licenseData = null;
      try {
        const rL = await fetch(
          `${API_BASE}/licenses?client_id=${encodeURIComponent(clientData.id)}&limit=1&sort=issued_at:desc`,
          { headers }
        );
        if (rL.ok) {
          const list = await rL.json();
          licenseData = Array.isArray(list) ? (list[0] || null) : list;
        }
      } catch {}

      if (!licenseData) {
        try {
          const rL2 = await fetch(`${API_BASE}/clients/${encodeURIComponent(clientData.id)}/licenses?limit=1`, { headers });
          if (rL2.ok) {
            const list2 = await rL2.json();
            licenseData = Array.isArray(list2) ? (list2[0] || null) : list2;
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

  // extra actions: load username (manual) & generate temp password and send email to user
  const handleLoadUsername = async () => {
    if (!loadedClient?.id) return;
    try {
      const r = await fetch(`${API_BASE}/clients/${encodeURIComponent(loadedClient.id)}/credentials`);
      if (!r.ok) throw new Error(await r.text());
      const cred = await r.json(); // {client_id, username, created_at}
      setLoadedClient((prev) => ({ ...prev, username: cred.username }));
      window.alert(`Username loaded: ${cred.username}`);
    } catch (e) {
      window.alert(String(e?.message || e));
    }
  };

  // <-- UPDATED: this will request reset AND ask backend to send email to the user -->
  const handleGenerateTempPasswordAndSend = async () => {
    if (!loadedClient?.id) return;
    if (!loadedClient?.email) {
      return window.alert("Client has no email to send to.");
    }
    if (!window.confirm("Generate a temporary password and send it to the user's email?")) return;

    try {
      const payload = {
        length: 12,
        send_email: true,
        email_to: loadedClient.email,              // ส่งไปหาเมลที่เพิ่งโหลดมา
        notify_subject: `Your ${window.location.hostname} account password`,
        notify_body_text:
          `Hello ${loadedClient.first_name || ""},\n\n` +
          `A temporary password has been generated for your account.\n\n` +
          `Username: {{username}}\n` +             // backend จะ replace placeholder
          `Temporary password: {{password}}\n\n` +
          `Please log in and change your password immediately.\n`,
      };

      const r = await fetch(
        `${API_BASE}/clients/${encodeURIComponent(loadedClient.id)}/credentials/reset`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || `Request failed: ${r.status}`);
      }

      const data = await r.json(); // {client_id, username, temporary_password}
        setLoadedClient(prev => ({ ...prev, plain_password: data.temporary_password, username: data.username }));
        setIncludePlainPassword(true);  // ✅ ให้พรีวิวแสดงรหัส
      window.alert(`Temporary password generated and emailed to ${loadedClient.email}`);
    } catch (e) {
      window.alert(String(e?.message || e));
    }
  };

  const mask = (s) => {
    if (!s) return "";
    return s.length <= 2 ? "*".repeat(s.length) : `${s[0]}${"*".repeat(Math.max(0, s.length - 2))}${s.slice(-1)}`;
  };

  const PreviewBody = () => {
    if (form.is_html) {
      return <div style={styles.previewBody} dangerouslySetInnerHTML={{ __html: preview.body || "(preview body)" }} />;
    }
    return <div style={styles.previewBody}>{preview.body || "(preview body)"}</div>;
  };

  if (loading) {
    return <div style={{ color: "#fff", padding: 24 }}>Loading…</div>;
  }

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar placeholder="Search templates" onSearchChange={() => {}} defaultFilter="all" onViewAllPath="/Noti" />
            </div>
          </div>
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/email-template")}>Email Template</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Edit Email Template</span>
          </div>

          <div style={styles.formContainer}>
            {/* left form */}
            <div style={styles.formSection}>
              <div style={styles.formCard}>
                {err && <div style={{ color: "#FCA5A5", fontWeight: 800, marginBottom: 10 }}>{err}</div>}

                {/* client loader */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input
                    placeholder="Client ID or email (for real preview)"
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    style={{ ...styles.input, width: "65%" }}
                  />
                  <button
                    onClick={handleLoadClient}
                    disabled={clientLoading}
                    style={{ borderRadius: 8, padding: "8px 12px", background: THEME.accent, color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    {clientLoading ? "Loading…" : "Load client"}
                  </button>
                  <label htmlFor="includePwd" style={{ display: "flex", alignItems: "center", gap: 8, color: THEME.textMut, cursor: "pointer" }}>
                    <input id="includePwd" type="checkbox" checked={includePlainPassword} onChange={(e) => setIncludePlainPassword(e.target.checked)} />
                    Include plain password
                  </label>
                </div>
                <div style={styles.smallMuted}>
                  หมายเหตุ: ฟีเจอร์นี้จะเรียก API จริงเพื่อดึงข้อมูลผู้ใช้และ license — ให้แน่ใจว่าคุณมีสิทธิ์เข้าถึง API และเข้าใจความเสี่ยงด้านความปลอดภัย (plain password อาจไม่ถูกส่งมาจาก backend).
                </div>
                {clientError && <div style={{ color: "#FCA5A5", marginTop: 8 }}>{clientError}</div>}

                {/* loaded client info + actions */}
                {loadedClient && (
                  <div style={{ marginTop: 10, padding: 8, border: `1px dashed ${THEME.border}`, borderRadius: 8 }}>
                    <div style={{ color: THEME.text, fontWeight: 700 }}>Loaded client:</div>
                    <div style={{ color: THEME.textMut }}>Name: {loadedClient.first_name || loadedClient.name || "(n/a)"}</div>
                    <div style={{ color: THEME.textMut }}>Email: {loadedClient.email || "(n/a)"}</div>
                    <div style={{ color: THEME.textMut }}>Username: {loadedClient.username || "(n/a)"}</div>
                    <div style={{ color: THEME.textMut }}>
                      Password: {includePlainPassword ? (loadedClient.plain_password || loadedClient.password || "(not provided)") : mask(loadedClient.plain_password || loadedClient.password || "")}
                    </div>

                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <button
                        onClick={handleLoadUsername}
                        style={{ borderRadius: 8, padding: "6px 10px", background: "#334155", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Load Username
                      </button>
                      <button
                        onClick={handleGenerateTempPasswordAndSend}
                        style={{ borderRadius: 8, padding: "6px 10px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Generate & Send password
                      </button>
                    </div>
                  </div>
                )}

                {loadedLicense && (
                  <div style={{ marginTop: 10, padding: 8, border: `1px dashed ${THEME.border}`, borderRadius: 8 }}>
                    <div style={{ color: THEME.text, fontWeight: 700 }}>Loaded license:</div>
                    <div style={{ color: THEME.textMut }}>Key: {loadedLicense.license_key || loadedLicense.key || "(n/a)"}</div>
                    <div style={{ color: THEME.textMut }}>Product: {loadedLicense.product_sku || loadedLicense.product || "(n/a)"}</div>
                    <div style={{ color: THEME.textMut }}>Expires: {loadedLicense.expires_at || loadedLicense.expires || "(n/a)"}</div>
                  </div>
                )}


                <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.03)", margin: "12px 0" }} />

                <div style={styles.label}>Slug (read-only)</div>
                <input name="slug" value={form.slug} readOnly style={{ ...styles.input, opacity: 0.6 }} />
                <div style={styles.label}>Name</div>
                <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
                <div style={styles.label}>Subject</div>
                <input name="subject" value={form.subject} onChange={handleChange} style={styles.input} />

                <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 10 }}>
                  <div style={styles.label}>Status</div>
                  {["Active", "Draft", "Disabled"].map((s) => (
                    <label key={s} style={styles.radioLabel}>
                      <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} style={styles.radioInput} />
                      {s}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, color: THEME.text }}>
                  <input id="is_html" type="checkbox" name="is_html" checked={form.is_html} onChange={handleChange} />
                  <label htmlFor="is_html">Send as HTML</label>
                </div>

                <div style={{ marginTop: 12, ...styles.label }}>Body</div>
                <textarea name="body" value={form.body} onChange={handleChange} style={styles.textarea} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 18 }}>
                  {/* delete */}
                  <button
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    style={{
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontWeight: 800,
                      cursor: deleting || saving ? "not-allowed" : "pointer",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(239, 68, 68, 0.18)",
                      color: "#FCA5A5",
                    }}
                    title="Delete this template"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>

                  {/* cancel/save */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      style={{ borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#8B9EB8", color: "#fff" }}
                      onClick={() => navigate("/email-template")}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" }}
                      disabled={saving || deleting}
                      onClick={handleSave}
                    >
                      {saving ? "Saving..." : "Save Change"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* right preview */}
            <div style={styles.previewSection}>
              <div style={styles.previewTitle}>{preview.subject || "(preview subject)"}</div>
              <PreviewBody />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
