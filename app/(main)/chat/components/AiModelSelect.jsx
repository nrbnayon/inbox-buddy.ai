// app\(main) \chat\components\AiModelSelect.js
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function AiModelSelect({
  title,
  label,
  options,
  seperator = false,
  className,
}) {
  return (
    // console.log("Selected model:::", ???); console not work

    <Select>
      <SelectTrigger
        className={cn(
          "w-full focus-visible:ring-0 outline-none shadow-none data-[placeholder]:text-[#101010] [&_svg:not([class*='text-'])]:text-[#101010] cursor-pointer",
          className
        )}
      >
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {seperator && <SelectSeparator />}
          {options?.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}

        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
