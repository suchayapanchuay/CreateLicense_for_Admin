// src/pages/product.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "./SideBar";
import { FiChevronDown, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

/* THEME */
const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  accent: "#3B82F6",
};

/* STYLES (ตัดส่วน topbar/notifications เดิมออก) */
const styles = {
  root: { display: "flex", minHeight: "1024px", background: THEME.pageBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: "18px 16px", position: "relative" },
  stage: { width: 1152, minHeight: 988, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "14px 0 20px" },

  /* toolbar */
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  selectWrap: { position: "relative", display: "inline-block" },
  select: {
    appearance: "none",
    background: THEME.card,
    color: THEME.text,
    border: `1px solid ${THEME.border}`,
    borderRadius: 8,
    padding: "8px 34px 8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  caret: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: THEME.textMut, pointerEvents: "none" },
  addBtn: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#27A9FF", color: "#062033" },

  /* table */
  tableWrap: { borderRadius: 12, overflow: "hidden", background: THEME.card, border: `1px solid ${THEME.border}` },
  header: {
    background: "rgba(255,255,255,0.08)",
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "12px 18px",
    color: THEME.text,
    fontWeight: 800,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2.4fr 2fr 1.2fr 1fr",
    padding: "16px 18px",
    color: THEME.text,
    borderTop: `1px solid ${THEME.border}`,
    alignItems: "center",
  },
  statusBadge: (type) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    background: type === "active" ? "#A3E635" : "#94A3B8",
    color: type === "active" ? "#0C2712" : "#1E293B",
  }),
  eyeBtn: { width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "999px", border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, cursor: "pointer" },

  /* pagination */
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 18 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: `1px solid ${THEME.border}`, display: "grid", placeItems: "center", color: THEME.textMut, cursor: "pointer", background: "transparent", fontWeight: 600 },
  pageCurrent: { minWidth: 32, height: 32, borderRadius: 8, background: THEME.card, display: "grid", placeItems: "center", color: THEME.text, fontWeight: 800, border: `1px solid ${THEME.border}` },
};

/* MOCK PRODUCTS */
const ALL_PRODUCTS = [
  { id: 1, name: "Smart Audit", nameLower: "smart audit", category: "Accounting Software", categoryLower: "accounting software", status: "active" },
  { id: 2, name: "Product B",   nameLower: "product b",   category: "Cloud Services",       categoryLower: "cloud services",       status: "active" },
  { id: 3, name: "Product D",   nameLower: "product d",   category: "Developer Tools",      categoryLower: "developer tools",      status: "active" },
  { id: 4, name: "Product C",   nameLower: "product c",   category: "HR & Payroll",         categoryLower: "hr & payroll",         status: "active" },
];

export default function Products() {
  const navigate = useNavigate();

  /* state: search/filter (search มาจาก Topbar) */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const q = search.toLowerCase();
  const products = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const hit = p.nameLower.includes(q) || p.categoryLower.includes(q);
      const statusOK = statusFilter === "all" ? true : p.status === statusFilter;
      return hit && statusOK;
    });
  }, [q, statusFilter]);

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* ใช้ Topbar แบบเดียวกับหน้า Clients */}
          <Topbar
            placeholder="Search products"
            onSearchChange={(text) => setSearch(text)}
            defaultFilter="all"
            onViewAllPath="/Noti"
          />

          {/* Heading */}
          <div style={styles.title}>Products</div>

          {/* toolbar */}
          <div style={styles.toolbar}>
            <div className="left">
              <div style={styles.selectWrap}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FiChevronDown style={styles.caret} />
              </div>
            </div>
            <button style={styles.addBtn} onClick={() => navigate("/product/add")}>+ Add Product</button>
          </div>

          {/* table */}
          <div style={styles.tableWrap}>
            <div style={styles.header}>
              <div>Product Name</div>
              <div>Category</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {products.map((p) => (
              <div key={p.id} style={styles.row}>
                <div>{p.name}</div>
                <div>{p.category}</div>
                <div><span style={styles.statusBadge(p.status)}>{p.status === "active" ? "Active" : "Inactive"}</span></div>
                <div>
                  <button
                    style={styles.eyeBtn}
                    onClick={() => navigate(`/product-details/${p.id}`)}
                    aria-label={`View ${p.name}`}
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div style={styles.pagination}>
            <div style={styles.pageBtn}>‹</div>
            <div style={styles.pageCurrent}>1</div>
            <div style={styles.pageBtn}>›</div>
          </div>
        </div>
      </div>
    </div>
  );
}
