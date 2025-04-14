import { axiosInstance } from "../axios";

// Authentication API requests
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axiosInstance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/users/profile", profileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await axiosInstance.delete("/users/me");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};

export const logout = async () => {
  try {
    await axiosInstance.get("/auth/logout");
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "/login";
  }
};

// Waiting list API requests
export const addToWaitingList = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/users/add-to-waiting-list",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to join waiting list"
    );
  }
};

export const checkWaitingListStatus = async (email) => {
  try {
    const response = await axiosInstance.get(
      `/users/waiting-list-status?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to check waiting list status"
    );
  }
};

export const getWaitingListStatus = async (email) => {
  try {
    const response = await axiosInstance.get(
      `/users/waiting-list-status?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to check waiting list status"
    );
  }
};

export const handleOAuthLogin = (provider, email) => {
  const baseUrl =
    "http://127.0.0.1:4000/api/v1" || process.env.NEXT_PUBLIC_API_BASE_URL;
  const redirectUrl = `${baseUrl}/auth/oauth/${provider}${
    email ? `?email=${encodeURIComponent(email)}` : ""
  }`;
  window.location.href = redirectUrl;
};

export const updateUserKeywords = async (keywords) => {
  try {
    const response = await axiosInstance.put("/users/keywords", { keywords });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update keywords"
    );
  }
};

export const addUserInbox = async (inboxData) => {
  try {
    const response = await axiosInstance.post("/users/add-inbox", inboxData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add inbox");
  }
};
