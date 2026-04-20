import API from "./api";

export const loginUser = async (employeeId, password) => {
  try {
    const response = await API.post("/api/auth/login", {
      employeeId,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }

    console.error("auth.service login error:", error);
    return null;
  }
};