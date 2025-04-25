"use client";

import { useState, useEffect } from "react";
import UserPageHeader from "./UserPageHeader";
import UsersListTable from "./UsersListTable";
import { getAllUsers } from "@/lib/api/user";

export default function UserPageContainer({ accessToken }) {
  const [query, setQuery] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [confirmedSearchQuery, setConfirmedSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(
        currentPage,
        6,
        "active",
        confirmedSearchQuery
      );

      console.log({ data });
      const normalUsers =
        data?.users.filter((usr) => usr.role === "user") || [];
      console.log("Normar users: ", normalUsers);
      setUsers(normalUsers || []);
      setTotalPages(data?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
      if (triggerSearch) {
        setTriggerSearch(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [triggerSearch, currentPage, confirmedSearchQuery]);

  const handleSearch = () => {
    setConfirmedSearchQuery(query);
    setCurrentPage(1);
    setTriggerSearch(true);
  };

  const handleClear = () => {
    setQuery("");
    setConfirmedSearchQuery("");
    setCurrentPage(1);
    setTriggerSearch(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleActionComplete = () => {
    fetchUsers();
  };

  return (
    <>
      <UserPageHeader
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      <UsersListTable
        users={users}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onActionComplete={handleActionComplete}
      />
    </>
  );
}
