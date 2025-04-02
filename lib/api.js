import { axiosInstance } from "./axios";

// Chat API functions
export const sendChatMessage = async (message, file = null, modelId = null) => {
  try {
    const formData = new FormData();

    // Add message to form data
    formData.append("message", message || "");

    // Add file if provided
    if (file) {
      formData.append("file", file);
    }

    // Add model ID if provided - handle different object structures
    if (modelId) {
      console.log("Sending with model ID:", modelId);
      formData.append("modelId", modelId);
    }

    // Make the API request
    const response = await axiosInstance.post("/ai-assistant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

export const getAiModels = async () => {
  try {
    const response = await axiosInstance.get("/ai-models");
    return response.data;
  } catch (error) {
    console.error("Error fetching AI models:", error);
    // Return default models if API fails
    return [
      {
        id: "gpt-4",
        name: "GPT-4",
        description: "Most capable model for complex tasks",
        isDefault: false
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4.o Mini",
        description: "Fast and efficient for most tasks",
        isDefault: true
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Advanced reasoning and comprehension",
        isDefault: false
      },
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        description: "Balanced performance and efficiency",
        isDefault: false
      }
    ];
  }
};

export const getDefaultModel = async () => {
  try {
    const response = await axiosInstance.get("/ai-models/default");
    return response.data;
  } catch (error) {
    console.error("Error fetching default model:", error);
    // Return a default model if API fails
    return {
      id: "gpt-4o-mini",
      name: "GPT-4.o Mini",
      description: "Fast and efficient for most tasks",
      isDefault: true
    };
  }
};

export const clearChatContext = async () => {
  try {
    const response = await axiosInstance.delete("/ai-assistant/context");
    return response.data;
  } catch (error) {
    console.error("Error clearing chat:", error);
    throw new Error(error.response?.data?.message || "Failed to clear chat");
  }
};