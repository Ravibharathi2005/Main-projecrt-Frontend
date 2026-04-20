import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import RiskStatus from "./components/dashboard/RiskStatus";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import RiskAlerts from "./components/monitoring/RiskAlerts";
import AccessDenied from "./pages/AccessDenied";
import ActivityLogs from "./components/monitoring/ActivityLogs";
import Profile from "./pages/Profile";
import useActivityTracker from "./hooks/useActivityTracker";

function ActivityListener() {
  useActivityTracker();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActivityListener />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/risk"
            element={
              <ProtectedRoute>
                <RiskStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <RiskAlerts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-logs"
            element={
              <ProtectedRoute role="ADMIN">
                <ActivityLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/denied" element={<AccessDenied />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;