import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function Leave(isDrawerOpen){
   const [isTimeEnabled, setIsTimeEnabled] = React.useState(false);
   const columns = ["Start Date", "End Date", "Reason"];

    return(
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
            style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}
        >
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Leave Management
            </span>
            <div className="px-4 flex flex-col gap-2 py-2 items-center flex-shrink-0">
                <span className="border border-[#f0f0f0] rounded bg-[#fcfcfc] px-4 py-2 flex flex-col gap-2 w-full">
                    <p className='text-left text-[15px] font-semibold text-[#1a6f8b] border-b border-[#f0f0f0] pb-1'>Apply Leave</p>
                    <span className="flex gap-4 items-center pt-2 pb-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex gap-4 items-center">
                                <span className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                        {isTimeEnabled ? "Start Date & Time" : "Start Date"}
                                    </label>
                                    <div className="flex gap-2 leave-calendar">
                                        <DatePicker
                                            slotProps={{ textField: { size: "small" } }}
                                        />
                                        {isTimeEnabled && (
                                        <TimePicker  
                                            slotProps={{ textField: { size: "small" } }}
                                        />
                                        )}
                                    </div>
                                </span>
                                <span className="flex flex-col leave-calendar">
                                    <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                        {isTimeEnabled ? "End Date & Time" : "End Date"}
                                    </label>
                                    <div className="flex gap-2">
                                        <DatePicker
                                            slotProps={{ textField: { size: "small" } }}
                                        />
                                        {isTimeEnabled && (
                                        <TimePicker
                                            slotProps={{ textField: { size: "small" } }}
                                        />
                                        )}
                                    </div>
                                </span>
                            </div>
                        </LocalizationProvider>
                        <span className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="includeTime"
                                checked={isTimeEnabled}
                                onChange={(e) => setIsTimeEnabled(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <label htmlFor="includeTime" className="text-sm text-gray-700 font-semibold cursor-pointer">
                                Hours of Availability
                            </label>
                        </span>
                    </span>
                    <span className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 text-left">Reason for Leave</span>
                        <textarea
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none text-[14px]"
                            rows="4"
                            placeholder="Enter your reason..."
                        />
                    </span>
                    <span className="flex gap-2 justify-end  my-2">
                        <button className="bg-[#1a6f8b] text-white px-4 py-1.5 rounded hover:bg-[#15596e] transition">
                            Apply Leave
                        </button>
                        <button className="bg-[#1a6f8b] text-white px-4 py-1.5 rounded hover:bg-[#15596e] transition">
                            Cancle
                        </button>
                    </span>

                </span>
                
                
            </div>
           <div className="px-4 flex-1 py-2 overflow-hidden">
                <div className="border border-[#f0f0f0] rounded bg-[#fcfcfc] w-full h-full flex flex-col">
                    <p className='text-left text-[15px] font-semibold text-[#1a6f8b] border-b border-[#f0f0f0] pb-1 px-4 py-2'>
                        Leave Records
                    </p>
                    <div className="flex-1 overflow-y-auto px-4 py-1">
                        <table className="min-w-full border-collapse">
                            <thead className="sticky top-0 bg-[#f5f7fa] z-10">
                                <tr>
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className="border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 text-left"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    <th className="border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 px-4 py-2 text-sm">2025-09-12</td>
                                    <td className="border border-gray-200 px-4 py-2 text-sm">2025-09-14</td>
                                    <td className="border border-gray-200 px-4 py-2 text-sm">Family Function</td>
                                    <td className="border border-gray-200 px-4 py-2 text-sm flex gap-2">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Leave;