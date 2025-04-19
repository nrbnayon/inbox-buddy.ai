import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { serverAxios } from "@/lib/server-api";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  let user = null;

  if (token?.value) {
    try {
      const res = await serverAxios.get("/users/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      console.log(res.data);
      user = res.data.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("auth");
      redirect("/login");
    }
  }

  return (
    <section className="bg-gray-100">
      {token?.value && user ? (
        <AdminSidebar children={children} accessToken={token?.value} />
      ) : (
        <section className="h-[90vh] flex items-center justify-center">
          {children}
        </section>
      )}
    </section>
  );
}
