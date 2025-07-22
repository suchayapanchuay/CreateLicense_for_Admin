import React, { useState, useEffect, useMemo } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import {
    FiHome, FiKey, FiUser, FiBox, FiBarChart2, FiUsers, FiSettings,
} from "react-icons/fi";
import logo from "./logo_smartclick.png";

const styles = {
    sidebar: {
        width: 190,
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "20px 12px",
        height: "auto",
    },
    logo: {
        width: 160,
        marginBottom: 40,
    },
    navItem: (active) => ({
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        fontSize: 14,
        cursor: "pointer",
        color: active ? "#ffffff" : "#000000",
        backgroundColor: active ? "#003d80" : "transparent",
        borderRadius: 6,
        marginBottom: 6,
    }),
    childItem: (active) => ({
        padding: "8px 16px",
        fontSize: 14,
        cursor: "pointer",
        color: active ? "#003d80" : "#333",
        marginBottom: 4,
        backgroundColor: active ? "#e5f0ff" : "transparent",
        borderRadius: 4,
    }),
};

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    const navItems = useMemo(() => [
  { label: "Dashboard", icon: <FiHome />, path: "/" },
  { label: "Create License", icon: <FiKey />, path: "/create" },
  { label: "Clients", icon: <FiUser />, path: "/client" },
  { label: "Products", icon: <FiBox />, path: "/products" },
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
    useEffect(() => {
  const findOpenMenus = (items) => {
    let toOpen = {};
    const walk = (items) => {
      items.forEach((item) => {
        if (item.children) {
          const match = item.children.some(
            (child) =>
              (child.path && location.pathname.startsWith(child.path)) ||
              (child.children &&
                child.children.some((sub) =>
                  location.pathname.startsWith(sub.path)
                ))
          );
          if (match) {
            toOpen[item.label] = true;
          }
          walk(item.children);
        }
      });
    };
    walk(items);
    setOpenMenus(toOpen);
  };

  findOpenMenus(navItems);
}, [location.pathname, navItems]);

    const toggleMenu = (label) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const renderItems = (items, isChild = false) =>
        items.map((item) => {
            const hasChildren = !!item.children;
            const isActive =
                item.path &&
                (item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path));

            const isChildActive = hasChildren
                ? item.children.some(
                    (child) =>
                        (child.path && location.pathname.startsWith(child.path)) ||
                        (child.children &&
                            child.children.some(
                                (sub) => location.pathname.startsWith(sub.path)
                            ))
                )
                : false;

            const showAsActive = isActive || isChildActive;

            if (hasChildren) {
                const isOpen = openMenus[item.label];

                return (
                    <div key={item.label}>
                        <div
                            style={styles.navItem(showAsActive)}
                            onClick={() => toggleMenu(item.label)}
                        >
                            {item.icon} {item.label}
                        </div>
                        {isOpen && (
                            <div style={{ marginLeft: 10 }}>
                                {renderItems(item.children, true)}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <div
                    key={item.label}
                    style={isChild ? styles.childItem(isActive) : styles.navItem(isActive)}
                    onClick={() => navigate(item.path)}
                >
                    {item.icon} {item.label}
                </div>
            );
        });

    return (
        <div style={styles.sidebar}>
            <img src={logo} alt="SmartClick Logo" style={styles.logo} />
            {renderItems(navItems)}
        </div>
    );
}
