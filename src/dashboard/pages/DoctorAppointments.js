import React from "react";
import Filter from "../../components/Filter";


function DoctorAppointmnets(isDrawerOpen){

    const [filter, setFilter] = React.useState("thisMonth");

    return(
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
            style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}
        >
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Patient Appointments
            </span>
            {/* <div className="flex items-center py-2 px-4 space-x-4 justify-end">
                <Filter
                    filter={filter}
                    setFilter={setFilter}
                />
            </div> */}
        </div>
    )
}
export default DoctorAppointmnets;