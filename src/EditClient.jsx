// src/app/EditClient.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* THEME (Light, match Dashboard) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#E8F0FE",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  textFaint: "#6B7280",
  accent: "#2563EB",
};

/* STYLES */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "20px 16px", position: "relative" },
  stage: {
    width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16,
    border: `1px solid ${THEME.border}`, padding: 24, position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.08)"
  },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },

  typeSelectWrap: { position: "relative", width: 220, marginBottom: 12 },
  typeSelect: {
    width: "100%", appearance: "none",
    background: THEME.stageBg, color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8,
    padding: "10px 40px 10px 12px", fontWeight: 700, cursor: "pointer"
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textFaint, pointerEvents: "none" },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: {
    width: "80%", background: "#FFFFFF", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none"
  },

  credBox: { border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16, marginTop: 12, background: "#FFFFFF" },
  inline: { display: "flex", gap: 10, alignItems: "center" },
  smallBtn: { border: "none", padding: "8px 10px", fontWeight: 700, borderRadius: 8, cursor: "pointer" },
  smallBtnBlue: { background: "#60A5FA", color: "#0B1A2D" },
  smallBtnGreen: { background: "#86EFAC", color: "#0B1A2D" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "#FFFFFF", color: THEME.text },

  banner: (bg, fg = "#0B1A2D") => ({ background: bg, color: fg, borderRadius: 10, padding: "10px 12px", fontWeight: 700, marginBottom: 12, border: `1px solid ${THEME.border}` }),
};

/* HELPERS */
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}
async function patchJSON(url, body) {
  const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}
const parseIntOrNull = (v) => {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};
const parseTrialDays = (s) => {
  if (!s) return null;
  const m = String(s).match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
};

export default function EditClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // route: /client/:id/edit

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
    trialDays: "",   // แสดงเป็นข้อความให้พิมพ์เลขได้ เช่น "15"
    username: "",    // อัปเดตได้ถ้ามี endpoint รองรับ
    password: "",    // อัปเดตได้ถ้ามี endpoint รองรับ
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [flash, setFlash] = useState("");

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const randomUsername = () => {
    const base = ["User", "Client", "Member", "Acct", "Cust"];
    const name = base[Math.floor(Math.random() * base.length)] + (100 + Math.floor(Math.random() * 900));
    patch("username", name);
  };
  const randomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pw = "";
    for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    patch("password", pw);
  };

  // prefilling จาก state (ถ้ามาจากหน้ารายละเอียด) หรือ fetch จาก API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const preload = location.state?.client;
        let c = preload;
        if (!c) {
          c = await getJSON(`${API_BASE}/clients/${id}`);
        }
        if (!alive || !c) return;

        setReqType(c.requestType || "trial");
        setForm({
          firstName: c.firstName || "",
          lastName: c.lastName || "",
          email: c.email || "",
          phone: c.phone || "",
          company: c.company || "",
          industry: c.industry || "",
          country: c.country || "",
          estimateUser: c.estimateUser != null ? String(c.estimateUser) : "",
          message: c.message || "",
          trialDays: "",     // ไม่รู้ค่าเดิมจาก API; ปล่อยให้ผู้ใช้กรอกเมื่อเป็น trial
          username: "",      // ต้องมี endpoint แยกหากต้องการแสดง username เดิม
          password: "",
        });
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, location.state]);

  const payload = useMemo(() => {
    // สร้าง payload ให้ตรงกับ backend (รูปแบบเดียวกับ POST)
    const profile = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      industry: form.industry || null,
      country: form.country || null,
      message: form.message || null,
      estimateUser: parseIntOrNull(form.estimateUser),
    };

    const p = {
      requestType: reqType,
      profile,
      ...(form.username || form.password
        ? { credentials: { username: form.username, password: form.password } }
        : {}),
      ...(reqType === "trial"
        ? { trial: { days: parseTrialDays(form.trialDays) } }
        : {}),
    };
    return p;
  }, [reqType, form]);

  const onSave = async () => {
    if (!id) return;
    try {
      setSaving(true);
      setErr("");
      await patchJSON(`${API_BASE}/clients/${id}`, payload);
      setFlash("Saved");
      // ⛔️ ห้ามเปลี่ยน path: คง navigate ไป /client/${id} ตามไฟล์เดิม
      navigate(`/client/${id}`, { state: { flash: "Client updated" } });
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
      setTimeout(() => setFlash(""), 2000);
    }
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* คง Topbar และ props เดิม (path ไม่เปลี่ยน) */}
          <Topbar placeholder="Search clients" defaultFilter="all" onViewAllPath="/Noti" />

          <div style={styles.title}>Edit Client</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp;
            {/* ⛔️ คง path เดิม: /client-details/${id} */}
            <span style={{ cursor: "pointer" }} onClick={() => navigate(`/client-details/${id}`)}>Client Detail</span>
            &nbsp;&gt;&nbsp; <span style={{ color: "#1D4ED8", fontWeight: 700 }}>Edit Client</span>
          </div>

          {!!err && <div style={styles.banner("#FEF3C7")}>{err}</div>}
          {!!flash && <div style={styles.banner("#ECFDF5")}>{flash}</div>}

          <div style={styles.card}>
            {/* Request type */}
            <div style={styles.typeSelectWrap}>
              <select value={reqType} onChange={(e) => setReqType(e.target.value)} style={styles.typeSelect} disabled={loading || saving}>
                <option value="trial">Trial Request</option>
                <option value="purchase">Purchase Request</option>
                <option value="support">Support Request</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            {/* Rows */}
            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>First Name</div>
                <input value={form.firstName} onChange={(e) => patch("firstName", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
              <div>
                <div style={styles.label}>Last Name</div>
                <input value={form.lastName} onChange={(e) => patch("lastName", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Email</div>
                <input value={form.email} onChange={(e) => patch("email", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
              <div>
                <div style={styles.label}>Phone</div>
                <input value={form.phone} onChange={(e) => patch("phone", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Country</div>
                <input value={form.country} onChange={(e) => patch("country", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
              <div>
                <div style={styles.label}>Company</div>
                <input value={form.company} onChange={(e) => patch("company", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Industry</div>
                <input value={form.industry} onChange={(e) => patch("industry", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
              <div>
                <div style={styles.label}>Message</div>
                <input value={form.message} onChange={(e) => patch("message", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
            </div>

            <div style={styles.grid2}>
              <div>
                <div style={styles.label}>Estimate User</div>
                <input value={form.estimateUser} onChange={(e) => patch("estimateUser", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
              </div>
              <div>
                <div style={styles.label}>Trial</div>
                <input placeholder="days (e.g. 15)" value={form.trialDays} onChange={(e) => patch("trialDays", e.target.value)} style={styles.pillInput} disabled={loading || saving || reqType !== "trial"} />
              </div>
            </div>

            {/* Credentials */}
            <div style={styles.credBox}>
              <div style={styles.grid2}>
                <div>
                  <div style={styles.label}>Username</div>
                  <div style={styles.inline}>
                    <input value={form.username} onChange={(e) => patch("username", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
                    <button type="button" style={{ ...styles.smallBtn, ...styles.smallBtnBlue }} onClick={randomUsername} disabled={loading || saving}>Random Username</button>
                  </div>
                </div>
                <div>
                  <div style={styles.label}>Password</div>
                  <div style={styles.inline}>
                    <input value={form.password} onChange={(e) => patch("password", e.target.value)} style={styles.pillInput} disabled={loading || saving} />
                    <button type="button" style={{ ...styles.smallBtn, ...styles.smallBtnGreen }} onClick={randomPassword} disabled={loading || saving}>Random Password</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={onSave} disabled={saving || loading}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button style={styles.btnGhost} onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
