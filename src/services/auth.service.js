import API from "./api";

export const loginUser = async (employeeId, password) => {
  try {
    const response = await API.post("/api/auth/login", {
      employeeId,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};