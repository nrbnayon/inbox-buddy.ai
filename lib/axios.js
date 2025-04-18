// lib/axios.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ai-chat-bot-assistant-server.vercel.app/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies to be included
});

// Store for managing request retries
const refreshTokenPromise = null;
const MAX_RETRIES = 2;

axiosInstance.interceptors.request.use(
  async (config) => {
    // For requests that should skip auth (like login/refresh)
    if (config.skipAuth) {
      return config;
    }

    // Try to get token from cookies (works in browser)
    let accessToken = null;

    // In browsers, cookies are automatically handled
    // This is for explicit extraction if needed
    try {
      if (typeof document !== "undefined") {
        accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];
      }
    } catch (e) {
      console.error("Cookie extraction error:", e);
    }

    // Set authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or we've already tried to refresh, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // To prevent multiple refresh requests at the same time
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshAccessToken();
    }

    try {
      // Wait for the token refresh
      await refreshTokenPromise;
      originalRequest._retry = true;

      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Handle refresh failure
      console.error("Token refresh failed", refreshError);

      // Redirect to login if running in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login?session=expired";
      }

      return Promise.reject(refreshError);
    } finally {
      refreshTokenPromise = null;
    }
  }
);

/**
 * Refreshes the access token using the refresh token
 * @returns {Promise} Promise resolving to the new access token
 */
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {}, // The backend will extract the refresh token from cookies
      {
        withCredentials: true,
        skipAuth: true,
      }
    );

    if (response.data?.success) {
      return response.data.accessToken;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);

    // Clear cookies and storage on refresh failure
    if (typeof document !== "undefined") {
      // Clear any client-state indicating logged in status
      document.cookie = "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    throw error;
  }
}

export default axiosInstance;
