/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hVl5q7YIHfe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({ query, placeHolder, onChangeHandle }) {
  return (
    <div className="flex items-center w-full md:w-[240px] mb-4 py-[1px] space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5">
      <IoIosSearch className="h-4 w-4" />
      <Input
        type="search"
        value={query}
        onChange={onChangeHandle}
        placeholder={placeHolder}
        className="w-full border-0 h-8 font-semibold focus-visible:ring-0 shadow-none placeholder:text-[#101010] placeholder:font-normal"
      />
    </div>
  );
}
