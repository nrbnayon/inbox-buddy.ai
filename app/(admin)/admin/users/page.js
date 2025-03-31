import React from "react";
import UsersListTable from "./components/UsersListTable";
import { FaUsers } from "react-icons/fa6";

export default function usersPage() {
  return (
    <div>
      <h2 className="text-2xl ml-6 font-bold flex gap-2">
        <FaUsers size={30} />
        All Users Lists:
      </h2>
      <UsersListTable />
    </div>
  );
}
