import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Monitoring from "./pages/Monitoring";
import AdminPanel from "./pages/AdminPanel";
import Reports from "./pages/Reports";
import AccessDenied from "./pages/AccessDenied";
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
            path="/monitoring"
            element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
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

          {/* Fallback routes */}
          <Route
            path="/activity-logs"
            element={<Navigate to="/monitoring" replace />}
          />
          <Route
            path="/risk"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/alerts"
            element={<Navigate to="/monitoring" replace />}
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