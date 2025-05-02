// lib/api/subscription.js
import { axiosInstance } from "../axios";

export const createCheckoutSession = async (plan) => {
  console.log("Creating checkout session for plan:", plan);
  try {
    const response = await axiosInstance.post(
      "/stripe/create-checkout-session",
      { plan }
    );

    console.log(response.data);
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

export const cancelAutoRenew = async () => {
  try {
    const response = await axiosInstance.post("/stripe/cancel-auto-renew");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel auto-renew"
    );
  }
};

export const enableAutoRenew = async () => {
  try {
    const response = await axiosInstance.post("/stripe/enable-auto-renew");

    return response.data;
  } catch (error) {
    // Extract error message from axios error
    throw new Error(
      error.response?.data?.message || "Failed to enable auto-renew"
    );
  }
};

export const verifySubscription = async () => {
  try {
    const response = await axiosInstance.post("/stripe/verify-session");

    return response.data;
  } catch (error) {
    // Extract error message from axios error
    throw new Error(
      error.response?.data?.message || "Failed to enable auto-renew"
    );
  }
};

// Admin-only functions
export const adminCancelUserSubscription = async (userId) => {
  try {
    const response = await axiosInstance.post(
      "/stripe/admin/cancel-user-subscription",
      { userId }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel user subscription"
    );
  }
};

export const adminGetUserSubscriptionEarnings = async (userId) => {
  try {
    const response = await axiosInstance.post(
      "/stripe/admin/total-earning-by-user-subscription",
      { userId }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to retrieve subscription earnings"
    );
  }
};
