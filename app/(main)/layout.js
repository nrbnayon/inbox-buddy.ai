// import Sidebar from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/Sidebar";
import { cookies } from "next/headers";
import { getUserData } from "@/lib/server-api";
import LoadingPing from "@/components/LoadingPing";

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
    <section className="bg-white">
        <Sidebar user={user}>{children}</Sidebar>
    </section>
  );
}