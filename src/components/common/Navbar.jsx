import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={styles.nav}>
      <div>
        <p style={styles.brand}>Security Monitoring Portal</p>

        <p style={styles.userLabel}>
          {user?.name || "Monitoring User"}
        </p>

        <p style={styles.userId}>
          {user?.employeeId || "EMP-0000"}
        </p>
      </div>

      <button
        style={styles.logoutButton}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#0f172a",
    color: "#e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  brand: {
    margin: 0,
    fontSize: "14px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#94a3b8",
  },

  userLabel: {
    margin: "8px 0 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
  },

  userId: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#94a3b8",
  },

  logoutButton: {
    padding: "10px 18px",
    borderRadius: "999px",
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "0.2s ease",
  },
};

export default Navbar;