import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { logActivity } from "../services/activity.service";

const pageMap = {
  "/dashboard": "Command Center",
  "/monitoring": "Telemetry Stream",
  "/profile": "Personnel Dossier",
  "/register": "Identity Registry",
  "/login": "Security Uplink",
  "/reports": "Reports Center",
  "/archives": "Archives",
  "/settings": "Settings"
};

const normalizeAction = (pathname) => {
  if (!pathname || pathname === "/") return "Visited home page";
  
  const cleanPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const pageName = pageMap[cleanPath];
  
  if (pageName) {
    return `Visited ${pageName}`;
  }
  return "Visited Unknown Page";
};

export default function useActivityTracker() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user?.employeeId) return;

    const action = normalizeAction(location.pathname);
    logActivity(user.employeeId, action, navigator.userAgent);
  }, [location.pathname, user]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "portalActivity" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.type === "PAGE_ACCESS" && data.page) {
            logActivity(data.employeeId || user?.employeeId, `PAGE_ACCESS: ${data.page}`, navigator.userAgent);
          }
        } catch (error) {
          console.error("Failed to parse portal activity", error);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user]);

  const trackButton = (buttonLabel) => {
    if (!user?.employeeId) return;

    const action = `Clicked ${buttonLabel || "button"} on ${location.pathname}`;
    logActivity(user.employeeId, action, navigator.userAgent);
  };

  return { trackButton };
}
