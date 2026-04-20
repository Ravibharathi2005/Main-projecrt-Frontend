import React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { getDashboardData } from "../../services/dashboard.service";
import useActivityTracker from "../../hooks/useActivityTracker";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const { trackButton } = useActivityTracker();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashboardData();
      setData(res);
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  const stats = [
    { title: "Risk Status", value: data.riskStatus, color: "green" },
    { title: "Active Sessions", value: data.sessions, color: "blue" },
    { title: "Recent Alerts", value: data.alerts, color: "orange" },
  ];

  return (
    <>
      <Navbar />
      <Sidebar />

      <div style={styles.container}>
        <h2>Welcome, {user?.employeeId}</h2>
        <p style={styles.subText}>Role: {user?.role || "USER"}</p>
        <p style={styles.status}>Monitoring status: Active</p>

        <div style={styles.buttonRow}>
          <button
            style={styles.portalButton}
            onClick={() => window.open("http://localhost:5173", "_blank")}
          >
            Open Company Portal
          </button>
          <button
            style={styles.trackButton}
            onClick={() => trackButton("UserDashboard refresh")}
          >
            Refresh Data
          </button>
        </div>
        <div style={styles.alerts}>
          <h3>Alerts</h3>
          <p>{data.alerts ? `${data.alerts.length} active alerts` : "No active alerts"}</p>
        </div>

        {/* 🔥 CARDS */}
        <div style={styles.grid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.title}</h3>
              <p style={{ color: item.color, fontWeight: "bold" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* 🔥 ACTIVITY */}
        <div style={styles.activity}>
          <h3>Recent Activity</h3>
          <ul>
            {data.activities?.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    marginLeft: "220px",
    padding: "20px",
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    flex: 1,
    padding: "20px",
    background: "#f5f5f5",
    borderRadius: "10px",
  },
  activity: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
  },
  alerts: {
    marginTop: "20px",
    padding: "16px",
    background: "#fff8f0",
    borderRadius: "10px",
    border: "1px solid #ffdca8",
  },
  subText: {
    margin: "6px 0 0",
    color: "#555",
  },
  status: {
    margin: "6px 0 16px",
    color: "#198754",
    fontWeight: "bold",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
    marginBottom: "15px",
  },
  portalButton: {
    padding: "8px 16px",
    background: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  trackButton: {
    padding: "8px 16px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UserDashboard;