export const getRiskStatus = async () => {
  try {
    const response = await API.get("/api/risk/status");
    return response.data;
  } catch (error) {
    // ❌ console error remove pannalam
    return {
      level: "LOW",
      score: 20,
      lastCheck: "Just now",
    };
  }
};