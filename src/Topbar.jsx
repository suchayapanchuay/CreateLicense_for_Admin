// src/app/Topbar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./config";

const COLORS = {
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.7)",
  textFaint: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.12)",
  card: "#13253D",
  stageBg: "#0E1D33",
};

const styles = {
  wrap: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, paddingBottom: 8 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "6px 10px", borderRadius: 10, minWidth: 220 },
  input: { border: "none", outline: "none", background: "transparent", color: COLORS.text, width: "100%" },
  bellWrap: { position: "relative", cursor: "pointer" },
  bellBadge: { position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 999, padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: "#ef4444", color: "#fff", border: `2px solid ${COLORS.stageBg}` },

  /* Panel */
  notiPanelWrap: { position: "absolute", top: 56, right: 0, width: 560, background: "#0E2240", border: `1px solid ${COLORS.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: COLORS.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 900, fontSize: 22 },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: { appearance: "none", background: "#183154", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, color: COLORS.text, cursor: "pointer" },
  selectCaret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 18, color: "rgba(255,255,255,0.7)" },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${COLORS.border}` },
  notiBadge: { fontSize: 13, color: COLORS.textMut, marginBottom: 6 },
  notiClient: { fontSize: 18, fontWeight: 800, marginBottom: 2, color: COLORS.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 8, color: COLORS.textFaint, fontSize: 13, marginTop: 6 },
  notiBtn: { marginTop: 10, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  statusLine: { padding: "8px 14px", color: COLORS.textFaint, fontSize: 12, borderBottom: `1px solid ${COLORS.border}` },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer", borderTop: `1px solid ${COLORS.border}` },
};

// helpers
const keyOf = (n) => `${n.kind}:${n.id}`;
function mapTrial(tr) {
  return { kind: "trial", id: tr.id, title: "Free Trial", firstName: tr.firstName || "", lastName: tr.lastName || "", email: tr.email || "", phone: tr.phone || "", company: tr.company || "", created_at: tr.created_at || null, raw: tr };
}
function mapOrder(ord) {
  const [fn, ...rest] = (ord.customer_name || "").split(" ");
  return { kind: "order", id: ord.id, title: "Request (Purchase)", firstName: fn || "", lastName: rest.join(" "), email: ord.customer_email || "", phone: ord.phone || "", company: ord.company || "", status: ord.status || "pending", items: ord.items || [], created_at: ord.created_at || null, raw: ord };
}

/**
 * Topbar ใช้ได้ทุกหน้า:
 * - ช่อง Search (ส่งค่าให้ parent ผ่าน onSearchChange)
 * - ไอคอน Notifications + badge และแผงรายการ พร้อม SSE
 */
export default function Topbar({
  placeholder = "Search",
  onSearchChange,      // (text) => void
  defaultFilter = "all", // all | unread | trial | purchase
  onViewAllPath = "/Noti", // เส้นทางเมื่อกด View All
}) {
  const navigate = useNavigate();

  // search
  const [q, setQ] = useState("");
  useEffect(() => { onSearchChange?.(q); }, [q, onSearchChange]);

  // notifications
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef(null);
  const [filter, setFilter] = useState(defaultFilter);
  const [items, setItems] = useState([]);
  const [seenKeys, setSeenKeys] = useState(() => new Set());
  const unreadCount = useMemo(() => items.filter(n => !seenKeys.has(keyOf(n))).length, [items, seenKeys]);

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const esRef = useRef(null);
  const retryRef = useRef({ tries: 0, timer: null });

  // click-outside, esc
  useEffect(() => {
    const onClick = (e) => { if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false); };
    const onEsc = (e) => { if (e.key === "Escape") setShowNoti(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  // initial fetch + SSE
  useEffect(() => {
    Promise.allSettled([
      fetch(`${API_BASE}/trial-requests`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json()),
    ]).then(([trials, orders]) => {
      const t = trials.status === "fulfilled" && Array.isArray(trials.value) ? trials.value.map(mapTrial) : [];
      const o = orders.status === "fulfilled" && Array.isArray(orders.value) ? orders.value.map(mapOrder) : [];
      setItems([...t, ...o].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
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

  // mark read เมื่อเปิด panel
  useEffect(() => {
    if (!showNoti) return;
    setSeenKeys(prev => {
      const next = new Set(prev);
      items.forEach(n => next.add(keyOf(n)));
      return next;
    });
  }, [showNoti, items]);

  const filtered = useMemo(() => {
    return items.filter(n => {
      if (filter === "all") return true;
      if (filter === "unread") return !seenKeys.has(keyOf(n));
      if (filter === "trial") return n.kind === "trial";
      if (filter === "purchase") return n.kind === "order";
      return true;
    });
  }, [items, filter, seenKeys]);

  return (
    <div style={styles.wrap}>
      {/* Search */}
      <div style={styles.searchBox}>
        <FiSearch />
        <input
          placeholder={placeholder}
          style={styles.input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Bell + Badge */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setShowNoti(v => !v)}
          style={styles.bellWrap}
          title={connecting ? "Connecting…" : connected ? "Live" : "Offline"}
        >
          <IoMdNotificationsOutline size={24} color={COLORS.text} />
          {unreadCount > 0 && <span style={styles.bellBadge}>{unreadCount}</span>}
        </div>

        {/* Panel */}
        {showNoti && (
          <div style={styles.notiPanelWrap} ref={notiRef}>
            <div style={styles.notiHead}>
              <span>Notifications ({items.length})</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={styles.notiSelectWrap}>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.notiSelect}>
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="trial">Trial</option>
                    <option value="purchase">Purchase</option>
                  </select>
                  <FiChevronDown style={styles.selectCaret} />
                </div>
                <IoClose size={22} onClick={() => setShowNoti(false)} style={styles.notiClose} />
              </div>
            </div>

            <div style={styles.statusLine}>
              {connecting ? "CONNECTING…" : connected ? "LIVE" : "OFFLINE"} {errorMsg ? `· ${errorMsg}` : ""}
            </div>

            <div style={styles.notiList}>
              {filtered.length === 0 ? (
                <div style={{ padding: 16, color: COLORS.textFaint, fontStyle: "italic" }}>
                  ไม่มีการแจ้งเตือนตามเงื่อนไข
                </div>
              ) : (
                filtered
                  .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                  .map((n) => (
                    <div key={keyOf(n)} style={styles.notiItem}>
                      <div style={styles.notiBadge}>{n.title}</div>
                      <div style={styles.notiClient}>
                        {`${n.firstName || ""} ${n.lastName || ""}`.trim() || n.company || n.email || (n.kind === "order" ? "Order" : "Trial")}
                      </div>
                      <div style={styles.notiMetaRow}>
                        {n.email ? <span><strong style={{ color: COLORS.textFaint }}>Email:</strong> {n.email}</span> : null}
                        {n.company ? <span><strong style={{ color: COLORS.textFaint }}>Company:</strong> {n.company}</span> : null}
                        {n.kind === "order" && n.status ? <span><strong style={{ color: COLORS.textFaint }}>Status:</strong> {n.status}</span> : null}
                      </div>
                      <div style={{ ...styles.notiMetaRow, marginTop: 4 }}>
                        {n.created_at ? <span><strong style={{ color: COLORS.textFaint }}>Created:</strong> {new Date(n.created_at).toLocaleString()}</span> : null}
                      </div>
                      <button style={styles.notiBtn} onClick={() => navigate(onViewAllPath)}>View All</button>
                    </div>
                  ))
              )}
              <div style={{ height: 12 }} />
            </div>

            <div style={styles.notiFooter} onClick={() => navigate(onViewAllPath)}>View All</div>
          </div>
        )}
      </div>
    </div>
  );
}
