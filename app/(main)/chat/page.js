// app\(main)\chat\page.js
import { cookies } from "next/headers";
import ChatSection from "./components/ChatSection";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/api/user";

export default async function ChatPage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const res = await getUserProfile(accessToken);

  if (!res?.data?._id) {
    return redirect("/login");
  }

  if (!accessToken) {
    redirect("/login");
  }

  return <ChatSection accessToken={accessToken} userData={res?.data} />;
}
