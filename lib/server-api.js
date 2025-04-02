// lib/server-api.js
import axios from "axios";

export const serverAxios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ai-chat-bot-assistant-server.vercel.app/api/v1",
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
    return null;
  }
};
