import React from "react";
import WaitingListTable from "./components/WaitingListTable";
import { FaUserClock } from "react-icons/fa6";

export default function waitingListPage() {
  return (
    <div>
      <h2 className="text-2xl ml-6 font-bold flex gap-2">
        <FaUserClock size={30} />
        User Waiting Lists:
      </h2>
      <WaitingListTable />
    </div>
  );
}
