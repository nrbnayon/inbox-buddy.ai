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

    // console.log("Chat by id response: ", res?.data);
    return res;
  } catch (error) {
    console.log("Error during get chats by id", error);
    return error;
  }
};
