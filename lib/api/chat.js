// lib\api\chat.js
import { axiosInstance } from "../axios";

// Chat Message APIs
export const sendChatMessage = async (message, file = null, modelId = null) => {
  try {
    const formData = new FormData();
    formData.append("message", message);

    if (file) {
      formData.append("file", file);
    }

    if (modelId) {
      formData.append("modelId", modelId);
    }

    const response = await axiosInstance.post("/ai-assistant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Send message response::", response.data);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

// Model Management APIs
export const getAvailableModels = async () => {
  try {
    const response = await axiosInstance.get("/ai-models");
    console.log("Get available models::", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch models");
  }
};

export const getDefaultModel = async () => {
  try {
    const response = await axiosInstance.get("/ai-models/default");
    console.log("Get default model::", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching default model:", error);
  }
};

// Conversation Context APIs
export const getChatContext = async () => {
  try {
    const response = await axiosInstance.get("/ai-assistant/context");
    console.log("Get chat context::", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat context"
    );
  }
};

export const clearChatContext = async () => {
  try {
    const response = await axiosInstance.delete("/ai-assistant/context");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to clear chat context"
    );
  }
};

// Subscription Management APIs
export const createCheckoutSession = async (plan) => {
  try {
    const response = await axiosInstance.post(
      "/stripe/create-checkout-session",
      { plan }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create checkout session"
    );
  }
};

export const getUserSubscription = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data.subscription;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription"
    );
  }
};
