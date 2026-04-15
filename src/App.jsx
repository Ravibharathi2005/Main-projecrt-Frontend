import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDashboard from "./components/dashboard/UserDashboard";
import RiskStatus from "./components/dashboard/RiskStatus";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import RiskAlerts from "./components/monitoring/RiskAlerts";
import AccessDenied from "./pages/AccessDenied";
import ActivityLogs from "./components/monitoring/ActivityLogs";
import useActivityTracker from "./hooks/useActivityTracker";

function ActivityListener() {
  useActivityTracker();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ActivityListener />
      <Routes>
        {/* ✅ lowercase fix */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ USER dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
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

        {/* ✅ ADMIN dashboard */}
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

        <Route path="/denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;