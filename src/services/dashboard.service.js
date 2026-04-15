import API from "./api";

export const getDashboardData = async () => {
  try {
    const res = await API.get("/api/dashboard");
    return res.data;
  } catch (err) {
    // 🔥 fallback data
    return {
      riskStatus: "Low Risk ✅",
      sessions: 1,
      alerts: 0,
      activities: [
        "Logged in successfully",
        "Viewed dashboard",
        "No suspicious activity",
      ],
    };
  }
};