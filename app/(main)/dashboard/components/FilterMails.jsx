"use client";
import React, { useState, useEffect, useCallback } from "react";
import { KeywordSelector } from "./KeywordSelector";
import { SelectComponent } from "../../../../components/SelectComponent";
import { DatePicker } from "@/components/DatePicker";
import SearchBar from "./SearchBar";

const timePeriods = [
  { label: "All", value: "all" },
  { label: "Today", value: "daily" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
];

export default function FilterMails({
  onSearch,
  onKeywordChange,
  onTimePeriodChange,
  onDateChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [timePeriod, setTimePeriod] = useState("all");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (onSearch) onSearch(searchQuery);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleDateChange = useCallback(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date && date <= today) {
        console.log("FilterMails date selected:", date);
        setSelectedDate(date);
        setTimePeriod("all"); // Reset to "all" when selecting a date
        if (onDateChange) onDateChange(date);
        if (onTimePeriodChange) onTimePeriodChange("all");
      } else {
        setSelectedDate(null);
        if (onDateChange) onDateChange(null);
      }
    },
    [onDateChange, onTimePeriodChange]
  );

  const handleTimePeriodChange = useCallback(
    (period) => {
      console.log("FilterMails time period selected:", period);
      setTimePeriod(period);
      if (selectedDate) {
        setSelectedDate(null);
        if (onDateChange) onDateChange(null);
      }
      if (onTimePeriodChange) onTimePeriodChange(period);
    },
    [onDateChange, selectedDate, onTimePeriodChange]
  );

  const handleKeywordChange = useCallback(
    (keywords) => {
      if (onKeywordChange) onKeywordChange(keywords);
    },
    [onKeywordChange]
  );

  const maxDate = new Date();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 2xl:grid-cols-3 gap-2 pb-4">
      <div className="col-span-2 2xl:col-span-1">
        <SearchBar placeHolder={"Search Users"} onSearch={handleSearchChange} />
      </div>
      {/* <DatePicker
        onDateChange={handleDateChange}
        maxDate={maxDate}
        selected={selectedDate}
        isClearable={true}
        placeholderText="Select specific date"
      /> */}
      <SelectComponent
        title="Select Time Period"
        label="Time Periods"
        className="border"
        seperator={true}
        options={timePeriods}
        onChange={handleTimePeriodChange}
        defaultValue="all"
        value={timePeriod}
      />
      <KeywordSelector onKeywordChange={handleKeywordChange} />
    </div>
  );
}
