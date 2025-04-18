// lib/api/subscription.js
import { axiosInstance } from "../axios";

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

export const createCheckoutSession = async (plan) => {
  console.log("Creating checkout session for plan:", plan);
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

export const cancelSubscription = async () => {
  try {
    const response = await axiosInstance.post("/stripe/cancel-subscription");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel subscription"
    );
  }
};