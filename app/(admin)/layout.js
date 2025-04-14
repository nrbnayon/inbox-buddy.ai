import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { serverAxios } from "@/lib/server-api";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  let user = null;

  if (token) {
    try {
      const res = await serverAxios.get("/users/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      user = res.data.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("auth");
      redirect("/login");
    }
  }

  console.log("ADMIN DATA::", user);

  return (
    <section className="bg-gray-100 min-h-screen overflow-hidden">
      {token && user ? (
        <AdminSidebar user={user} children={children} />
      ) : (
        <section className="h-[90vh] flex items-center justify-center">
          {children}
        </section>
      )}
    </section>
  );
}