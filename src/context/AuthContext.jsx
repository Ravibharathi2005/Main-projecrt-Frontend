import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(100);
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [alerts, setAlerts] = useState([]);
  const [token, setToken] = useState(null);

  // Restore session on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const monitoringSession = localStorage.getItem("monitoringSession");
      const savedTrustScore = localStorage.getItem("trustScore");
      const savedRiskLevel = localStorage.getItem("riskLevel");
      const savedAlerts = localStorage.getItem("alerts");
      const savedToken = localStorage.getItem("token");

      if (savedUser && monitoringSession === "true") {
        setUser(JSON.parse(savedUser));
        setTrustScore(parseInt(savedTrustScore) || 100);
        setRiskLevel(savedRiskLevel || "LOW");
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts));
        }
        if (savedToken) {
          setToken(savedToken);
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);

      localStorage.removeItem("monitoringSession");
      localStorage.removeItem("user");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("trustScore");
      localStorage.removeItem("riskLevel");
      localStorage.removeItem("alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with enhanced security data
  const login = (data) => {
    const normalizedUser = {
      employeeId: data.employeeId || data.user?.employeeId || "",
      name: data.name || data.user?.name || "Monitoring User",
      role: data.role || data.user?.role || "EMPLOYEE",
      department: data.department || data.user?.department || "Security Operations",
      position: data.position || data.user?.position || "Security Analyst",
    };

    const trustScoreValue = data.trustScore !== undefined ? data.trustScore : 100;
    const riskLevelValue = data.riskLevel || "LOW";
    const alertsValue = data.alerts || [];
    const tokenValue = data.token || "";

    setUser(normalizedUser);
    setTrustScore(trustScoreValue);
    setRiskLevel(riskLevelValue);
    setAlerts(alertsValue);
    setToken(tokenValue);

    // Save auth data to localStorage
    localStorage.setItem("monitoringSession", "true");
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("employeeId", normalizedUser.employeeId);
    localStorage.setItem("role", normalizedUser.role);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("trustScore", trustScoreValue);
    localStorage.setItem("riskLevel", riskLevelValue);
    localStorage.setItem("alerts", JSON.stringify(alertsValue));

    // Temporary tab session
    localStorage.setItem("monitoringSession", "true");
  };

  // Update trust score
  const updateTrustScore = (newScore, newRiskLevel, newAlerts = []) => {
    setTrustScore(newScore);
    setRiskLevel(newRiskLevel);
    if (newAlerts && newAlerts.length > 0) {
      setAlerts(newAlerts);
      localStorage.setItem("alerts", JSON.stringify(newAlerts));
    }
    localStorage.setItem("trustScore", newScore);
    localStorage.setItem("riskLevel", newRiskLevel);
  };

  // Secure logout with complete session cleanup
  const logout = () => {
    // 1. Clear React auth state first
    setUser(null);
    setTrustScore(100);
    setRiskLevel("LOW");
    setAlerts([]);
    setToken(null);

    // 2. Send cross-tab logout signal BEFORE clearing session
    const logoutTimestamp = Date.now().toString();
    localStorage.setItem("forceLogout", logoutTimestamp);

    // 3. Clear all localStorage authentication data
    localStorage.removeItem("monitoringSession");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("trustScore");
    localStorage.removeItem("riskLevel");
    localStorage.removeItem("alerts");

    // 4. Clear all localStorage temporary data
    localStorage.removeItem("monitoringSession");
    localStorage.removeItem("portalUser");

    // 5. Clear any other potential auth-related keys
    localStorage.removeItem("authToken");
    localStorage.clear();

    // 6. Small delay to ensure signal propagation, then redirect
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        trustScore,
        riskLevel,
        alerts,
        token,
        login,
        logout,
        updateTrustScore,
        isAuthenticated: Boolean(user && user.employeeId),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}