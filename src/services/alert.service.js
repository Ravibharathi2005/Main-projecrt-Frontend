import API from "./api";

export const getAlerts = async () => {
  try {
    const res = await API.get("/api/alerts");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};