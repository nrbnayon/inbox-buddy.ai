"use client";
import { FaUsers } from "react-icons/fa6";
import SearchBar from "@/app/(main)/dashboard/components/SearchBar";
import { useState } from "react";

export default function UserPageHeader() {
  const [query, setQuery] = useState("");

  console.log(query);
  return (
    <div className="flex justify-between">
      <h2 className="text-2xl ml-6 font-bold flex gap-2">
        <FaUsers size={30} />
        All Users Lists:
      </h2>
      <SearchBar
        placeHolder={"Search Users..."}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
}
