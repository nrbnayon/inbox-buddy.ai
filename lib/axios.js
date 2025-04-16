// lib\axios.js
import { getTokensFromCookies } from "@/app/actions/authActions";
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
  async (config) => {
    const { accessToken } = await getTokensFromCookies();

    // console.log("token in axios instance: ", cookies);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const response = await axiosInstance.post("/auth/refresh");

//         if (response.data.success) {
//           originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
