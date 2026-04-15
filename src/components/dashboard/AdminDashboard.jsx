import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import API from "../../services/api";
import useActivityTracker from "../../hooks/useActivityTracker";

function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState("");
  const { trackButton } = useActivityTracker();

  const fetchActivities = async (employeeId) => {
    try {
      const query = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : "";
      const res = await API.get(`/api/activity-log${query}`);
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar role="ADMIN" />

      <div style={styles.container}>
        <h2>Admin Dashboard</h2>

        <div style={styles.controls}>
          <input
            placeholder="Filter by employeeId"
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            style={styles.input}
          />
          <button
            style={styles.button}
            onClick={() => {
              fetchActivities(filterEmployee);
              trackButton("AdminDashboard filter");
            }}
          >
            Apply Filter
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setFilterEmployee("");
              fetchActivities();
              trackButton("AdminDashboard refresh");
            }}
          >
            Refresh List
          </button>
        </div>

        <h3>All User Activities</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((act, index) => (
              <tr key={index}>
                <td>{act.employeeId}</td>
                <td>{act.action}</td>
                <td>{new Date(act.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const styles = {
  container: {
    marginLeft: "220px",
    padding: "20px",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    background: "#0d6efd",
    color: "white",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
};

export default AdminDashboard;