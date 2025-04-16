// app\(main)\dashboard\components\FilterMails.jsx
"use client";
import React, { useState, useEffect } from "react";
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

export default function FilterMails({ onSearch, onKeywordChange, onTimePeriodChange, onDateChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (onSearch) onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) onDateChange(date);
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    if (onTimePeriodChange) onTimePeriodChange(period);
  };

  const handleKeywordChange = (keywords) => {
    if (onKeywordChange) onKeywordChange(keywords);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 2xl:grid-cols-4 gap-2 pb-4">
      <div className="col-span-2 md:col-span-1">
        <SearchBar onSearch={handleSearchChange} />
      </div>
      <DatePicker onDateChange={handleDateChange} />
      <SelectComponent
        title="Select Time Period"
        label="Time Periods"
        className="border"
        seperator={true}
        options={timePeriods}
        onChange={handleTimePeriodChange}
        defaultValue="monthly"
      />
      <KeywordSelector onKeywordChange={handleKeywordChange} />
    </div>
  );
}