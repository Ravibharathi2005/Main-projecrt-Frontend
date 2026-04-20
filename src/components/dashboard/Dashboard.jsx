import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { getDashboardData } from "../../services/dashboard.service";
import useActivityTracker from "../../hooks/useActivityTracker";

function Dashboard() {
  const { user, trustScore, riskLevel, alerts } = useContext(AuthContext);
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

  // Get risk color
  const getRiskColor = () => {
    switch (riskLevel) {
      case "CRITICAL":
        return "#dc2626";
      case "HIGH":
        return "#ea580c";
      case "MEDIUM":
        return "#eab308";
      case "LOW":
      default:
        return "#22c55e";
    }
  };

  // Get trust score color
  const getTrustColor = () => {
    if (trustScore >= 80) return "#22c55e";
    if (trustScore >= 50) return "#eab308";
    if (trustScore >= 20) return "#ea580c";
    return "#dc2626";
  };

  const allAlerts = [...(alerts || []), ...(data.alerts || [])];
  const criticalAlerts = allAlerts.filter(a => a.severity === "CRITICAL");
  const highAlerts = allAlerts.filter(a => a.severity === "HIGH");

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

          {/* Trust Score & Risk Card */}
          <div style={styles.trustRiskCard}>
            <div style={styles.trustScoreBox}>
              <div style={{ ...styles.scoreCircle, background: getTrustColor() }}>
                <div style={styles.scoreNumber}>{trustScore}</div>
                <div style={styles.scoreLabel}>Trust Score</div>
              </div>
              <div style={styles.scoreDetails}>
                <div style={styles.scoreDetailRow}>
                  <span>Risk Level</span>
                  <strong style={{ color: getRiskColor() }}>{riskLevel}</strong>
                </div>
                <div style={styles.scoreDetailRow}>
                  <span>Status</span>
                  <strong>{trustScore >= 80 ? "✓ Secure" : "⚠ Review Needed"}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts Summary Row */}
        <section style={styles.alertsSummaryRow}>
          <div style={styles.alertCard}>
            <div style={styles.alertCardHeader}>
              <span style={{ color: "#dc2626", fontSize: "20px" }}>🚨</span>
              <div>
                <p style={styles.alertCardLabel}>Critical Alerts</p>
                <p style={styles.alertCardCount}>{criticalAlerts.length}</p>
              </div>
            </div>
          </div>
          <div style={styles.alertCard}>
            <div style={styles.alertCardHeader}>
              <span style={{ color: "#ea580c", fontSize: "20px" }}>⚠️</span>
              <div>
                <p style={styles.alertCardLabel}>High Alerts</p>
                <p style={styles.alertCardCount}>{highAlerts.length}</p>
              </div>
            </div>
          </div>
          <div style={styles.alertCard}>
            <div style={styles.alertCardHeader}>
              <span style={{ color: "#22c55e", fontSize: "20px" }}>👥</span>
              <div>
                <p style={styles.alertCardLabel}>Total Users Monitored</p>
                <p style={styles.alertCardCount}>1</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Alerts Summary */}
        <section style={styles.summaryCard}>
          <div style={styles.summaryHeader}>
            <h2>Security Monitoring</h2>
            <p>Real-time user activity and risk monitoring</p>
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
              {allAlerts?.length > 0
                ? `${allAlerts.length} active alert${allAlerts.length === 1 ? "" : "s"}`
                : "No active alerts - System secure"}
            </p>
            {criticalAlerts.length > 0 && (
              <div style={styles.criticalWarning}>
                {criticalAlerts.length} CRITICAL alert{criticalAlerts.length === 1 ? "" : "s"} - Immediate action required!
              </div>
            )}
          </div>
        </section>

        {/* Recent Alerts */}
        {allAlerts.length > 0 && (
          <section style={styles.activitySection}>
            <h3>Active Alerts</h3>
            <ul style={styles.alertsList}>
              {allAlerts.slice(0, 5).map((alert, index) => (
                <li key={index} style={styles.alertItem}>
                  <span style={{ ...styles.alertSeverity, color: getRiskColor() }}>
                    {alert.severity}
                  </span>
                  <span>{alert.message || "Security alert"}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Recent Activity */}
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
    gridTemplateColumns: "1fr 1fr",
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
  trustRiskCard: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  trustScoreBox: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  scoreCircle: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    flexShrink: 0,
  },
  scoreNumber: {
    fontSize: "48px",
    fontWeight: "700",
  },
  scoreLabel: {
    fontSize: "12px",
    marginTop: "4px",
    opacity: 0.9,
  },
  scoreDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  },
  scoreDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#1f2937",
    borderRadius: "10px",
    fontSize: "14px",
  },
  alertsSummaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  alertCard: {
    background: "#111827",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  alertCardHeader: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  alertCardLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "0",
    textTransform: "uppercase",
  },
  alertCardCount: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "4px 0 0",
    color: "#f8fafc",
  },
  summaryCard: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "24px",
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
  criticalWarning: {
    marginTop: "12px",
    padding: "12px",
    background: "#7f1d1d",
    color: "#fca5a5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
  },
  activitySection: {
    background: "#111827",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  alertsList: {
    marginTop: "16px",
    paddingLeft: "0",
    listStyle: "none",
    color: "#cbd5e1",
  },
  alertItem: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    borderLeft: "3px solid",
    borderLeftColor: "#0ea5e9",
    marginBottom: "8px",
    background: "#1f2937",
    borderRadius: "6px",
    fontSize: "13px",
  },
  alertSeverity: {
    fontWeight: "700",
    minWidth: "80px",
  },
  activityList: {
    marginTop: "16px",
    paddingLeft: "18px",
    listStyle: "disc",
    color: "#cbd5e1",
  },
};

export default Dashboard;
