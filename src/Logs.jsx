import React, { useState } from "react";
import {
    FiSearch
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Sidebar from "./SideBar";

const activity = [
    {
        id: "1",
        user: "Admin101",
        action: "Login",
        timestamp: "2025-07-10 12",
    },
    {
        id: "2",
        user: "Admin102",
        action: "Create License",
        timestamp: "2023-07-10 11",
    },
];



export default function Logs() {
    const [showNoti, setShowNoti] = useState(false);
    const [filters, setFilters] = useState({
        user: "",
        action: "",
        date: "",
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const filteredActivities = activity.filter((item) => {
        const userMatch = appliedFilters.user === "" || item.user === appliedFilters.user;
        const actionMatch = appliedFilters.action === "" || item.action === appliedFilters.action;

        let dateMatch = true;
        if (appliedFilters.date) {
            const itemDate = new Date(item.timestamp.split(" ")[0]);
            const selectedDate = new Date(appliedFilters.date);
            dateMatch = itemDate >= selectedDate;
        }

        return userMatch && actionMatch && dateMatch;
    });

    const exportCSV = (data) => {
        const header = ["Timestamp", "User", "Action"];
        const rows = data.map(item => [item.timestamp, item.user, item.action]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [header, ...rows].map((e) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "activity_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const uniqueUsers = ["", ...new Set(activity.map((a) => a.user))];
    const uniqueActions = ["", ...new Set(activity.map((a) => a.action))];

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

                <div style={{ padding: "30px" }}>
                    <h2 style={styles.title}>Activity Logs</h2>

                    <div style={styles.card}>
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Date From</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={styles.td}>
                                        <select
                                            style={styles.dropdown}
                                            value={filters.user}
                                            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                                        >
                                            {uniqueUsers.map((user) => (
                                                <option key={user} value={user}>{user}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={styles.td}>
                                        <select
                                            style={styles.dropdown}
                                            value={filters.action}
                                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                        >
                                            {uniqueActions.map((action) => (
                                                <option key={action} value={action}>{action}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={styles.td}>
                                        <input
                                            type="date"
                                            style={styles.dateInput}
                                            value={filters.date}
                                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{marginLeft:"12px"}}>
                        <button style={styles.button} onClick={() => setAppliedFilters(filters)}>
                            Apply Filter
                        </button>
                        <button style={styles.exportButton} onClick={() => exportCSV(filteredActivities)}>
                            Export CSV
                        </button>
                        </div>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Time Stamp</th>
                                <th style={styles.th}>User</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.map((item, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{item.timestamp}</td>
                                    <td style={styles.td}>{item.user}</td>
                                    <td style={styles.td}>{item.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#003d80",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },

    content: {
        flex: 1,
        backgroundColor: "#003d80",
        display: "flex",
        flexDirection: "column",
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
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
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
        border: "1px solid #94a3b8",
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
    card: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        color: "#000000",
        maxWidth: 700,
        minWidth:400,
        marginBottom: 40
    },
    button: {
        backgroundColor: "#1d4ed8",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        borderRadius: 6,
        marginRight: 10,
        cursor: "pointer",

    },
    table: {
        width: "100%",
        backgroundColor: "white",
        color: "black",
        borderRadius: 10,
        overflow: "hidden",
        borderCollapse: "collapse",
        marginTop: 12,
    },
    th: {
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: 12,
        textAlign: "left",
        width: 100
    },
    td: {
        padding: 12,

    },
    backButton: {
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: "6px 14px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        marginBottom: 20,
    },
    dateInput: {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #ccc",
        backgroundColor: "white",
        color: "#000",
    },

    exportButton: {
        backgroundColor: "#10b981",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        marginLeft: 10,
    },
    dropdown: {
    width:140,
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
}
};
