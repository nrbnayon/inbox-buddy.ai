// app\(main)\chat\page.js
import { cookies } from "next/headers";
import { ChatProvider } from "../../contexts/ChatContext";
import ChatSection from "../components/ChatSection";
import { axiosInstance } from "@/lib/axios";
import SingleChatSection from "./components/SingleChatSection";
import { getChatById } from "@/app/actions/chatActions";

export default async function singleChatPage({ params }) {
  const cookieStore = await cookies();

  const { chatId } = await params;

  let msgsFromDb;

  if (chatId) {
    const res = await getChatById(chatId);
    msgsFromDb = res?.data?.data?.messages;
  }

  const accessToken = cookieStore.get("accessToken")?.value;

  return (
    <ChatProvider>
      <ChatSection
        accessToken={accessToken}
        chatId={chatId}
        msgFromDb={msgsFromDb}
      />
    </ChatProvider>
  );
}
