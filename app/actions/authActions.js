// app\actions\authActions.js
"use server";

import { serverAxios } from "@/lib/server-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const joinWaitingListAction = async (formData) => {
  const res = await serverAxios.post("/users/add-to-waiting-list", formData);

  return res?.data;
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
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

    if (data.success) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("auth");
    }
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth");
    return { success: true, message: "Logged out locally" };
  }
};

export const loginAction = async (userData) => {
  const cookieStore = await cookies();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ai-chat-bot-assistant-server.vercel.app/api/v1";

  // console.log("api base url:::", apiBaseUrl);

  try {
    const res = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
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

export const setCookiesAction = async (tokens) => {
  const cookieStore = await cookies();

  try {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return { success: false, message: "Invalid tokens provided" };
    }

    await cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400,
      path: "/",
    });

    await cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2592000,
      path: "/",
    });

    await cookieStore.set("auth", "true", {
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

export const refreshTokenAction = async () => {
  const cookieStore = await cookies();
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

    const data = await res.json();

    if (data.success) {
      await cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400,
        path: "/",
      });

      if (data.refreshToken) {
        await cookieStore.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 2592000,
          path: "/",
        });
      }

      return { success: true, accessToken: data.accessToken };
    }

    return { success: false, message: data.message || "Token refresh failed" };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false, message: error.message };
  }
};

export const getTokensFromCookies = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return { accessToken, refreshToken };
};
