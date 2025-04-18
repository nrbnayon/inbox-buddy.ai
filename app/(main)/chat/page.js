// app\(main)\chat\page.js
import { cookies } from "next/headers";
import ChatSection from "./components/ChatSection";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return <ChatSection accessToken={accessToken} />;
}
