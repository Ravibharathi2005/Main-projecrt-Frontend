import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const monitoringSession =
        localStorage.getItem("monitoringSession");

      if (savedUser && monitoringSession === "true") {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to restore session:", error);

      localStorage.removeItem("monitoringSession");
      localStorage.removeItem("user");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = (data) => {
    const normalizedUser = {
      employeeId:
        data.employeeId ||
        data.user?.employeeId ||
        "",

      name:
        data.name ||
        data.user?.name ||
        "Monitoring User",

      role:
        data.role ||
        data.user?.role ||
        "USER",

      department:
        data.department ||
        data.user?.department ||
        "Security Operations",

      position:
        data.position ||
        data.user?.position ||
        "Security Analyst",
    };

    setUser(normalizedUser);

    // Save auth data
    localStorage.setItem(
      "monitoringSession",
      "true"
    );
    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );
    localStorage.setItem(
      "employeeId",
      normalizedUser.employeeId
    );
    localStorage.setItem(
      "role",
      normalizedUser.role
    );
    localStorage.setItem(
      "token",
      data.token || ""
    );

    // Temporary tab session
    sessionStorage.setItem(
      "monitoringSession",
      "true"
    );
  };

  // Logout
  const logout = () => {
    // Clear React state
    setUser(null);

    // Clear localStorage
    localStorage.removeItem("monitoringSession");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Clear sessionStorage
    sessionStorage.removeItem(
      "monitoringSession"
    );
    sessionStorage.removeItem("portalUser");

    // Notify company website tabs
    localStorage.setItem(
      "forceLogout",
      Date.now().toString()
    );

    // Redirect
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(
          user && user.employeeId
        ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}