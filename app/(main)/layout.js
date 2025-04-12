// import Sidebar from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { cookies } from "next/headers";
import { getUserData } from "@/lib/server-api";
import LoadingPing from "@/components/LoadingPing";
import { getAllChats } from "../actions/chatActions";
import { ChatProvider } from "./contexts/ChatContext";

export default async function RootLayout({ children }) {
  // Await the cookies function
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  let user = null;
  let previousChats = [];

  if (token?.value) {
    try {
      const response = await getUserData(token.value);
      if (response && response.success) {
        user = response.data;

        // Only fetch chats if user is successfully authenticated
        const res = await getAllChats();
        if (res?.data?.success) {
          previousChats = res.data.data;
        }
      }
    } catch (error) {
      console.error("Failed to fetch user or chats:", error);
    }
  }

  // Render a fallback UI if user is not available
  if (!user) {
    return (
      <section className="bg-white">
        <LoadingPing />
        {children}
      </section>
    );
  }

  return (
    <ChatProvider>
      <section className="bg-white">
        <Sidebar accessToken={token} previousChats={previousChats}>
          {children}
        </Sidebar>
      </section>
    </ChatProvider>
  );
}
