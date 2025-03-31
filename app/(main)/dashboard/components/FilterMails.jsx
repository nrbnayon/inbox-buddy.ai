import React from "react";
import { KeywordSelector } from "./KeywordSelector";
import { SelectComponent } from "../../../../components/SelectComponent";
import { DatePicker } from "@/components/DatePicker";
import SearchBar from "./SearchBar";

const timePeriods = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];

export default function FilterMails() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 2xl:grid-cols-4 gap-2 pb-4">
      <div className="col-span-2 md:col-span-1">
        <SearchBar />
      </div>
      <DatePicker />
      <SelectComponent
        title="Select Time Period"
        label="Time Periods"
        className="border"
        seperator={true}
        options={timePeriods}
      />
      <KeywordSelector />
    </div>
  );
}
