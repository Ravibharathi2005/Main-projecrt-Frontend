import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div style={styles.sidebar}>
      <h3>Menu</h3>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/risk">Risk Status</Link>
        </li>

        {/* ✅ role check safe */}
        {user?.role === "ADMIN" && (
          <>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>

            <li>
              <Link to="/activity-logs">Activity Logs</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#eee",
    padding: "10px",
    position: "fixed",
  },
};

export default Sidebar;