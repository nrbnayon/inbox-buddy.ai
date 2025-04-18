import { getUserData } from "@/lib/server-api";
import AdminListContainer from "./components/AdminListContainer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ManageAdminPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken");

  // Handle if token doesn't exist
  if (!token?.value) {
    redirect("/admin");
  }

  const res = await getUserData(token.value);

  const user = res.data;

  if (user?.role !== "super_admin") {
    redirect("/admin");
  }

  return <AdminListContainer />;
}
