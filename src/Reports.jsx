import React, { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer
} from "recharts";
import {
  FiSearch, FiAlertCircle, FiBarChart2, FiClock, FiActivity
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdNotificationsOutline } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "./SideBar";

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
    padding: "30px 24px",
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
  header: {
    padding: "30px 30px 0 30px",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  mainGrid: {
    padding: 30,
    flex: 1,
    display: "flex",
    alignItems: "start",
    marginBottom: 40
  },
  chartBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    aspectRatio: "2 / 1",
    width: "100%",
    //maxWidth: 850,
  },
  chartTitleBar: {
    color: "#003d80",
    padding: "6px 12px",
    fontWeight: "bold",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 20
  },
  selectBox: {
    backgroundColor: "#ffffff",
    color: "black",
    border: "none",
    borderRadius: 4,
    padding: "4px",
    fontSize: 13,
    fontWeight: 500,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)"
  },
  boxStyle: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  outlineBtn: {
    padding: "6px 10px",
    backgroundColor: "white",
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    cursor: "pointer",
  },
  linkBtn: {
    padding: 0,
    border: "none",
    background: "none",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: 14,
  },
  logItem: {
    fontSize: 14,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  }
  
};

// Sample data
const usageData = [
  { day: 5, usage: 10 },
  { day: 7, usage: 30 },
  { day: 10, usage: 25 },
  { day: 15, usage: 65 },
  { day: 20, usage: 55 },
  { day: 24, usage: 10 },
  { day: 26, usage: 40 },
  { day: 28, usage: 70 },
  { day: 30, usage: 140 },
];

const expiryData = [
  { range: "0–30 days", value: 10 },
  { range: "31–90 days", value: 7 },
  { range: "> 90 days", value: 3 },
];

const licenseData = [
  { name: "Jan", value: 130 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 350 },
  { name: "Apr", value: 500 },
  { name: "May", value: 600 },
  { name: "Jun", value: 800 },
];

const trafficData = [
  { time: "12:00", value: 30 },
  { time: "12:05", value: 60 },
  { time: "12:10", value: 35 },
  { time: "12:15", value: 45 },
  { time: "12:20", value: 50 },
];

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("usage");
  const [range] = useState(30);
  const [rangeBar] = useState(0);

  const chartRef = useRef(null);
  const barRef = useRef(null);
  const healthRef = useRef(null);
  const exButtonRefChart = useRef(null);
  const exButtonRefBar = useRef(null);
  const exButtonRefHealth = useRef(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const filteredData = usageData.filter((item) => item.day >= (30 - range + 1));
  const filteredDataBar = rangeBar === 0 ? expiryData : expiryData.filter(item => item.value === rangeBar);

  const exportToPDF = (ref, buttonRef, filename) => {
    const input = ref.current;
    const button = buttonRef.current;
    if (!input || !button) return;
    button.style.visibility = "hidden";
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(filename);
      button.style.visibility = "visible";
    });
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch color="white" />
            <input placeholder="search" style={styles.input} />
          </div>
          <IoMdNotificationsOutline size={24} color="white" />
        </div>

        <div style={styles.header}>
          <div style={styles.title}>Reports</div>
        </div>

        <div style={styles.mainGrid}>
          <div style={{ display: "flex", width: "100%", maxWidth: 900, gap: 20 }}>
            {/* Tab Menu */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => setSelectedTab("usage")}
                style={{
                  backgroundColor: selectedTab === "usage" ? "#003d80" : "#dbeafe",
                  color: selectedTab === "usage" ? "white" : "#1e3a8a",
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 600,
                  textAlign: "left",
                  width: 160,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <FiBarChart2 /> License Usage
              </button>
              <button
                onClick={() => setSelectedTab("expired")}
                style={{
                  backgroundColor: selectedTab === "expired" ? "#003d80" : "#dbeafe",
                  color: selectedTab === "expired" ? "white" : "#1e3a8a",
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 600,
                  textAlign: "left",
                  width: 160,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <FiClock /> License Expired
              </button>
              <button
                onClick={() => setSelectedTab("health")}
                style={{
                  backgroundColor: selectedTab === "health" ? "#003d80" : "#dbeafe",
                  color: selectedTab === "health" ? "white" : "#1e3a8a",
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 600,
                  textAlign: "left",
                  width: 160,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <FiActivity /> System Health
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1 }}>
              {selectedTab === "usage" && (
                <div style={styles.chartBox} ref={chartRef}>
                  <div style={styles.chartTitleBar}>
                    <div>License Usage</div>
                    <div style={{ minWidth: 220,textAlign: "right"  }}>
                      <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          setDateRange(update);
                        }}
                        isClearable
                        placeholderText="Select date range"
                        wrapperClassName="datePicker"
                        className="custom-datepicker"
                        
                      />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" minHeight={260}>
                    <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="usage" stroke="#003d80" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <button ref={exButtonRefChart} onClick={() => exportToPDF(chartRef, exButtonRefChart, "license_usage_chart.pdf")} style={styles.outlineBtn}>Export</button>
                </div>
              )}

              {selectedTab === "expired" && (
                <div style={styles.chartBox} ref={barRef}>
                  <div style={styles.chartTitleBar}>
                    <div>License Expiry</div>
                    <div style={{ minWidth: 220,textAlign: "right"  }}>
                      <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          setDateRange(update);
                        }}
                        isClearable
                        placeholderText="Select date range"
                        wrapperClassName="datePicker"
                        className="custom-datepicker"
                        
                      />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%">
                    <BarChart data={filteredDataBar} barCategoryGap={rangeBar === 0 ? '10%' : '40%'}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1e3a8a" />
                    </BarChart>
                  </ResponsiveContainer>
                  <button ref={exButtonRefBar} onClick={() => exportToPDF(barRef, exButtonRefBar, "license_expiry_chart.pdf")} style={styles.outlineBtn}>Export</button>
                </div>
              )}

              {selectedTab === "health" && (
                <div style={styles.chartBox} ref={healthRef}>
                  <div style={styles.chartTitleBar}>System Health</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                    {/* Alert */}
                    <div style={styles.boxStyle}>
                      <span style={{ fontWeight: "bold" }}>Alert</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FiAlertCircle color="red" />
                        <span>Database connection lost</span>
                      </div>
                      <button style={styles.linkBtn}>View details</button>
                    </div>

                    {/* License Server Status */}
                    <div style={styles.boxStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "bold" }}>License Server Status</span>
                        <span style={{ color: "green", fontWeight: "bold" }}>● Active</span>
                      </div>
                      <button style={styles.outlineBtn}>Ping Server</button>
                    </div>

                    {/* Active Licenses */}
                    <div style={styles.boxStyle}>
                      <div style={{ fontSize: 16, fontWeight: "bold" }}>Total Active Licenses</div>
                      <div style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0" }}>2,430</div>
                      <div style={{ width: "100%", height: 150 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={licenseData}>
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <button ref={exButtonRefHealth} onClick={() => exportToPDF(healthRef, exButtonRefHealth, "health_report.pdf")} style={styles.outlineBtn}>Export Health Report</button>
                    </div>

                    {/* Traffic */}
                    <div style={styles.boxStyle}>
                      <div style={{ fontWeight: "bold", marginBottom: 10 }}>System Load / Traffic</div>
                      <div style={{ width: "100%", height: 100, display: "flex", gap: 30 }}>
                        <ResponsiveContainer width="50%" height="100%">
                          <LineChart data={trafficData}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                        <div style={{ color: "gray" }}>5 minute ago</div>
                      </div>
                      <div style={styles.logItem}>❌ Error! License key validation failed <br /><span style={styles.timestamp}>5 minutes ago</span></div>
                      <div style={styles.logItem}>✅ License key generated <br /><span style={styles.timestamp}>32 minutes ago</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
