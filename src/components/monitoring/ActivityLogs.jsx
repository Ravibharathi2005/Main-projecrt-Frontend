import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import API from "../../services/api";
import useActivityTracker from "../../hooks/useActivityTracker";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState("");
  const { trackButton } = useActivityTracker();

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await API.get("/api/activity-log");
      setLogs(res.data);
    };

    fetchLogs();
  }, []);

  const handleFilter = async () => {
    const query = filterEmployee ? `?employeeId=${encodeURIComponent(filterEmployee)}` : "";
    const res = await API.get(`/api/activity-log${query}`);
    setLogs(res.data);
    trackButton("ActivityLogs filter");
  };

  return (
    <>
      <Navbar />
      <Sidebar role="ADMIN" />

      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Activity Logs</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <input
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            placeholder="Filter by employeeId"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button onClick={handleFilter} style={{ padding: "8px 10px" }}>
            Apply
          </button>
        </div>

        {logs.map((log, i) => (
          <div key={i} style={styles.card}>
            <p><b>{log.employeeId}</b></p>
            <p>{log.action}</p>
            <p>{new Date(log.time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "#f5f5f5",
    padding: "10px",
    marginBottom: "10px",
    borderLeft: "5px solid #333",
  },
};

export default ActivityLogs;