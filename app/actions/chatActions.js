"use server";

import { axiosInstance } from "@/lib/axios";

export const getAllChats = async () => {
  try {
    const res = await axiosInstance.get("/chats");

    return res;
  } catch (error) {
    console.log("Error during get all chats", error);
    return error;
  }
};

export const getChatById = async (chatId) => {
  try {
    const res = await axiosInstance(`/chats/${chatId}`);

    return res;
  } catch (error) {
    // console.log("Error during get chats by id", error);
    return error;
  }
};

export const updateChatById = async (chatId, name) => {
  try {
    console.log({ chatId, name });
    if (chatId) {
      const res = await axiosInstance.put(`/chats/${chatId}`, { name });

      return res.data;
    }
  } catch (error) {
    console.log("Error during update chat by id", error);
    return error;
  }
};

export const deleteChatById = async (chatId) => {
  try {
    console.log({ chatId });
    if (chatId) {
      const res = await axiosInstance.delete(`/chats/${chatId}`);

      return res.data;
    }
  } catch (error) {
    console.log("Error during update chat by id", error);
    return error;
  }
};
