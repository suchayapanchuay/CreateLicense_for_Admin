// src/app/Notifications.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { API_BASE } from "./config";

const THEME = { pageBg: "#0B1A2D", stageBg: "#0E1D33", card: "#13253D", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.92)", textMut: "rgba(255,255,255,0.70)", textFaint: "rgba(255,255,255,0.55)", accent: "#3B82F6" };
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 16px" },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: 0 },
  statusPill: (ok) => ({ marginLeft: 12, fontSize: 12, fontWeight: 800, padding: "6px 10px", borderRadius: 999, border: `1px solid ${ok ? "rgba(34,197,94,0.4)" : "rgba(248,113,113,0.4)"}`, background: ok ? "rgba(34,197,94,0.12)" : "rgba(248,113,113,0.12)", color: ok ? "rgb(134, 239, 172)" : "rgb(254, 202, 202)" }),
  filterWrap: { position: "relative", display: "inline-block", marginBottom: 20 },
  filterSelect: { appearance: "none", background: THEME.card, color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "8px 36px 8px 12px", fontWeight: 600, cursor: "pointer" },
  filterCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textMut },
  notiCard: { border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 16, marginBottom: 20, background: THEME.card },
  typeTitle: { fontSize: 16, fontWeight: 800, marginBottom: 12, color: THEME.accent },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 12 },
  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 4 },
  pill: { background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: THEME.text },
  btnRow: { display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" },
  btnPrimary: { borderRadius: 8, padding: "8px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  btnGhost: { borderRadius: 8, padding: "8px 14px", fontWeight: 800, cursor: "pointer", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text },
};

function mapTrial(tr) {
  return { kind: "trial", id: tr.id, type: "Freetrial", firstName: tr.firstName || "", lastName: tr.lastName || "", email: tr.email || "", phone: tr.phone || "", company: tr.company || "", industry: tr.industry || "", country: tr.country || "", message: tr.message || "", durationDays: tr.durationDays, created_at: tr.created_at || null, raw: tr };
}
function mapOrder(ord) {
  const [fn, ...rest] = (ord.customer_name || "").split(" ");
  return { kind: "order", id: ord.id, type: "Request", firstName: fn || "", lastName: rest.join(" "), email: ord.customer_email || "", phone: ord.phone || "", company: ord.company || "", industry: "-", country: "-", message: ord.note || "", status: ord.status || "pending", items: ord.items || [], created_at: ord.created_at || null, raw: ord };
}

// พรีฟิลเบื้องต้น
function toPrefillFromTrial(n) {
  return {
    reqType: "trial",
    firstName: n.firstName || "",
    lastName: n.lastName || "",
    email: n.email || "",
    phone: n.phone || "",
    company: n.company || "",
    industry: n.industry || "",
    country: n.country || "",
    message: n.message || "",
    estimateUser: "",
    trialDays: n.durationDays ? `${n.durationDays} days` : "",
  };
}
function toPrefillFromOrder(n) {
  return {
    reqType: "purchase",
    firstName: n.firstName || "",
    lastName: n.lastName || "",
    email: n.email || "",
    phone: n.phone || "",
    company: n.company || "",
    industry: n.industry || "",
    country: n.country || "",
    message: n.message || "",
    estimateUser: "",
    trialDays: "",
  };
}

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [items, setItems] = useState([]);
  const esRef = useRef(null);
  const retryRef = useRef({ tries: 0, timer: null });

  useEffect(() => {
    Promise.allSettled([
      fetch(`${API_BASE}/trial-requests`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json()),
    ]).then(([trials, orders]) => {
      const t = trials.status === "fulfilled" && Array.isArray(trials.value) ? trials.value.map(mapTrial) : [];
      const o = orders.status === "fulfilled" && Array.isArray(orders.value) ? orders.value.map(mapOrder) : [];
      setItems([...t, ...o]);
    }).catch(() => setErrorMsg("Failed to load initial items"));

    openStream();
    const es = esRef.current; const s = retryRef.current;
    return () => { if (es) es.close(); if (s?.timer) clearTimeout(s.timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openStream() {
    try {
      setConnecting(true); setErrorMsg("");
      const es = new EventSource(`${API_BASE}/admin/notifications/stream`);
      esRef.current = es;
      es.onopen = () => { setConnected(true); setConnecting(false); retryRef.current.tries = 0; };
      es.addEventListener("trial_request", (e) => { try { const d = JSON.parse(e.data); setItems(prev => [mapTrial(d), ...prev].slice(0, 300)); } catch {} });
      es.addEventListener("order_created", (e) => { try { const d = JSON.parse(e.data); setItems(prev => [mapOrder(d), ...prev].slice(0, 300)); } catch {} });
      es.addEventListener("order_status_changed", (e) => { try { const d = JSON.parse(e.data); setItems(prev => prev.map(x => (x.kind === "order" && x.id === d.id ? { ...x, status: d.status } : x))); } catch {} });
      es.onerror = () => {
        setConnected(false); setConnecting(false); setErrorMsg("Stream disconnected. Reconnecting…");
        if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
        const n = Math.min(5, (retryRef.current.tries || 0) + 1);
        retryRef.current.tries = n;
        retryRef.current.timer = setTimeout(openStream, n * 1000);
      };
    } catch (err) { setConnected(false); setConnecting(false); setErrorMsg(err?.message || "Failed to connect SSE"); }
  }

  async function handleDelete(card) {
    if (!card?.id) return;
    if (!window.confirm("Delete this record?")) return;
    const url = card.kind === "order" ? `${API_BASE}/orders/${card.id}` : `${API_BASE}/trial-requests/${card.id}`;
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setItems(prev => prev.filter(x => !(x.kind === card.kind && x.id === card.id)));
    } catch (e) { alert(e?.message || "Delete failed"); }
  }

  const filtered = useMemo(() => {
    const list = items.filter(n => (filter === "all") || (filter === "trial" && n.kind === "trial") || (filter === "purchase" && n.kind === "order"));
    if (!q.trim()) return list;
    const kw = q.toLowerCase();
    return list.filter(n => [n.firstName, n.lastName, n.email, n.company, n.industry, n.country, n.message, n.status].join(" ").toLowerCase().includes(kw));
  }, [items, filter, q]);

  const OrderCard = (n) => (
    <div key={`order-${n.id}`} style={styles.notiCard}>
      <div style={styles.typeTitle}>Request (Purchase)</div>
      <div style={styles.grid2}>
        <div><div style={styles.label}>Customer</div><div style={styles.pill}>{`${n.firstName || ""} ${n.lastName || ""}`.trim() || "-"}</div></div>
        <div><div style={styles.label}>Email</div><div style={styles.pill}>{n.email || "-"}</div></div>
      </div>
      <div style={styles.grid2}>
        <div><div style={styles.label}>Phone</div><div style={styles.pill}>{n.phone || "-"}</div></div>
        <div><div style={styles.label}>Company</div><div style={styles.pill}>{n.company || "-"}</div></div>
      </div>
      <div style={styles.grid2}>
        <div><div style={styles.label}>Status</div><div style={styles.pill}>{n.status || "pending"}</div></div>
        <div><div style={styles.label}>Items</div><div style={styles.pill}>{Array.isArray(n.items) ? n.items.length : 0}</div></div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={styles.label}>Note</div>
        <div style={{ ...styles.pill, whiteSpace: "pre-wrap" }}>{n.message || "-"}</div>
      </div>
      <div style={styles.btnRow}>
        {/* ส่ง prefill + source/id ไปหน้า Add Client */}
        <button
          style={styles.btnPrimary}
          onClick={() =>
            navigate("/client/add", {
              state: { prefill: toPrefillFromOrder(n), source: "order", sourceId: n.id },
            })
          }
        >
          Create Client
        </button>
        <button style={styles.btnGhost} onClick={() => handleDelete(n)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbar}>
            <div style={styles.searchBox}><FiSearch /><input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} style={styles.searchInput} /></div>
            <IoMdNotificationsOutline size={24} color={THEME.text} />
          </div>

          <div style={styles.titleRow}>
            <h1 style={styles.title}>Notifications</h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={styles.statusPill(connected)}>{connecting ? "CONNECTING…" : connected ? "LIVE" : "OFFLINE"}</span>
              {errorMsg ? <span style={{ marginLeft: 8, color: THEME.textFaint, fontSize: 12 }}>{errorMsg}</span> : null}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={styles.filterWrap}>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
                <option value="all">All</option>
                <option value="trial">Trial</option>
                <option value="purchase">Purchase</option>
              </select>
              <FiChevronDown style={styles.filterCaret} />
            </div>

            <button style={styles.btnGhost} onClick={() => setItems([])}>Clear (local)</button>
            <button style={styles.btnGhost} onClick={() => {
              Promise.allSettled([fetch(`${API_BASE}/trial-requests`).then(r=>r.json()), fetch(`${API_BASE}/orders`).then(r=>r.json())])
                .then(([trials, orders]) => {
                  const t = trials.status === "fulfilled" && Array.isArray(trials.value) ? trials.value.map(mapTrial) : [];
                  const o = orders.status === "fulfilled" && Array.isArray(orders.value) ? orders.value.map(mapOrder) : [];
                  setItems([...t, ...o]);
                });
            }}>Reload</button>
          </div>

          {filtered.length === 0 ? (
            <div style={{ color: THEME.textFaint, fontStyle: "italic" }}>
              {items.length === 0 ? "รอข้อมูลจากลูกค้า… หรือรีเฟรชหน้านี้" : "ไม่พบรายการตามเงื่อนไข"}
            </div>
          ) : (
            filtered
              .sort((a,b)=> (new Date(b.created_at||0)) - (new Date(a.created_at||0)))
              .map(n =>
                n.kind === "order" ? (
                  <OrderCard key={`oc-${n.id}`} {...n} />
                ) : (
                  <div key={`trial-${n.id}`} style={styles.notiCard}>
                    <div style={styles.typeTitle}>Free Trial</div>
                    <div style={styles.grid2}>
                      <div><div style={styles.label}>First Name</div><div style={styles.pill}>{n.firstName || "-"}</div></div>
                      <div><div style={styles.label}>Last Name</div><div style={styles.pill}>{n.lastName || "-"}</div></div>
                    </div>
                    <div style={styles.grid2}>
                      <div><div style={styles.label}>Email</div><div style={styles.pill}>{n.email || "-"}</div></div>
                      <div><div style={styles.label}>Phone</div><div style={styles.pill}>{n.phone || "-"}</div></div>
                    </div>
                    <div style={styles.grid2}>
                      <div><div style={styles.label}>Company</div><div style={styles.pill}>{n.company || "-"}</div></div>
                      <div><div style={styles.label}>Industry</div><div style={styles.pill}>{n.industry || "-"}</div></div>
                    </div>
                    <div style={styles.grid2}>
                      <div><div style={styles.label}>Country</div><div style={styles.pill}>{n.country || "-"}</div></div>
                      <div><div style={styles.label}>Message</div><div style={{ ...styles.pill, whiteSpace: "pre-wrap" }}>{n.message || "-"}</div></div>
                    </div>
                    <div style={styles.btnRow}>
                      <button
                        style={styles.btnPrimary}
                        onClick={() =>
                          navigate("/client/add", {
                            state: { prefill: toPrefillFromTrial(n), source: "trial", sourceId: n.id },
                          })
                        }
                      >
                        Create Client
                      </button>
                      <button style={styles.btnGhost} onClick={() => handleDelete(n)}>Delete</button>
                    </div>
                  </div>
                )
              )
          )}
        </div>
      </div>
    </div>
  )
}
