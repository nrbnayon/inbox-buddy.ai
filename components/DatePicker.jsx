"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker() {
  const [date, setDate] = React.useState();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate); // Set the selected date
    setIsOpen(false); // Close the popover
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "md:w-[240px] w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(true)} // Open the popover when button is clicked
        >
          <CalendarIcon color="black" />
          {date ? (
            format(date, "PPP")
          ) : (
            <span className="text-black">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Use custom handler to close popover
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
