import API from "./api";

export const logActivity = async (employeeId, action, device) => {
  if (!employeeId || !action) {
    console.warn("Skipping logActivity due to missing context", { employeeId, action });
    return;
  }

  const payload = {
    employeeId,
    action,
    device: device || navigator.userAgent || "unknown",
  };

  try {
    await API.post("/api/activity", payload);
  } catch (err) {
    console.error("Activity error", err);
  }
};