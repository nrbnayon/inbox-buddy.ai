"use client";
import { useState, useCallback } from "react";
import AdminListHeader from "./AdminListHeader";
import AdminListTable from "./AdminListTable";

export default function AdminListContainer() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdminAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <AdminListHeader onAdminAdded={handleAdminAdded} />
      <AdminListTable key={refreshKey} />
    </>
  );
}
