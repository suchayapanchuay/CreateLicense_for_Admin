// src/app/AddClient.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* THEME (match Dashboard Light) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#E8F0FE",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
  warn: "#FCD34D",
  danger: "#DC2626",
  success: "#16A34A",
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
    padding: "20px 16px",
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

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: {
    background: THEME.card,
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: {
    width: "80%",
    background: "#FFFFFF",
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
  },
  inline: { display: "flex", gap: 10, alignItems: "center" },

  typeSelectWrap: { position: "relative", width: 220, marginBottom: 12 },
  typeSelect: {
    width: "100%",
    appearance: "none",
    background: THEME.stageBg,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "10px 40px 10px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  caret: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: THEME.textFaint,
    pointerEvents: "none",
  },

  credBox: {
    border: `1px solid ${THEME.border}`,
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
    background: "#FFFFFF",
  },
  smallBtn: {
    border: "none",
    padding: "8px 10px",
    fontWeight: 700,
    borderRadius: 8,
    cursor: "pointer",
  },
  smallBtnBlue: { background: "#60A5FA", color: "#0B1A2D" },
  smallBtnGreen: { background: "#86EFAC", color: "#0B1A2D" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    background: THEME.accent,
    color: "#fff",
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

  banner: (bg, fg = "#0B1A2D") => ({
    background: bg,
    color: fg,
    borderRadius: 10,
    padding: "10px 12px",
    fontWeight: 700,
    marginBottom: 12,
    border: `1px solid ${THEME.border}`,
  }),

  // Success summary styles
  successBox: {
    background: "#ECFDF5",
    border: `1px solid ${THEME.border}`,
    borderRadius: 12,
    padding: 18,
    marginTop: 12,
  },
  successTitle: { fontSize: 22, fontWeight: 900, color: THEME.success, marginBottom: 8 },
  kvRow: { display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, marginBottom: 6 },
};

/* helper */
function parseDays(s) {
  if (!s) return null;
  const m = String(s).match(/\d+/);
  return m ? Number(m[0]) : null;
}
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

export default function AddClient() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search] = useState("");
  const [reqType, setReqType] = useState("trial");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    country: "",
    estimateUser: "",
    message: "",
    trialDays: "",
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // ✅ ใหม่: เก็บผลลัพธ์ที่สร้างเสร็จ เพื่อแสดง Summary แทนการ navigate ทันที
  const [createdClient, setCreatedClient] = useState(null);

  // prefill จาก Notifications (state.prefill)
  useEffect(() => {
    const p = location.state?.prefill || null;
    if (p) {
      if (p.reqType) setReqType(p.reqType);
      setForm((f) => ({
        ...f,
        ...p,
        username: p.username || f.username,
        password: p.password || f.password,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ดึงข้อมูลล่าสุดจาก source/sourceId
  useEffect(() => {
    const source = location.state?.source; // "trial" | "order"
    const sourceId = location.state?.sourceId;
    if (!source || !sourceId) return;

    (async () => {
      try {
        const url =
          source === "order"
            ? `${API_BASE}/orders/${sourceId}`
            : `${API_BASE}/trial-requests/${sourceId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        const mapped =
          source === "order"
            ? (() => {
                const [fn, ...rest] = (data.customer_name || "").split(" ");
                return {
                  reqType: "purchase",
                  firstName: fn || "",
                  lastName: rest.join(" "),
                  email: data.customer_email || "",
                  phone: data.phone || "",
                  company: data.company || "",
                  industry: "-",
                  country: "-",
                  message: data.note || "",
                  estimateUser: "",
                  trialDays: "",
                };
              })()
            : {
                reqType: "trial",
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phone: data.phone || "",
                company: data.company || "",
                industry: data.industry || "",
                country: data.country || "",
                message: data.message || "",
                estimateUser: "",
                trialDays: data.durationDays ? `${data.durationDays} days` : "",
              };

        setReqType(mapped.reqType);
        setForm((f) => ({
          ...f,
          ...mapped,
          username: f.username,
          password: f.password,
        }));
      } catch (e) {
        console.error("Fetch source data failed:", e?.message || e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const randomUsername = () => {
    const base = ["User", "Client", "Member", "Acct", "Cust"];
    const name =
      base[Math.floor(Math.random() * base.length)] +
      (100 + Math.floor(Math.random() * 900));
    patch("username", name);
  };
  const randomPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pw = "";
    for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    patch("password", pw);
  };

  const required = useMemo(
    () => [
      ["firstName", "First Name"],
      ["lastName", "Last Name"],
      ["email", "Email"],
      ["username", "Username"],
      ["password", "Password"],
    ],
    []
  );

  function validate() {
    const miss = required
      .filter(([k]) => !String(form[k] || "").trim())
      .map(([, label]) => label);
    if (miss.length) {
      setError(`กรอกข้อมูลให้ครบ: ${miss.join(", ")}`);
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("อีเมลไม่ถูกต้อง");
      return false;
    }
    setError("");
    return true;
  }

  async function onCreate() {
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    setOkMsg("");
    setError("");

    const payload = {
      requestType: reqType,
      search,
      source: location.state?.source || null,
      sourceId: location.state?.sourceId ? String(location.state.sourceId) : null,
      profile: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        industry: form.industry,
        country: form.country,
        message: form.message,
        estimateUser: form.estimateUser ? Number(form.estimateUser) : null,
      },
      credentials: { username: form.username, password: form.password },
      trial: { days: parseDays(form.trialDays) },
    };

    try {
      const created = await postJSON(`${API_BASE}/clients`, payload);

      // ✅ เก็บไว้แสดงสรุปทันที แทนการ navigate
      setCreatedClient({
        id: created?.id ?? null,
        code: created?.code ?? null,
        email: created?.email ?? payload.profile.email,
        name:
          created?.name ??
          `${payload.profile.firstName || ""} ${payload.profile.lastName || ""}`.trim(),
        username: payload.credentials.username,
        password: payload.credentials.password,
        requestType: payload.requestType,
      });

      setOkMsg("สร้าง Client สำเร็จ");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // เดิม: navigate(`/client/${created.id}`)
      // ตอนนี้ยังไม่ navigate เพื่อกันหน้าขาว — ให้ผู้ใช้กดเองเมื่อพร้อม
    } catch (e) {
      const msg = String(e?.message || e);
      if (/409/.test(msg) || /duplicate/i.test(msg))
        setError("อีเมลหรือชื่อผู้ใช้ซ้ำในระบบ");
      else if (/NetworkError|Failed to fetch|CORS/.test(msg))
        setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (อาจเป็น CORS/เครือข่าย)");
      else setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ รีเซ็ตแบบฟอร์มเพื่อสร้างใหม่
  function resetForm() {
    setCreatedClient(null);
    setOkMsg("");
    setError("");
    setReqType("trial");
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      country: "",
      estimateUser: "",
      message: "",
      trialDays: "",
      username: "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ UI: ถ้าสร้างเสร็จแล้ว แสดง Success Summary แทนฟอร์ม
  const SuccessSummary = () => {
    const cid = createdClient?.id;
    return (
      <div style={{ marginTop: 8 }}>
        <div style={styles.successBox}>
          <div style={styles.successTitle}>✅ Client Created Successfully</div>
          <div style={styles.kvRow}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Request Type</div>
            <div>{createdClient?.requestType || "-"}</div>
          </div>
          <div style={styles.kvRow}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Client ID</div>
            <div>{cid ?? "(ยังไม่ได้รับค่า id จากเซิร์ฟเวอร์)"}</div>
          </div>
          {createdClient?.code && (
            <div style={styles.kvRow}>
              <div style={{ fontWeight: 700, color: THEME.textFaint }}>Code</div>
              <div>{createdClient.code}</div>
            </div>
          )}
          <div style={styles.kvRow}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Name</div>
            <div>{createdClient?.name || "-"}</div>
          </div>
          <div style={styles.kvRow}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Email</div>
            <div>{createdClient?.email || "-"}</div>
          </div>
          <div style={{ height: 8 }} />
          <div style={{ fontWeight: 900, color: THEME.text }}>Credentials</div>
         <div style={{ ...styles.kvRow, marginTop: 16 }}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Username</div>
            <div>
              <code>{createdClient?.username}</code>
            </div>
          </div>
          <div style={{ ...styles.kvRow, marginTop: 8 }}>
            <div style={{ fontWeight: 700, color: THEME.textFaint }}>Password</div>
            <div>
              <code>{createdClient?.password}</code>
            </div>
          </div>
        </div>

        <div style={{ ...styles.actions, marginTop: 16 }}>
          <button style={styles.btnGhost} onClick={resetForm}>
            สร้างใหม่อีกครั้ง
          </button>
          <button style={styles.btnGhost} onClick={() => navigate("/client")}>
            กลับไป Clients
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (noti panel light + bell ดำจากไฟล์ล่าสุด) */}
          <Topbar defaultFilter="all" onViewAllPath="/Noti" />

          <div style={styles.title}>Add Client</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer", color: THEME.text }} onClick={() => navigate("/client")}>
              Clients
            </span>
            &nbsp;&gt;&nbsp; <span style={{ color: "#1D4ED8", fontWeight: 700 }}>Add Client</span>
          </div>

          {!!error && <div style={styles.banner("#FEF3C7")}>{error}</div>}
          {!!okMsg && !createdClient && <div style={styles.banner("#ECFDF5")}>{okMsg}</div>}

          {/* ✅ ถ้าสร้างเสร็จแล้ว แสดง Summary */}
          {createdClient ? (
            <SuccessSummary />
          ) : (
            <div style={styles.card}>
              <div style={styles.typeSelectWrap}>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  style={styles.typeSelect}
                >
                  <option value="trial">Trial Request</option>
                  <option value="purchase">Purchase Request</option>
                  <option value="support">Support Request</option>
                </select>
                <FiChevronDown style={styles.caret} />
              </div>

              <div style={styles.row}>
                <div>
                  <div style={styles.label}>First Name</div>
                  <input
                    value={form.firstName}
                    onChange={(e) => patch("firstName", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
                <div>
                  <div style={styles.label}>Last Name</div>
                  <input
                    value={form.lastName}
                    onChange={(e) => patch("lastName", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div>
                  <div style={styles.label}>Email</div>
                  <input
                    value={form.email}
                    onChange={(e) => patch("email", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
                <div>
                  <div style={styles.label}>Phone</div>
                  <input
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div>
                  <div style={styles.label}>Country</div>
                  <input
                    value={form.country}
                    onChange={(e) => patch("country", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
                <div>
                  <div style={styles.label}>Company</div>
                  <input
                    value={form.company}
                    onChange={(e) => patch("company", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div>
                  <div style={styles.label}>Industry</div>
                  <input
                    value={form.industry}
                    onChange={(e) => patch("industry", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
                <div>
                  <div style={styles.label}>Message</div>
                  <input
                    value={form.message}
                    onChange={(e) => patch("message", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div>
                  <div style={styles.label}>Estimate User</div>
                  <input
                    value={form.estimateUser}
                    onChange={(e) => patch("estimateUser", e.target.value)}
                    style={styles.pillInput}
                  />
                </div>
                <div>
                  <div style={styles.label}>Trial</div>
                  <input
                    value={form.trialDays}
                    onChange={(e) => patch("trialDays", e.target.value)}
                    style={styles.pillInput}
                    placeholder="e.g. 15 days"
                  />
                </div>
              </div>

              <div style={styles.credBox}>
                <div className="row" style={styles.row}>
                  <div>
                    <div style={styles.label}>Username</div>
                    <div style={styles.inline}>
                      <input
                        value={form.username}
                        onChange={(e) => patch("username", e.target.value)}
                        style={styles.pillInput}
                      />
                      <button
                        style={{ ...styles.smallBtn, ...styles.smallBtnBlue }}
                        onClick={randomUsername}
                      >
                        Random Username
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={styles.label}>Password</div>
                    <div style={styles.inline}>
                      <input
                        value={form.password}
                        onChange={(e) => patch("password", e.target.value)}
                        style={styles.pillInput}
                      />
                      <button
                        style={{ ...styles.smallBtn, ...styles.smallBtnGreen }}
                        onClick={randomPassword}
                      >
                        Random Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={{ ...styles.btnPrimary, opacity: submitting ? 0.7 : 1 }}
                  onClick={onCreate}
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Client"}
                </button>
                <button
                  style={styles.btnGhost}
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
