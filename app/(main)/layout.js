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
  if (token) {
    try {
      const response = await getUserData(token.value);
      if (response && response.success) {
        user = response.data;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  const res = await getAllChats();

  // console.log(res?.data);

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
        <Sidebar
          accessToken={token}
          previousChats={res?.data?.success ? res?.data?.data : []}
        >
          {children}
        </Sidebar>
      </section>
    </ChatProvider>
  );
}
