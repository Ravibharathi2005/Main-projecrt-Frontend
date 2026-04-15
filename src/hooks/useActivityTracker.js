import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { logActivity } from "../services/activity.service";

const normalizeAction = (pathname) => {
  if (!pathname || pathname === "/") return "Visited home page";
  return `Visited ${pathname}`;
};

export default function useActivityTracker() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user?.employeeId) return;

    const action = normalizeAction(location.pathname);
    logActivity(user.employeeId, action, navigator.userAgent);
  }, [location.pathname, user]);

  const trackButton = (buttonLabel) => {
    if (!user?.employeeId) return;

    const action = `Clicked ${buttonLabel || "button"} on ${location.pathname}`;
    logActivity(user.employeeId, action, navigator.userAgent);
  };

  return { trackButton };
}
