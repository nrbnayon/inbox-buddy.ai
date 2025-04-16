"use client";
import { Button } from "@/components/ui/button";
import { RiAdminFill } from "react-icons/ri";

export default function AdminListHeader() {
  return (
    <div className="flex justify-between items-center w-full">
      <h2 className="text-2xl ml-6 mt-10 mb-5 font-bold flex gap-2">
        <RiAdminFill size={30} />
        Admins List:
      </h2>
      <Button variant="blueGradient"> + Add Admin</Button>
    </div>
  );
}
