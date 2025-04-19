// lib/api/subscription.js
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
    return response.data.data.subscription;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription"
    );
  }
};

// Cancel current subscription
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

// Get subscription usage statistics
export const getSubscriptionUsage = async () => {
  try {
    const response = await axiosInstance.get("/users/subscription/usage");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch usage statistics"
    );
  }
};
