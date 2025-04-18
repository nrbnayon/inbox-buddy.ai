// app/actions/authActions.js
"use server";

import { serverAxios } from "@/lib/server-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Add a user to the waiting list
 */
export const joinWaitingListAction = async (formData) => {
  const res = await serverAxios.post("/users/add-to-waiting-list", formData);
  return res?.data;
};

/**
 * Log out a user by clearing tokens and making logout API call
 */
export const logoutAction = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://ai-chat-bot-assistant-server.vercel.app/api/v1";

    const res = await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    // Always clear cookies, regardless of API response
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth");

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout failed:", error);
    // Still clear cookies on error
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth");
    return { success: true, message: "Logged out locally" };
  }
};

/**
 * Login user with email and password
 */
export const loginAction = async (userData) => {
  const cookieStore = cookies();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ai-chat-bot-assistant-server.vercel.app/api/v1";

  try {
    const res = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || `Login failed with status: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success) {
      // Set server cookies with appropriate security settings
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400,
        path: "/",
      });

      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 2592000,
        path: "/",
      });

      // Set a client-accessible cookie to indicate logged-in state
      cookieStore.set("auth", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400,
        path: "/",
      });

      return data;
    }
    throw new Error(data.message || "Login failed");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Set auth cookies after OAuth or other authentication flows
 */
export const setCookiesAction = async (tokens) => {
  const cookieStore = cookies();

  try {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return { success: false, message: "Invalid tokens provided" };
    }

    cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400,
      path: "/",
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2592000,
      path: "/",
    });

    cookieStore.set("auth", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to set cookies:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokenAction = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { success: false, message: "No refresh token available" };
  }

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://ai-chat-bot-assistant-server.vercel.app/api/v1";

    const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!res.ok) {
      // On refresh failure, clear cookies
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("auth");
      return {
        success: false,
        message: `Token refresh failed with status: ${res.status}`,
      };
    }

    const data = await res.json();

    if (data.success) {
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400,
        path: "/",
      });

      if (data.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 2592000,
          path: "/",
        });
      }

      return { success: true, accessToken: data.accessToken };
    }

    // Clear cookies on refresh failure
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth");
    return { success: false, message: data.message || "Token refresh failed" };
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear cookies on error
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth");
    return { success: false, message: error.message };
  }
};

/**
 * Get tokens from cookies (server-side only)
 */
export const getTokensFromCookies = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  return { accessToken, refreshToken };
};

/**
 * Check if user is authenticated (server-side)
 */
export const isAuthenticated = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return false;
  }

  // If only refresh token exists, try to refresh
  if (!accessToken && refreshToken) {
    const refreshResult = await refreshTokenAction();
    return refreshResult.success;
  }

  return true;
};
