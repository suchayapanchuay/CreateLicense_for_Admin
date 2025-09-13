import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome, FiUser, FiBox, FiBarChart2, FiUsers, FiSettings, FiLogOut
} from "react-icons/fi";

const COLORS = {
  sidebarBg: "#0F2138",
  sidebarBgHover: "rgba(255,255,255,0.06)",
  text: "rgba(255,255,255,0.9)",
  textMuted: "rgba(255,255,255,0.60)",
  activeBg: "rgba(59,130,246,0.14)",
  activeBar: "#3B82F6",
  divider: "rgba(255,255,255,0.08)",
};

const styles = {
  wrap: {
    width: 240,                 // ความกว้างตามภาพ (หน้าจอ 1440 พอดี)
    minHeight: "1024px",        // ฟิกซ์ความสูงหน้าจอตามที่ขอ
    backgroundColor: COLORS.sidebarBg,
    color: COLORS.text,
    display: "flex",
    flexDirection: "column",
    padding: "18px 12px",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 10px 14px 10px",
  },
  brandTextTop: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 0.6,
    lineHeight: 1.1,
  },
  brandTextSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: -2,
    letterSpacing: 1.1,
  },
  section: {
    marginTop: 12,
    paddingTop: 8,
    borderTop: `1px solid ${COLORS.divider}`,
  },
  itemOuter: (active) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 12px",
    margin: "4px 6px",
    borderRadius: 8,
    cursor: "pointer",
    backgroundColor: active ? COLORS.activeBg : "transparent",
    transition: "background .15s ease",
    userSelect: "none",
  }),
  leftActiveBar: (active) => ({
    position: "absolute",
    left: -6,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 6,
    background: active ? COLORS.activeBar : "transparent",
  }),
  itemIcon: (active) => ({
    fontSize: 18,
    opacity: active ? 1 : 0.9,
  }),
  itemLabel: { fontSize: 14, fontWeight: 600 },
  caret: {
    fontSize: 12,
    marginLeft: "auto",
    color: COLORS.textMuted,
  },
  subWrap: { marginLeft: 6, marginTop: 4 },
  subHeader: { padding: "6px 14px", fontSize: 12, color: COLORS.textMuted },
  subItem: (active) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px 8px 28px",
    margin: "2px 6px",
    borderRadius: 8,
    cursor: "pointer",
    backgroundColor: active ? COLORS.activeBg : "transparent",
    transition: "background .15s ease",
    fontSize: 13,
    fontWeight: 500,
  }),
  spacer: { flex: 1 },
  logout: {
    margin: "10px 6px 4px",
    paddingTop: 10,
    borderTop: `1px solid ${COLORS.divider}`,
  },
  logoImg: { width: 28, height: 28, objectFit: "contain", borderRadius: 6 },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const navItems = useMemo(() => [
    { label: "Dashboard", icon: <FiHome />, path: "/" },
    { label: "Clients", icon: <FiUser />, path: "/client" },
    { label: "Products", icon: <FiBox />, path: "/product" },
    { label: "Reports", icon: <FiBarChart2 />, path: "/reports" },
    { label: "Admin Users & Roles", icon: <FiUsers />, path: "/admin-users" },
    {
      label: "Setting / Logs",
      icon: <FiSettings />,
      children: [
        {
          label: "Setting",
          children: [
            { label: "API Keys", path: "/api-keys" },
            { label: "Email Template", path: "/email-template" },
          ],
        },
        { label: "Activity Logs", path: "/logs" },
      ],
    },
  ], []);

  // เปิดเมนูแม่อัตโนมัติให้ตรงกับเส้นทางปัจจุบัน
  useEffect(() => {
    const toOpen = {};
    const walk = (items) => {
      items.forEach((item) => {
        if (item.children) {
          const match =
            item.children.some((c) =>
              (c.path && location.pathname.startsWith(c.path)) ||
              (c.children && c.children.some((s) => location.pathname.startsWith(s.path)))
            );
          if (match) toOpen[item.label] = true;
          walk(item.children);
        }
      });
    };
    walk(navItems);
    setOpenMenus(toOpen);
  }, [location.pathname, navItems]);

  const toggleMenu = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const Item = ({ item }) => {
    const hasChildren = !!item.children;
    const isActive =
      item.path &&
      (item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path));

    const childActive = hasChildren
      ? item.children.some(
          (c) =>
            (c.path && location.pathname.startsWith(c.path)) ||
            (c.children && c.children.some((s) => location.pathname.startsWith(s.path)))
        )
      : false;

    const active = isActive || childActive;

    if (hasChildren) {
      const open = !!openMenus[item.label];
      return (
        <div>
          <div
            style={styles.itemOuter(active)}
            onMouseEnter={(e) => (e.currentTarget.style.background = active ? COLORS.activeBg : COLORS.sidebarBgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = active ? COLORS.activeBg : "transparent")}
            onClick={() => toggleMenu(item.label)}
          >
            <span style={styles.leftActiveBar(active)} />
            <span style={styles.itemIcon(active)}>{item.icon}</span>
            <span style={styles.itemLabel}>{item.label}</span>
            <span style={styles.caret}>{open ? "▾" : "▸"}</span>
          </div>

          {open && (
            <div style={styles.subWrap}>
              {item.children.map((c) => {
                if (c.children) {
                  return (
                    <div key={c.label} style={{ marginTop: 4 }}>
                      <div style={styles.subHeader}>{c.label}</div>
                      {c.children.map((s) => {
                        const subActive = location.pathname.startsWith(s.path);
                        return (
                          <div
                            key={s.label}
                            style={styles.subItem(subActive)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = subActive ? COLORS.activeBg : COLORS.sidebarBgHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = subActive ? COLORS.activeBg : "transparent")}
                            onClick={() => navigate(s.path)}
                          >
                            {s.label}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                const childIsActive = location.pathname.startsWith(c.path);
                return (
                  <div
                    key={c.label}
                    style={styles.subItem(childIsActive)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = childIsActive ? COLORS.activeBg : COLORS.sidebarBgHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = childIsActive ? COLORS.activeBg : "transparent")}
                    onClick={() => navigate(c.path)}
                  >
                    {c.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        style={styles.itemOuter(active)}
        onMouseEnter={(e) => (e.currentTarget.style.background = active ? COLORS.activeBg : COLORS.sidebarBgHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = active ? COLORS.activeBg : "transparent")}
        onClick={() => navigate(item.path)}
      >
        <span style={styles.leftActiveBar(active)} />
        <span style={styles.itemIcon(active)}>{item.icon}</span>
        <span style={styles.itemLabel}>{item.label}</span>
      </div>
    );
  };

  return (
    <aside style={styles.wrap}>
      {/* Brand */}
      <div style={styles.brand}>
        <div>
          <div style={styles.brandTextTop}>SMART CLICK</div>
          <div style={styles.brandTextSub}>ADMIN</div>
        </div>
      </div>

      {/* Menus */}
      <div style={{ marginTop: 6 }}>
        {navItems.map((it) => (
          <Item key={it.label} item={it} />
        ))}
      </div>

      <div style={styles.spacer} />

      {/* Logout */}
      <div style={styles.logout}>
        <div
          style={styles.itemOuter(false)}
          onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.sidebarBgHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          onClick={() => navigate("/logout")}
        >
          <span style={styles.itemIcon(false)}><FiLogOut /></span>
          <span style={styles.itemLabel}>Log out</span>
        </div>
      </div>
    </aside>
  );
}
