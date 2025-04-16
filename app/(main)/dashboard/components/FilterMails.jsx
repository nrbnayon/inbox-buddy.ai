// app\(main)\dashboard\components\FilterMails.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { KeywordSelector } from "./KeywordSelector";
import { SelectComponent } from "../../../../components/SelectComponent";
import { DatePicker } from "@/components/DatePicker";
import SearchBar from "./SearchBar";

const timePeriods = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this week" },
  { label: "Last Week", value: "last week" },
  { label: "This Month", value: "this month" },
  { label: "Last Month", value: "last month" },
  { label: "This Year", value: "this year" },
  { label: "Last Year", value: "last year" },
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
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleDateChange = useCallback(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date <= today) {
        setSelectedDate(date);
        if (timePeriod !== "all") {
          setTimePeriod("all");
          if (onTimePeriodChange) onTimePeriodChange("all");
        }
        if (onDateChange) onDateChange(date);
      }
    },
    [onDateChange, onTimePeriodChange, timePeriod]
  );

  const handleTimePeriodChange = useCallback(
    (period) => {
      setTimePeriod(period);
      if (selectedDate && period !== "all") {
        setSelectedDate(null);
      }
      if (onTimePeriodChange) onTimePeriodChange(period);
    },
    [onTimePeriodChange, selectedDate]
  );

  const handleKeywordChange = useCallback(
    (keywords) => {
      if (onKeywordChange) onKeywordChange(keywords);
    },
    [onKeywordChange]
  );

  const maxDate = new Date();

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 2xl:grid-cols-4 gap-2 pb-4'>
      <div className='col-span-2 md:col-span-1'>
        <SearchBar onSearch={handleSearchChange} />
      </div>
      <DatePicker
        onDateChange={handleDateChange}
        maxDate={maxDate}
        selected={selectedDate}
        isClearable={true}
        placeholderText='Select specific date'
      />
      <SelectComponent
        title='Select Time Period'
        label='Time Periods'
        className='border'
        seperator={true}
        options={timePeriods}
        onChange={handleTimePeriodChange}
        defaultValue='all'
        value={timePeriod}
      />
      <KeywordSelector onKeywordChange={handleKeywordChange} />
    </div>
  );
}