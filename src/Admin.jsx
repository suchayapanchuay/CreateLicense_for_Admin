import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { FiSearch} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const users = [
  { id: 1, name: "Emma Johnson", email: "emma.j@example.com", role: "Administrator", phone: "081-234-5678" },
  { id: 2, name: "Michael Smith", email: "michael.smith@example.com", role: "Editor", phone: "082-345-6789" },
  { id: 3, name: "Sarah Brown", email: "sarah.b@example.com", role: "Viewer", phone: "083-456-7890" },
  { id: 4, name: "James Wilson", email: "james.wilson@example.com", role: "Viewer", phone: "084-567-8901" },
];

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#003d80",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    sidebar: {
        flexShrink: 0,
        width: 180,
        backgroundColor: "#ffffff",
        padding: "20px 12px",
    },
    logo: {
        width: 160,
        marginBottom: 40,
    },
    navItem: (active) => ({
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        fontSize: 15,
        cursor: "pointer",
        color: active ? "#ffffff" : "#000000",
        backgroundColor: active ? "#003d80" : "transparent",
        borderRadius: 6,
        paddingLeft: 12,
        marginBottom: 6,
    }),
    content: {
        flex: 1,
        backgroundColor: "#003d80",
        display: "flex",
        flexDirection: "column",
        padding: "30px",
        overflowX: "hidden",
        position: "relative",
    },
    topbar: {
        backgroundColor: "#003d80",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 16,
        color: "white",
        flexWrap: "wrap",
    },
    searchBox: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#003d80",
        border: "1px solid white",
        borderRadius: 10,
        padding: "4px 12px",
        color: "#ffffff",
    },
    input: {
        border: "none",
        padding: "4px 8px",
        outline: "none",
        backgroundColor: "transparent",
        color: "#ffffff",
    },
    header: {
        padding: "30px 30px 0 30px",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    notiPanel: {
        position: "absolute",
        top: 60,
        right: 30,
        backgroundColor: "white",
        width: 300,
        borderRadius: 10,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        maxHeight: 400,
        overflowY: "auto",
        border: "1px solid #94a3b8"
    },
    notiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #ccc",
        fontWeight: "bold",
        fontSize: 16,
    },
    notiItem: {
        padding: "10px 16px",
        borderBottom: "1px solid #f1f5f9",
        fontSize: 14,
    },
    userControls: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "20px 30px",
        gap: 10
    },
    dropdown: {
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: 14,
    },
    addUserButton: {
        backgroundColor: "#0284c7",
        color: "white",
        fontWeight: "bold",
        padding: "8px 16px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    table: {
        width: "calc(100% - 60px)",
        margin: "0 30px 30px 30px",
        borderCollapse: "collapse",
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
    },
    th: {
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "12px",
        textAlign: "left",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
    },
};

export default function Admin() {
    const [showNoti, setShowNoti] = useState(false);
    const navigate = useNavigate();
    return (
        <div style={styles.container}>
            <Sidebar />

            <div style={styles.content}>
                <div style={styles.topbar}>
                    <div style={styles.searchBox}>
                        <FiSearch color="white" />
                        <input placeholder="search" style={styles.input} />
                    </div>
                    <div onClick={() => setShowNoti(!showNoti)} style={{ cursor: "pointer" }}>
                        <IoMdNotificationsOutline size={24} color="white" />
                    </div>
                </div>

                {showNoti && (
                    <div style={styles.notiPanel}>
                        <div style={styles.notiHeader}>
                            Notifications
                            <IoClose onClick={() => setShowNoti(false)} style={{ cursor: "pointer" }} />
                        </div>
                        <div style={styles.notiItem}>License expired for Client ABC</div>
                        <div style={styles.notiItem}>New client added: XYZ Co.</div>
                    </div>
                )}

                <div style={styles.header}>
                    <div style={styles.title}>Admin Users & Roles</div>
                </div>

                <div style={styles.userControls}>
                    <button
                        style={styles.addUserButton}
                        onClick={() => navigate("/admin-users/add")}
                    >
                        + Invite Admin
                    </button>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Phone</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td style={styles.td}>{user.name}</td>
                          <td style={styles.td}>{user.email}</td>
                          <td style={styles.td}>{user.phone}</td> {/* เพิ่มบรรทัดนี้ */}
                          <td style={styles.td}>{user.role}</td>
                          <td style={styles.td}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#004185",
                                  color: "white",
                                  border: "none",
                                  borderRadius: 4,
                                  padding: "6px 12px",
                                  fontWeight: 500,
                                }}
                                onClick={() => navigate(`/admin-users/edit/${user.id}`)}
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#E25A52",
                                  color: "white",
                                  border: "none",
                                  borderRadius: 4,
                                  padding: "6px 12px",
                                  fontWeight: 500,
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
