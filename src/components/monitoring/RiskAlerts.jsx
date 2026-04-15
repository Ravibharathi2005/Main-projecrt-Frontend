import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { getAlerts } from "../../services/alert.service";

function RiskAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getAlerts();
      console.log("Alerts:", data);
      setAlerts(data || []);
    };

    fetchAlerts();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar role="ADMIN" />

      <div
        style={{
          marginLeft: "220px",
          marginTop: "60px", // 🔥 IMPORTANT
          padding: "20px",
        }}
      >
        <h2>Security Alerts 🚨</h2>

        {alerts.length === 0 ? (
          <p>No alerts found</p>
        ) : (
          alerts.map((alert, i) => (
            <div
              key={i}
              style={{
                background: "#ffe5e5",
                padding: "10px",
                marginBottom: "10px",
                borderLeft: "6px solid red",
              }}
            >
              <p><b>{alert.employeeId}</b></p>
              <p>{alert.message}</p>
              <p>
                {alert.time
                  ? new Date(alert.time).toLocaleString()
                  : "No time"}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default RiskAlerts;