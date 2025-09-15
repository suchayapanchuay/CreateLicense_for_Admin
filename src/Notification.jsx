// src/app/Notifications.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { API_BASE } from "./config";

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
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },
  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 16px" },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: 0 },
  statusPill: (ok) => ({
    marginLeft: 12, fontSize: 12, fontWeight: 800, padding: "6px 10px", borderRadius: 999,
    border: `1px solid ${ok ? "rgba(34,197,94,0.4)" : "rgba(248,113,113,0.4)"}`,
    background: ok ? "rgba(34,197,94,0.12)" : "rgba(248,113,113,0.12)",
    color: ok ? "rgb(134, 239, 172)" : "rgb(254, 202, 202)",
  }),
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

function mapEventToCard(ev) {
  const base = {
    id: ev.id || `trial-${Date.now()}-${Math.random()}`,
    type: "Free Trial",
    firstName: ev.firstName || "",
    lastName: ev.lastName || "",
    email: ev.email || "",
    phone: ev.phone || "",
    company: ev.company || "",
    industry: ev.industry || "",
    country: ev.country || "",
    message: ev.message || "",
    created_at: ev.created_at || null,
    raw: ev,
  };
  return base;
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

  // โหลดครั้งแรกจาก DB + subscribe SSE
  useEffect(() => {
    fetch(`${API_BASE}/trial-requests`)
      .then(r => r.json())
      .then(data => setItems(data.map(mapEventToCard)))
      .catch(err => {
        console.error(err);
        setErrorMsg("Failed to load initial items");
      });

    openStream();

    const es = esRef.current;
    const retryState = retryRef.current; // ✅ copy ไป local

    return () => {
      if (es) es.close();
      if (retryState?.timer) clearTimeout(retryState.timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openStream() {
    try {
      setConnecting(true);
      setErrorMsg("");
      const es = new EventSource(`${API_BASE}/admin/stream`);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setConnecting(false);
        retryRef.current.tries = 0;
      };

      es.addEventListener("trial_request", (e) => {
        try {
          const data = JSON.parse(e.data);
          setItems(prev => [mapEventToCard(data), ...prev].slice(0, 300));
        } catch (err) { console.error(err); }
      });

      es.onerror = () => {
        setConnected(false);
        setConnecting(false);
        setErrorMsg("Stream disconnected. Reconnecting…");
        if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
        const n = Math.min(5, retryRef.current.tries + 1);
        retryRef.current.tries = n;
        retryRef.current.timer = setTimeout(openStream, n * 1000);
      };
    } catch (err) {
      setConnected(false);
      setConnecting(false);
      setErrorMsg(err?.message || "Failed to connect SSE");
    }
  }

  async function handleDelete(card) {
    if (!card?.id) return;
    if (!window.confirm("Delete this request?")) return;
    try {
      const res = await fetch(`${API_BASE}/trial-requests/${card.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setItems(prev => prev.filter(x => x.id !== card.id));
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  }

  const filtered = useMemo(() => {
    const list = items.filter(n => {
      if (filter === "all") return true;
      if (filter === "trial") return String(n.type).toLowerCase().includes("trial");
      if (filter === "purchase") return String(n.type).toLowerCase().includes("purchase");
      return true;
    });
    if (!q.trim()) return list;
    const kw = q.toLowerCase();
    return list.filter(n => [
      n.firstName, n.lastName, n.email, n.company, n.industry, n.country, n.message
    ].join(" ").toLowerCase().includes(kw));
  }, [items, filter, q]);

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbar}>
            <div style={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} style={styles.searchInput} />
            </div>
            <IoMdNotificationsOutline size={24} color={THEME.text} />
          </div>

          <div style={styles.titleRow}>
            <h1 style={styles.title}>Notifications</h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={styles.statusPill(connected)}>
                {connecting ? "CONNECTING…" : connected ? "LIVE" : "OFFLINE"}
              </span>
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
              fetch(`${API_BASE}/trial-requests`)
                .then(r=>r.json())
                .then(d=>setItems(d.map(mapEventToCard)));
            }}>Reload</button>
          </div>

          {filtered.length === 0 ? (
            <div style={{ color: THEME.textFaint, fontStyle: "italic" }}>
              {items.length === 0 ? "รอข้อมูลจากลูกค้า… หรือรีเฟรชหน้านี้" : "ไม่พบรายการตามเงื่อนไข"}
            </div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} style={styles.notiCard}>
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
                  <div><div style={styles.label}>Message</div><div style={styles.pill}>{n.message || "-"}</div></div>
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btnPrimary} onClick={() => navigate("/client/add")}>Create Client</button>
                  <button style={styles.btnGhost} onClick={() => handleDelete(n)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
