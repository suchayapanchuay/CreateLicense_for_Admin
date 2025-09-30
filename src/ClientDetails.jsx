// src/app/ClientDetails.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { FiEye } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

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

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 12 },

  card: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18, marginBottom: 20 },
  typePill: { background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 8, fontWeight: 700, display: "inline-block", marginBottom: 16, color: THEME.text },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  pillInput: { width: "80%", background: "rgba(255,255,255,0.06)", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px" },

  actions: { display: "flex", gap: 10, marginTop: 18 },
  btnPrimary: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnDanger: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#B4534E", color: "#fff" },

  sectionTitle: { fontSize: 20, fontWeight: 900, color: THEME.text, margin: "18px 0 10px" },
  hr: { height: 1, background: THEME.border, border: "none", margin: "12px 0 16px" },

  tableWrap: { borderRadius: 10, overflow: "hidden", marginTop: 8, border: `1px solid ${THEME.border}`, background: THEME.card },
  header: { background: "rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "12px 16px", fontWeight: 700, color: THEME.text },
  row: { display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.4fr 1.4fr 0.8fr", padding: "14px 16px", borderTop: `1px solid ${THEME.border}`, color: THEME.text },

  eyeBtn: { width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },

  banner: (bg) => ({ background: bg, color: "#062033", borderRadius: 10, padding: "10px 12px", fontWeight: 700, marginBottom: 12 }),
};

/* HELPERS (fetch / format) */
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}
async function del(url) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return true;
}
function fmtDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return String(s);
  return d.toLocaleString();
}

/* ---------- SMART PICK (exact + normalize + contains + deep) ---------- */
function normalizeKey(k) {
  return String(k).toLowerCase().replace(/[^a-z0-9]/g, "");
}
function pickDeep(obj, aliases, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 6) return undefined;

  // 1) exact (case-insensitive)
  const lcMap = {};
  for (const k of Object.keys(obj)) lcMap[k.toLowerCase()] = k;
  for (const a of aliases) {
    const k = lcMap[String(a).toLowerCase()];
    if (k !== undefined) return obj[k];
  }

  // 2) normalized equal (created_at vs createdAt vs created-at)
  const normMap = {};
  for (const k of Object.keys(obj)) normMap[normalizeKey(k)] = k;
  for (const a of aliases) {
    const nk = normalizeKey(a);
    if (normMap[nk] !== undefined) return obj[normMap[nk]];
  }

  // 3) contains (e.g., customer_phone includes "phone")
  const nkeys = Object.keys(obj).map((k) => [k, normalizeKey(k)]);
  for (const a of aliases) {
    const na = normalizeKey(a);
    const hit = nkeys.find(([_, nk]) => nk.includes(na));
    if (hit) return obj[hit[0]];
  }

  // 4) deep search (objects & arrays)
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) {
      for (const it of v) {
        const found = pickDeep(it, aliases, depth + 1);
        if (found !== undefined) return found;
      }
    } else if (v && typeof v === "object") {
      const found = pickDeep(v, aliases, depth + 1);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}
function pick(obj, aliases) {
  return pickDeep(obj, aliases, 0);
}
function asText(v, keyHint) {
  if (v === null || v === undefined) return "-";
  const looksDate =
    /_?at$|At$|Date$/i.test(keyHint || "") ||
    (typeof v === "string" && /\d{4}-\d{2}-\d{2}T?\d{0,2}:?\d{0,2}/.test(v));
  if (looksDate) return fmtDate(v);
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    const s = String(v).trim();
    return s === "" ? "-" : s;
  }
  try { return JSON.stringify(v); } catch { return String(v); }
}

/* COMPONENT */
export default function ClientDetails() {
  const navigate = useNavigate();
  const { id: clientId } = useParams();

  const [client, setClient] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!clientId) return;
      setLoading(true);
      setErr("");
      try {
        const c = await getJSON(`${API_BASE}/clients/${clientId}`);
        if (!alive) return;
        setClient(c);

        if (!alive) return;
        const lic = await getJSON(`${API_BASE}/clients/${clientId}/licenses`);
        setLicenses(Array.isArray(lic) ? lic : []);
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [clientId]);

  /* ---- Map ด้วย alias หลายแบบ (ไม่แก้ UI เดิม) ---- */
  const firstName   = pick(client, ["firstName","first_name","firstname","givenName"]);
  const lastName    = pick(client, ["lastName","last_name","lastname","familyName","surname"]);
  const email       = pick(client, ["email","emailAddress","mail"]);
  const phone       = pick(client, ["phone","phoneNumber","phone_number","tel","telephone","mobile","mobilePhone","contactPhone","phoneNo"]);
  const company     = pick(client, ["company","companyName","organization","org"]);
  const country     = pick(client, ["country","countryCode","country_code","country_name","nation","locationCountry","profileCountry"]);
  const industry    = pick(client, ["industry","industryType","sector","businessType","category","lineOfBusiness"]);
  const message     = pick(client, ["message","messages","note","notes","remark","remarks","description","requestMessage","msg","comment"]);
  const estimateUser= pick(client, ["estimateUser","estimatedUsers","userEstimate","numUsers","users"]);
  const createdRaw  = pick(client, ["createdAt","created_at","created","createdDate","created_time","timestamp","submittedAt"]);
  const typeText    = pick(client, ["requestType","type","request_type"]) || "Request";

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <Topbar placeholder="Search clients" defaultFilter="all" onViewAllPath="/Noti" onSearchChange={() => {}} />

          <div style={styles.title}>Client Detail</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/client")}>Clients</span>
            &nbsp;&gt;&nbsp; <span style={{ color: "#9CC3FF" }}>Client Detail</span>
          </div>

          {!!err && <div style={styles.banner("#FCD34D")}>{err}</div>}
          {!!flash && <div style={styles.banner("#34D399")}>{flash}</div>}

          {/* Client Info */}
          <div style={styles.card}>
            <div style={styles.typePill}>{loading ? "Loading..." : String(typeText)}</div>

            {loading ? (
              <div style={{ color: THEME.textMut, fontWeight: 700 }}>กำลังโหลดข้อมูลลูกค้า...</div>
            ) : client ? (
              <>
                <div style={styles.grid2}>
                  <div><div style={styles.label}>First Name</div><div style={styles.pillInput}>{asText(firstName)}</div></div>
                  <div><div style={styles.label}>Last Name</div><div style={styles.pillInput}>{asText(lastName)}</div></div>
                </div>
                <div style={styles.grid2}>
                  <div><div style={styles.label}>Email</div><div style={styles.pillInput}>{asText(email)}</div></div>
                  <div><div style={styles.label}>Phone</div><div style={styles.pillInput}>{asText(phone)}</div></div>
                </div>
                <div style={styles.grid2}>
                  <div><div style={styles.label}>Country</div><div style={styles.pillInput}>{asText(country)}</div></div>
                  <div><div style={styles.label}>Company</div><div style={styles.pillInput}>{asText(company)}</div></div>
                </div>
                <div style={styles.grid2}>
                  <div><div style={styles.label}>Industry</div><div style={styles.pillInput}>{asText(industry)}</div></div>
                  <div><div style={styles.label}>Message</div><div style={styles.pillInput}>{asText(message)}</div></div>
                </div>
                <div style={styles.grid2}>
                  <div><div style={styles.label}>Estimate User</div><div style={styles.pillInput}>{asText(estimateUser)}</div></div>
                  <div><div style={styles.label}>Created</div><div style={styles.pillInput}>{asText(createdRaw, "createdAt")}</div></div>
                </div>

                <div style={styles.actions}>
                  <button style={styles.btnPrimary} onClick={() => navigate(`/client/${clientId}/edit`, { state: { client } })}>
                    Edit Client
                  </button>
                  <button
                    style={styles.btnDanger}
                    onClick={async () => {
                      if (!window.confirm("Delete this client?")) return;
                      try {
                        await del(`${API_BASE}/clients/${clientId}`);
                        navigate("/client", { state: { flash: "Client deleted" } });
                      } catch (e) { setErr(String(e?.message || e)); }
                    }}
                  >
                    Delete Client
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: THEME.textMut, fontWeight: 700 }}>ไม่พบข้อมูลลูกค้า</div>
            )}
          </div>

          {/* License Info */}
          <div style={styles.sectionTitle}>License</div>
          <hr style={styles.hr} />
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product</div>
              <div>Type</div>
              <div>License Key</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div style={{ padding: "14px 16px", color: THEME.textMut, fontWeight: 700 }}>กำลังโหลดไลเซนส์...</div>
            ) : licenses?.length ? (
              licenses.map((lic) => {
                const key = lic.licenseKey || lic.key || "";
                const issued = lic.issuedAt || lic.startDate || lic.start_at;
                const expires = lic.expiresAt || lic.endDate || lic.end_at;
                return (
                  <div key={lic.id || key} style={styles.row}>
                    <div>{lic.productSku || lic.product || "-"}</div>
                    <div>{lic.type || "-"}</div>
                    <div style={{ wordBreak: "break-all" }}>{key || "-"}</div>
                    <div>{fmtDate(issued)}</div>
                    <div>{fmtDate(expires)}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={styles.eyeBtn}
                        title="View License"
                        onClick={() => navigate(`/license/${lic.id}`)} 
                      >
                        <FiEye />
                      </button>
                      <button
                        style={{ ...styles.eyeBtn, width: "auto", padding: "0 10px" }}
                        title="Copy Key"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(String(key));
                            setFlash("คัดลอก License Key แล้ว");
                            setTimeout(() => setFlash(""), 1500);
                          } catch {
                            setErr("คัดลอกไม่สำเร็จ");
                            setTimeout(() => setErr(""), 1500);
                          }
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "14px 16px", color: THEME.textMut, fontWeight: 700 }}>ยังไม่มีไลเซนส์ในลูกค้ารายนี้</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
