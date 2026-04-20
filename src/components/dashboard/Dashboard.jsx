import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { getDashboardData } from "../../services/dashboard.service";
import useActivityTracker from "../../hooks/useActivityTracker";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ alerts: [], activities: [] });
  const [loading, setLoading] = useState(true);
  const { trackButton } = useActivityTracker();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getDashboardData();
        setData(response || { alerts: [], activities: [] });
      } catch (error) {
        console.error("Dashboard load error:", error);
        setData({ alerts: [], activities: [] });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <main style={styles.page}>
        <section style={styles.headerGrid}>
          <div style={styles.profileCard}>
            <div style={styles.profileCardHeader}>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>
                  {user?.name?.charAt(0) || user?.employeeId?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p style={styles.cardLabel}>SECURITY MONITORING DASHBOARD</p>
                <h1 style={styles.cardTitle}>Welcome {user?.employeeId}</h1>
                <p style={styles.cardSubtitle}>{user?.role || "USER"}</p>
              </div>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.detailRow}>
                <span>Employee ID</span>
                <strong>{user?.employeeId}</strong>
              </div>
              <div style={styles.detailRow}>
                <span>Role</span>
                <strong>{user?.role || "USER"}</strong>
              </div>
              <div style={styles.detailRow}>
                <span>Monitoring Status</span>
                <span style={styles.statusBadge}>Active</span>
              </div>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2>Alerts</h2>
              <p>Monitoring company portal activity in the active session.</p>
            </div>

            <button
              style={styles.portalButton}
              onClick={() => window.open("http://localhost:5173", "_blank")}
            >
              Open Company Portal
            </button>

            <div style={styles.alertsCard}>
              <h3>Alert Summary</h3>
              <p>
                {data.alerts?.length
                  ? `${data.alerts.length} active alert${data.alerts.length === 1 ? "" : "s"}`
                  : "No active alerts"}
              </p>
            </div>
          </div>
        </section>

        <section style={styles.activitySection}>
          <h3>Recent Activity</h3>
          <ul style={styles.activityList}>
            {data.activities?.length ? (
              data.activities.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No activity logged yet.</li>
            )}
          </ul>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    marginLeft: "220px",
    padding: "24px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  loading: {
    padding: "40px",
    fontSize: "18px",
    color: "#e2e8f0",
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  profileCard: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  profileCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "26px",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700",
  },
  avatarText: {
    display: "block",
  },
  cardLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#94a3b8",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#f8fafc",
  },
  cardSubtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },
  profileDetails: {
    display: "grid",
    gap: "14px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "#1f2937",
    borderRadius: "12px",
    fontSize: "14px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#16a34a",
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: "12px",
  },
  summaryCard: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  summaryHeader: {
    marginBottom: "26px",
  },
  portalButton: {
    width: "100%",
    padding: "12px 18px",
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    marginBottom: "22px",
  },
  alertsCard: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "20px",
    color: "#cbd5e1",
  },
  activitySection: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  activityList: {
    marginTop: "16px",
    paddingLeft: "18px",
    listStyle: "disc",
    color: "#cbd5e1",
  },
};

export default Dashboard;
