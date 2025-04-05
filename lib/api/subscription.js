import { axiosInstance } from "../axios";


// Subscription API requests
export const updateUserSubscription = async (subscriptionData) => {
  try {
    const response = await axiosInstance.put(
      "/users/subscription",
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update subscription"
    );
  }
};