import { axiosInstance } from "../axios";

// Keyword Management APIs

// Retrieve the user's keywords
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

// Add a single keyword
export const addUserKeyword = async (keyword) => {
  try {
    const response = await axiosInstance.post("/users/keywords", { keyword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add keyword");
  }
};

// Update (replace) the user's keyword list
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

// Delete a specific keyword
export const deleteUserKeyword = async (keyword) => {
  try {
    const response = await axiosInstance.delete(
      `/users/keywords/${encodeURIComponent(keyword)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete keyword"
    );
  }
};
