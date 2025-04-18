import BlockedUsersTable from "./components/BlockedUsersTable";
import { RiUserForbidFill } from "react-icons/ri";

export default function blockedUsersPage() {
  return (
    <div>
      <h2 className="text-2xl ml-6 mt-10 mb-5 font-bold flex gap-2">
        <RiUserForbidFill size={30} />
        Blocked Users:
      </h2>
      <BlockedUsersTable />
    </div>
  );
}
