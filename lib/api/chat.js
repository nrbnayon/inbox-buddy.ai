import { axiosInstance } from "../axios";

// Chat Message APIs
export const sendChatMessage = async (
  message,
  file = null,
  modelId = null,
  history = []
) => {
  try {
    const formData = new FormData();

    // Check if message is FormData or string
    if (message instanceof FormData) {
      // If message is FormData, use it directly
      const response = await axiosInstance.post("/ai-assistant", message, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // If message is string, create new FormData
      formData.append("message", message || "");

      // Set a default maxResults if not provided
      const maxResults = 5000;
      formData.append("maxResults", maxResults.toString());

      if (file) {
        formData.append("file", file);
      }

      if (modelId) {
        formData.append("modelId", modelId);
      }

      // Debug: Log exact history content before formatting
      console.log("Original history:", JSON.stringify(history));

      // Add conversation history if provided
      if (history && history.length > 0) {
        try {
          // Ensure the history format matches what the backend expects exactly
          const formattedHistory = [];

          // Only include valid entries with both role and content
          for (const item of history) {
            if (item && item.role && item.content !== undefined) {
              formattedHistory.push({
                role: item.role,
                content: item.content,
              });
            }
          }

          console.log("Formatted history:", JSON.stringify(formattedHistory));

          // Only append if we have valid entries
          if (formattedHistory.length > 0) {
            formData.append("history", JSON.stringify(formattedHistory));
          }
        } catch (formatError) {
          console.error("Error formatting history:", formatError);
          // If formatting fails, try without history
        }
      }

      console.log("Sending chat message with:", {
        message,
        file: file?.name,
        modelId,
        historyLength: history?.length,
        maxResults,
      });

      // Try with direct API call
      try {
        const response = await axiosInstance.post("/ai-assistant", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);

        // If there's a specific error message from the server, use it
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        // Otherwise, try again without history if that might be causing the issue
        console.log("Trying without history as fallback");
        const cleanFormData = new FormData();
        cleanFormData.append("message", message || "");
        cleanFormData.append("maxResults", maxResults.toString());

        if (file) {
          cleanFormData.append("file", file);
        }

        if (modelId) {
          cleanFormData.append("modelId", modelId);
        }

        try {
          const fallbackResponse = await axiosInstance.post(
            "/ai-assistant",
            cleanFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error("Fallback attempt also failed:", fallbackError);
          throw new Error(
            fallbackError.response?.data?.message || "Failed to send message"
          );
        }
      }
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
