import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Select, MenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Filter({ search, setSearch, handleSearch, filter, setFilter,fromDate,
  setFromDate,
  toDate,
  setToDate,
handleSearchButton ,
handleClearButton,
showSearch = true,
}) {


   const handleFilterChange = (value) => {
    setFilter(value);

    const today = dayjs();
    if (value === "thisMonth") {
      setFromDate(today.startOf("month"));
      setToDate(today.endOf("month"));
    } else if (value === "lastMonth") {
      setFromDate(today.subtract(1, "month").startOf("month"));
      setToDate(today.subtract(1, "month").endOf("month"));
    } else if (value === "thisWeek") {
      setFromDate(today.startOf("week"));
      setToDate(today.endOf("week"));
    }
  };
   
  return (
    <div className="flex space-x-2 items-center">
      {showSearch && (
      <div className="flex items-center min-w-[250px] rounded-md border border-gray-300 overflow-hidden">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search..."
          className="flex-grow px-3 py-2 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[#1a6f8b] hover:bg-[#155d73] text-white px-3 h-[40px]"
        >
          <SearchIcon />
        </button>
      </div>)}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex gap-2 items-center filter-daterange">
          <DatePicker
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
          />
          <span className="text-gray-600">-</span>
          <DatePicker
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
          />
        </div>
      </LocalizationProvider>
      <Select
        size="small"
        value={filter}
        // onChange={(e) => setFilter(e.target.value)}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="filter-daterange"
      >
        <MenuItem value="thisMonth">This Month</MenuItem>
        <MenuItem value="lastMonth">Last Month</MenuItem>
        <MenuItem value="thisWeek">This Week</MenuItem>
      </Select>
      <button className="bg-[#1a6f8b] text-white px-4 py-2 rounded"  onClick={handleSearchButton}>
        Search
      </button>
      <button className="bg-[#1a6f8b] text-white px-4 py-2 rounded" onClick={handleClearButton}>
        Clear
      </button>
    </div>
  );
}

export default Filter;
