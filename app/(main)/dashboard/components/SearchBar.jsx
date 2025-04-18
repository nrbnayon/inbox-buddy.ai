// app\(main)\dashboard\components\SearchBar.jsx
"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center w-full md:w-[240px] mb-4 py-[1px] space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5">
      <SearchIcon className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Search Emails..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full border-0 h-8 font-semibold focus-visible:ring-0 shadow-none placeholder:text-[#101010] placeholder:font-normal"
      />
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}