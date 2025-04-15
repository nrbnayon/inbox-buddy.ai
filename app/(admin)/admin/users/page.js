import React from "react";
import UsersListTable from "./components/UsersListTable";

import UserPageHeader from "./components/UserPageHeader";

export default async function usersPage() {
  return (
    <>
      <UserPageHeader />
      <UsersListTable />
    </>
  );
}
