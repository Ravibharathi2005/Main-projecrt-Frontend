import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { 
  STORAGE_KEYS, 
  getSessionItem, 
  setSessionItem, 
  clearAllStorage 
} from "../utils/storage";
import { initSessionSync, startIdleTimer } from "../utils/sessionManager";
import { deriveRoleFromPosition } from "../utils/roleMapper";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionItem(STORAGE_KEYS.USER));
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(() => parseInt(getSessionItem(STORAGE_KEYS.TRUST_SCORE)) || 100);
  const [riskLevel, setRiskLevel] = useState(() => getSessionItem(STORAGE_KEYS.RISK_LEVEL, "LOW"));
  const [token, setToken] = useState(() => getSessionItem(STORAGE_KEYS.TOKEN));

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTrustScore(100);
    setRiskLevel("LOW");

    // Signal cross-tab logout
    localStorage.setItem(STORAGE_KEYS.FORCE_LOGOUT, Date.now().toString());
    
    clearAllStorage();
    
    // Smooth transition to login
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }, []);

  // Auth synchronization & Idle timer
  useEffect(() => {
    const cleanupSync = initSessionSync(logout);
    const cleanupIdle = startIdleTimer(logout);
    
    // Automatic termination on tab close
    const handleTabClose = () => {
      // Clear security markers before the tab is destroyed
      sessionStorage.removeItem(STORAGE_KEYS.MONITORING_SESSION);
      // We don't call logout() here as it would trigger a redirect on a closing tab, 
      // but sessionStorage already handles the clear.
    };

    window.addEventListener("beforeunload", handleTabClose);
    
    setLoading(false);
    
    return () => {
      cleanupSync();
      cleanupIdle();
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [logout]);

  const login = (data) => {
    const { token, employeeId, position, role: rawRole } = data;
    
    // SMART ROLE ASSIGNMENT: Prefer assigned role, fallback to derived position mapping
    const assignedRole = rawRole || deriveRoleFromPosition(position);
    
    const normalizedUser = {
      employeeId,
      name: data.name || "Enterprise User",
      role: assignedRole,
      position: position || "Staff",
      department: data.department || "Operations",
    };

    const trust = data.trustScore !== undefined ? data.trustScore : 100;
    const risk = data.riskLevel || "LOW";

    setUser(normalizedUser);
    setToken(token);
    setTrustScore(trust);
    setRiskLevel(risk);

    // Standardized Storage Persistence
    setSessionItem(STORAGE_KEYS.USER, normalizedUser);
    setSessionItem(STORAGE_KEYS.TOKEN, token);
    setSessionItem(STORAGE_KEYS.ROLE, assignedRole);
    setSessionItem(STORAGE_KEYS.EMPLOYEE_ID, employeeId);
    setSessionItem(STORAGE_KEYS.TRUST_SCORE, trust);
    setSessionItem(STORAGE_KEYS.RISK_LEVEL, risk);
    setSessionItem(STORAGE_KEYS.MONITORING_SESSION, "true");
  };

  const updateTelemetry = (score, risk) => {
    setTrustScore(score);
    setRiskLevel(risk);
    setSessionItem(STORAGE_KEYS.TRUST_SCORE, score);
    setSessionItem(STORAGE_KEYS.RISK_LEVEL, risk);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        trustScore,
        riskLevel,
        token,
        login,
        logout,
        updateTelemetry,
        isAuthenticated: Boolean(user && user.employeeId),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}