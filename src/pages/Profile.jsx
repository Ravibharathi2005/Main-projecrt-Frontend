import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

function Profile() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setProfileData(JSON.parse(savedUser));
    }
  }, [user]);

  if (!profileData) {
    return (
      <div style={styles.empty}>
        Authentication required to view profile.
      </div>
    );
  }

  const displayName =
    profileData.name ||
    profileData.fullName ||
    profileData.username ||
    profileData.employeeName ||
    profileData.employeeId ||
    "Unknown User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Navbar />
      <Sidebar />

      <main style={styles.page}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>{firstLetter}</div>

            <div>
              <p style={styles.sectionLabel}>PROFILE SUMMARY</p>
              <h1 style={styles.title}>{displayName}</h1>
              <p style={styles.subtitle}>{profileData.employeeId}</p>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span>Name</span>
              <strong>{displayName}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Employee ID</span>
              <strong>{profileData.employeeId || "-"}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Role</span>
              <strong>{profileData.role || "-"}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Department</span>
              <strong>{profileData.department || "-"}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Position</span>
              <strong>{profileData.position || "-"}</strong>
            </div>
          </div>
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
    background: "#0b1120",
    color: "#e2e8f0",
  },
  empty: {
    padding: "40px",
    color: "#cbd5e1",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px",
    borderRadius: "24px",
    background: "#111827",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    fontSize: "32px",
    fontWeight: "700",
  },
  sectionLabel: {
    margin: 0,
    color: "#94a3b8",
    letterSpacing: "1px",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  title: {
    margin: "10px 0 0",
    fontSize: "32px",
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },
  infoGrid: {
    display: "grid",
    gap: "16px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1f2937",
    borderRadius: "14px",
    padding: "18px 22px",
    fontSize: "15px",
    color: "#cbd5e1",
  },
};

export default Profile;