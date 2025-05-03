import { axiosInstance } from "../axios";

// Chat Message APIs
export const sendChatMessage = async (
  message,
  file = null,
  modelId = "gpt-4o",
  history = [],
  chatId = null
) => {
  try {
    const formData = new FormData();

    // Check if message is FormData or string
    if (message instanceof FormData) {
      const response = chatId
        ? await axiosInstance.post(`/ai-assistant/${chatId}`, message, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axiosInstance.post("/ai-assistant", message, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      return response.data;
    } else {
      formData.append("message", message || "");
      formData.append("maxResults", "5000");

      if (file) formData.append("file", file);
      if (modelId) formData.append("modelId", modelId);

      if (history && history.length > 0) {
        const formattedHistory = history
          .filter((item) => item && item.role && item.content !== undefined)
          .map((item) => ({ role: item.role, content: item.content }));

        if (formattedHistory.length > 0) {
          formData.append("history", JSON.stringify(formattedHistory));
        }
      }

      const endpoint = chatId ? `/ai-assistant/${chatId}` : "/ai-assistant";
      const response = await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    }
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

// Model Management APIs
export const getAvailableModels = async () => {
  try {
    const response = await axiosInstance.get("/ai-models");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch models");
  }
};

export const getDefaultModel = async () => {
  try {
    const response = await axiosInstance.get("/ai-models/default");
    return response.data;
  } catch (error) {
    console.error("Error fetching default model:", error);
    throw error;
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
