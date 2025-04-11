// app\(main)\chat\page.js
import { cookies } from "next/headers";
import ChatSection from "./components/ChatSection";

export default async function ChatPage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  return <ChatSection accessToken={accessToken} />;
}
