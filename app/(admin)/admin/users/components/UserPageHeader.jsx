"use client";

import { FaUsers } from "react-icons/fa6";
import SearchBar from "@/app/(main)/dashboard/components/SearchBar";
import { Button } from "@/components/ui/button";

export default function UserPageHeader({ query, setQuery, onSearch, onClear }) {
  const handleQuery = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (!newQuery) {
      onClear();
    }
  };

  return (
    <div className="flex justify-between mt-10">
      <h2 className="text-2xl ml-6 font-bold flex gap-2">
        <FaUsers size={30} />
        All Users Lists:
      </h2>
      <div className="flex gap-2">
        <SearchBar
          placeHolder={"Search Users..."}
          query={query}
          setQuery={setQuery}
          onChangeHandle={handleQuery}
          onClear={onClear}
        />
        <Button
          variant="blueGradient"
          className="py-[1px] disabled:cursor-not-allowed"
          disabled={query?.length < 1}
          onClick={onSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
