// lib/server-api.js
import axios from "axios";

export const serverAxios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://server.inbox-buddy.ai/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUserData = async (token) => {
  try {
    const response = await serverAxios.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Throw the error so it can be properly handled by the caller
    throw error;
  }
};
