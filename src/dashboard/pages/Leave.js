import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function Leave(isDrawerOpen){
   const [isTimeEnabled, setIsTimeEnabled] = React.useState(false);

    return(
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
            style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}
        >
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Leave Management
            </span>
            <div className="px-2 flex flex-col gap-2 py-2">
                <span className="border border-[#f0f0f0] rounded bg-[#fcfcfc] px-2 py-2 flex flex-col">
                    <p className='text-left text-[15px] font-semibold text-[#1a6f8b] border-b border-[#f0f0f0] pb-1'>Apply Leave</p>
                    <span className="flex gap-4 items-center py-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex gap-4 items-center">
                                {/* Start Date & Time */}
                                <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                    {isTimeEnabled ? "Start Date & Time" : "Start Date"}
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
                                </div>

                                {/* End Date & Time */}
                                <div className="flex flex-col">
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
                                </div>
                            </div>
                        </LocalizationProvider>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="includeTime"
                                checked={isTimeEnabled}
                                onChange={(e) => setIsTimeEnabled(e.target.checked)}
                            />
                            <label htmlFor="includeTime" className="text-sm text-gray-700 font-semibold">
                                Hours of Availability
                            </label>
                        </div>
                    </span>

                </span>
                
            </div>
        </div>
    )
}
export default Leave;