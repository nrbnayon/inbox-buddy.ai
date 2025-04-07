// app\(main)\chat\page.js
import { cookies } from "next/headers";
import { ChatProvider } from "./components/ChatContext";
import ChatSection from "./components/ChatSection";

export default async function ChatPage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  return (
    <ChatProvider>
      <ChatSection accessToken={accessToken} />
    </ChatProvider>
  );
}
