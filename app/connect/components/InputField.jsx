// app\connect\components\InputField.jsx
"use client";
import { Input } from "@/components/ui/input";
import { createElement } from "react";

export default function InputField({
  icon,
  name,
  type,
  value,
  handleChange,
  placeHolder,
}) {
  return (
    <div className="relative">
      {createElement(icon, {
        className: "absolute left-3 top-4 h-5 w-5 text-[#98A2B3]",
      })}
      <Input
        name={name}
        type={type}
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        className="pl-10 focus-visible:ring-0 h-14 bg-[#F2F4F7]"
      />
    </div>
  );
}
