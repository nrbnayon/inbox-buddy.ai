import { cookies } from "next/headers";
import UserPageContainer from "./components/UserPageContainer";

export default async function usersPage() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("accessToken").value;
  return <UserPageContainer accessToken={token} />;
}
