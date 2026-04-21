import API from "./api";

export const getAllUsers = async () => {
  try {
    const res = await API.get("/api/users");
    // If backend returns an array directly, use it, else try res.data.data
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (err) {
    console.error("User fetch error:", err);
    return [];
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const res = await API.put(`/api/users/${userId}/role`, { role });
    return res.data;
  } catch (err) {
    console.error("Update role error:", err);
    throw err;
  }
};

export const updateTrustScore = async (userId, trustScore) => {
  try {
    const res = await API.put(`/api/users/${userId}/trust`, { trustScore });
    return res.data;
  } catch (err) {
    console.error("Update trust error:", err);
    throw err;
  }
};
