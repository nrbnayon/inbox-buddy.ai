// lib\axios.js
// lib\axios.js
import { getTokensFromCookies } from "@/app/actions/authActions";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://server.inbox-buddy.ai/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Fixed template literal syntax
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { accessToken } = await getTokensFromCookies();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    } catch (error) {
      console.error("Error setting auth header:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get both tokens for the refresh attempt
        const { getTokensFromCookies } = await import("@/app/actions/authActions");
        const { accessToken, refreshToken } = await getTokensFromCookies();
        
        if (!refreshToken) {
          console.error("No refresh token available for token refresh");
          return Promise.reject(error);
        }

        // Use the refresh token to get a new access token
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://server.inbox-buddy.ai/api/v1";
        const response = await axios.post(
          `${apiBaseUrl}/auth/refresh`,
          { refreshToken },
          { 
            headers: { 
              "Content-Type": "application/json",
              "X-Refresh-Token": refreshToken  // Include refresh token in header
            },
            withCredentials: true
          }
        );
        
        if (response.data.success) {
          // Import setCookiesAction to update cookies
          const { setCookiesAction } = await import("@/app/actions/authActions");
          await setCookiesAction({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken || refreshToken
          });
          
          // Update the auth header with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);