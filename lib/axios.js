// lib/axios.js
"use client";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ai-chat-bot-assistant-server.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {});

    if (cookies.accessToken) {
      config.headers.Authorization = `Bearer ${cookies.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/auth/refresh");

        if (response.data.success) {
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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

export const logout = async () => {
  try {
    await axiosInstance.get("/auth/logout");
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "/login";
  }
};

// User profile API requests
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/users/profile", profileData);
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
     "https://ai-chat-bot-assistant-server.vercel.app/api/v1" ||
     process.env.NEXT_PUBLIC_API_BASE_URL;
  const redirectUrl = `${baseUrl}/auth/oauth/${provider}${
    email ? `?email=${encodeURIComponent(email)}` : ""
  }`;
  window.location.href = redirectUrl;
};
