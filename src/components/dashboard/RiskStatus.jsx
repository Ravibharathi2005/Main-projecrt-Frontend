import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { getRiskStatus } from "../../services/risk.service";
import useActivityTracker from "../../hooks/useActivityTracker";

function RiskStatus() {
  const [risk, setRisk] = useState(null);
  const { trackButton } = useActivityTracker();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRiskStatus();

      // Temporary fallback (no backend)
      if (!data) {
        setRisk({
          level: "LOW",
          score: 20,
          lastCheck: "Just now",
        });
      } else {
        setRisk(data);
      }
    };

    fetchData();
  }, []);

  const getColor = () => {
    if (!risk) return "#ccc";
    if (risk.level === "LOW") return "green";
    if (risk.level === "MEDIUM") return "orange";
    {risk.level === "HIGH" &&(
      <p style={{ color: "red", fontWeight: "bold" }}>
        suspicious activity detected
      </p>
    )}
    return "red";
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Risk Status</h2>
        <button
          style={{ marginBottom: "12px", padding: "8px 12px", cursor: "pointer" }}
          onClick={() => trackButton("RiskStatus refresh")}
        >
          Refresh Risk View
        </button>

        {risk && (
          <div
            style={{
              borderLeft: `8px solid ${getColor()}`,
              padding: "15px",
              background: "#f5f5f5",
            }}
          >
            <h3>Risk Level: {risk.level}</h3>
            <p>Risk Score: {risk.score}</p>
            <p>Last Checked: {risk.lastCheck}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default RiskStatus;