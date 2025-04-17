// lib\api\user.js
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

export const updateUserSubscription = async (subscriptionData) => {
  try {
    const response = await axiosInstance.put(
      "/users/subscription",
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update subscription"
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

// Admin: Waiting List Management
export const getAllWaitingListUsers = async (
  page = 1,
  limit = 10,
  status = ""
) => {
  try {
    const params = { page, limit };
    if (status) {
      params.status = status;
    }
    const response = await axiosInstance.get("/users/admin/waiting-list", {
      params,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch waiting list users"
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

// Note: getWaitingListStatus was redundant; reusing checkWaitingListStatus
export const getWaitingListStatus = async (email) => {
  return checkWaitingListStatus(email);
};

// Admin: User Management API requests
export const getAllUsers = async (
  page = 1,
  limit = 10,
  status,
  search = ""
) => {
  try {
    // Build query parameters dynamically
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (status) {
      queryParams.append("status", status);
    }

    if (search) {
      queryParams.append("search", encodeURIComponent(search));
    }

    const response = await axiosInstance.get(
      `/users/admin/users?${queryParams.toString()}`
    );

    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch all users"
    );
  }
};

export const createUser = async (userData) => {
  try {
    console.log(userData);
    const response = await axiosInstance.post("/users/admin/users", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(
      `/users/admin/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

// Admin: Financial Endpoints
export const getIncome = async () => {
  try {
    const response = await axiosInstance.get("/users/income");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch income");
  }
};

export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get("/users/stats");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user stats"
    );
  }
};

// Admin: Waiting List Management
export const approveWaitingList = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/users/waiting-list/approve",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to approve waiting list entry"
    );
  }
};

export const rejectWaitingList = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/users/waiting-list/reject",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reject waiting list entry"
    );
  }
};

// Admin: System Messages Management
export const getAllSystemMessages = async () => {
  try {
    const response = await axiosInstance.get("/users/admin/system-messages");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch system messages"
    );
  }
};

export const getSystemMessage = async (messageId) => {
  try {
    const response = await axiosInstance.get(
      `/users/admin/system-messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch system message"
    );
  }
};

export const createSystemMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post(
      "/users/admin/system-messages",
      messageData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create system message"
    );
  }
};

export const updateSystemMessage = async (messageId, messageData) => {
  try {
    const response = await axiosInstance.put(
      `/users/admin/system-messages/${messageId}`,
      messageData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update system message"
    );
  }
};

export const deleteSystemMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(
      `/users/admin/system-messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete system message"
    );
  }
};

// Admin: AI Model Management
export const getAllAiModels = async () => {
  try {
    const response = await axiosInstance.get("/users/admin/ai-models");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI models"
    );
  }
};

export const getAiModel = async (modelId) => {
  try {
    const response = await axiosInstance.get(
      `/users/admin/ai-models/${modelId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI model"
    );
  }
};

export const createAiModel = async (modelData) => {
  try {
    const response = await axiosInstance.post(
      "/users/admin/ai-models",
      modelData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create AI model"
    );
  }
};

export const updateAiModel = async (modelId, modelData) => {
  try {
    const response = await axiosInstance.put(
      `/users/admin/ai-models/${modelId}`,
      modelData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update AI model"
    );
  }
};

export const deleteAiModel = async (modelId) => {
  try {
    const response = await axiosInstance.delete(
      `/users/admin/ai-models/${modelId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete AI model"
    );
  }
};

export const handleOAuthLogin = (provider, email) => {
  const baseUrl =
    "http://192.168.10.32:4000/api/v1" || process.env.NEXT_PUBLIC_API_BASE_URL;
  const redirectUrl = `${baseUrl}/auth/oauth/${provider}${
    email ? `?email=${encodeURIComponent(email)}` : ""
  }`;
  window.location.href = redirectUrl;
};
