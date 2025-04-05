import { axiosInstance } from "../axios";

// Keyword Management APIs
export const getUserKeywords = async () => {
  try {
    const response = await axiosInstance.get("/users/keywords");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch keywords"
    );
  }
};

export const updateUserKeywords = async (keywords) => {
  try {
    const response = await axiosInstance.put("/users/keywords", { keywords });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update keywords"
    );
  }
};
