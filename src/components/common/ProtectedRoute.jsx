import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/denied" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;