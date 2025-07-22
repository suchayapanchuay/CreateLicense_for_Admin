
import React, { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer
} from "recharts";
import {
  FiSearch, FiAlertCircle
} from "react-icons/fi";
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
  subtitle: {
    color: "#d1d5db",
    fontSize: 14,
  },
  mainGrid: {
    padding: 30,
    justifyContent: "center",
    gap: 20,
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
    maxWidth: 850,
  },
  chartTitleBar: {
    // backgroundColor: "#003d80",
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: "none",
    borderRadius: 4,
    padding: "4px",
    fontSize: 13,
    fontWeight: 500,
    textColor: "#ffffff",
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

// const usageData = Array.from({ length: 90 }, (_, i) => ({
//   day: i + 1,
//   usage: Math.floor(Math.random() * 50) + 1,
// }));

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
  const [range, setRange] = useState(30);
  const [rangeBar, setRangeBar] = useState(0);

  const chartRef = useRef(null);
  const barRef = useRef(null);
  const healthRef = useRef(null);
  const exButtonRefChart = useRef(null);
  const exButtonRefBar = useRef(null);
  const exButtonRefHealth = useRef(null);

  const filteredData = usageData.filter((item) => item.day >= (30 - range + 1));
  const filteredDataBar =
    rangeBar === 0 ? expiryData : expiryData.filter(item => item.value === rangeBar);

  const handleExportPDF = () => {
    const input = chartRef.current;
    const exbutton = exButtonRefChart.current;
    if (!input || !exbutton) return;
    exbutton.style.visibility = "hidden";
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("license_usage_chart.pdf");
      exbutton.style.visibility = "visible";
    });

  };
  const handleExportBarPDF = () => {
    const input = barRef.current;
    const exbutton = exButtonRefBar.current;
    if (!input || !exbutton) return;
    exbutton.style.visibility = "hidden";
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("license_expiry_bar_chart.pdf");
      exbutton.style.visibility = "visible";
    });

  };
  const handleExportHealthPDF = () => {
    const input = healthRef.current;
    const exbutton = exButtonRefHealth.current;
    if (!input || !exbutton) return;
    exbutton.style.visibility = "hidden";
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("health_report_bar_chart.pdf");
      exbutton.style.visibility = "visible";
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
          <div style={styles.chartBox} ref={chartRef}>
            <div style={styles.chartTitleBar}>
              <div>License Usage</div>
              <select
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                style={styles.selectBox}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

            </div>
            <ResponsiveContainer width="100%" >
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" interval="preserveStartEnd" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#003d80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <button
              ref={exButtonRefChart}
              onClick={handleExportPDF}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
                display: "block",
                margin: "12px auto 0 auto",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
            >
              Export
            </button>
          </div>

        </div>
        <div style={styles.mainGrid}>
          <div style={styles.chartBox} ref={barRef}>
            <div style={styles.chartTitleBar}>
              <div>License Expiry</div>
              <select
                value={rangeBar}
                onChange={(e) => setRangeBar(Number(e.target.value))}
                style={styles.selectBox}
              >
                <option value="0">All</option>
                <option value="3">0-30 days</option>
                <option value="7">30-90 days</option>
                <option value="10">{">90 days"}</option>
              </select>
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
            <button
              ref={exButtonRefBar}
              onClick={handleExportBarPDF}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
                display: "block",
                margin: "12px auto 0 auto",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
            >
              Export
            </button>
          </div>

        </div>
        <div style={styles.mainGrid}>
          <div style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            aspectRatio: "2 / 1",
            width: "100%",
            maxWidth: "850px",
            justifyContent: "center",

          }}>
            <div style={styles.chartTitleBar}>
              <div>System Health</div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}>
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

              {/* Total Active Licenses */}
              <div style={styles.boxStyle} ref={healthRef}>
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
                <button style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "block",
                  margin: "12px auto 0 auto",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                }} ref={exButtonRefHealth} onClick={handleExportHealthPDF}>Export Health Report</button>
              </div>

              {/* System Load / Traffic */}
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
        </div>





      </div>


    </div>
  );
}

