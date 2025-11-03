// src/pages/Products.jsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

/* THEME (Light to match Dashboard/Clients/etc.) */
const THEME = {
  pageBg: "#F5F8FF",
  stageBg: "#FFFFFF",
  card: "#E8F0FE",
  border: "rgba(0,0,0,0.08)",
  text: "#0B1A2D",
  textMut: "#4B5563",
  accent: "#2563EB",
};

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: THEME.pageBg,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "20px 16px", position: "relative" },
  stage: {
    width: 1152,
    minHeight: 800,
    background: THEME.stageBg,
    borderRadius: 16,
    border: `1px solid ${THEME.border}`,
    padding: 24,
    position: "relative",
    boxShadow: "0 10px 28px rgba(0,0,0,.08)",
  },
  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },

  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none",
    background: THEME.stageBg,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "8px 40px 8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  caret: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: THEME.textMut,
    pointerEvents: "none",
    fontSize: 18,
  },

  btn: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.text,
  },
  btnPrimary: {
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    background: THEME.accent,
    color: "#fff",
  },

  tableWrap: {
    borderRadius: 12,
    overflow: "hidden",
    background: "#FFFFFF",
    border: `1px solid ${THEME.border}`,
  },
  header: {
    background: "#F9FBFF",
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "12px 18px",
    color: THEME.text,
    fontWeight: 800,
    borderBottom: `1px solid ${THEME.border}`,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "16px 18px",
    color: THEME.text,
    borderTop: `1px solid ${THEME.border}`,
    alignItems: "center",
    background: "#FFFFFF",
  },

  statusBadge: (type) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    background: type === "active" ? "rgba(34,197,94,0.16)" : "rgba(148,163,184,0.16)",
    color: THEME.text,
    textTransform: "capitalize",
    border: `1px solid ${THEME.border}`,
  }),

  eyeBtn: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    border: `1px solid ${THEME.border}`,
    background: "#FFFFFF",
    color: THEME.text,
    cursor: "pointer",
  },
};

export default function Products() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const url = new URL(`${API_BASE}/products`);
      url.searchParams.set("limit", 200);
      url.searchParams.set("offset", 0);
      if (search.trim()) url.searchParams.set("q", search.trim());
      // หมายเหตุ: backend ยังไม่รองรับ ?status=; เรากรองฝั่ง client ด้านล่างแทน

      const res = await fetch(url.toString());
      const txt = await res.text();
      let data = null;
      try {
        data = txt ? JSON.parse(txt) : null;
      } catch {}

      if (!res.ok) throw new Error((data && data.detail) || txt || `HTTP ${res.status}`);

      // แปลง isActive -> status (active/inactive) + กรองตาม statusFilter
      let rows = Array.isArray(data) ? data : [];
      rows = rows.map((r) => ({
        ...r,
        status: r.status || (r.isActive ? "active" : "inactive"),
      }));
      if (statusFilter !== "all") {
        rows = rows.filter((r) => r.status === statusFilter);
      }

      setProducts(rows);
    } catch (e) {
      setErr(e?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(t);
  }, [loadProducts]);

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <Topbar placeholder="Search products" onSearchChange={setSearch} defaultFilter="all" onViewAllPath="/Noti" />

          <div style={styles.title}>Products</div>

          <div style={styles.toolbar}>
            <div style={styles.selectWrap}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FiChevronDown style={styles.caret} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.btn} onClick={loadProducts} disabled={loading}>
                {loading ? "Loading..." : "Reload"}
              </button>
              <button style={styles.btnPrimary} onClick={() => navigate("/product/add")}>
                + Add Product
              </button>
            </div>
          </div>

          {err ? <div style={{ color: "#DC2626", marginBottom: 12, fontWeight: 700 }}>{err}</div> : null}

          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product Name</div>
              <div>Category</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {products.length === 0 ? (
              <div style={{ padding: 16, color: THEME.textMut }}>
                {loading ? "Loading..." : "No products found"}
              </div>
            ) : (
              products.map((p) => {
                const status = p.status || (p.isActive ? "active" : "inactive");
                return (
                  <div key={p.id} style={styles.row}>
                    <div>{p.name}</div>
                    <div>{p.category || "-"}</div>
                    <div>
                      <span style={styles.statusBadge(status)}>{status}</span>
                    </div>
                    <div>
                      <button
                        style={styles.eyeBtn}
                        onClick={() => navigate(`/product-details/${p.id}`)}
                        title="View details"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
