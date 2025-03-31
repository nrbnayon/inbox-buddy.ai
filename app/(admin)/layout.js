import Sidebar from "@/components/layout/Sidebar";
import { axiosInstance } from "@/lib/axios";
import { cookies, headers } from "next/headers";
import AdminSidebar from "./components/AdminSidebar";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  // console.log({ token: token.value });

  // const res = await axiosInstance.get("/users/me", {
  //   headers: { Authorization: `Bearer ${token.value}` },
  // });

  // const user = res.data.data;
  const user = {
    name: "Josh",
    email: "josh@gmail.com",
    profilePicture:
      "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <section className="bg-white overflow-hidden">
      {token ? (
        <AdminSidebar user={user} children={children} />
      ) : (
        <section className="h-[90vh] flex items-center justify-center">
          {children}
        </section>
      )}
    </section>
  );
}
