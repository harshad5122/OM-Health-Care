import React, { useEffect, useState } from "react";
import { useDoctorApi } from "../../api/doctorApi";
import {
    CircularProgress,
    Stack,
    Pagination,
} from "@mui/material";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"
import { LuPhone } from "react-icons/lu";
import ReusableModal from "../../components/ReusableModal";
import CustomCalendar from "../../components/Calander";
function AddAppointment({isDrawerOpen}){
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
     const [totalCounts, setTotalCounts] = useState(0);
     const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);  
    const rowsPerPage = 5;
    const { getDoctor } = useDoctorApi();
    const fetchStaff = async (skip) => {
        try {
            setLoading(true);
            const data = await getDoctor({ skip, limit: rowsPerPage, search, from_date: "",
                       to_date:"",}); 
            setStaffData(data?.rows);
            setTotalCounts(data?.total_count)

        } catch (err) {
            console.error("Error fetching staff:", err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };
    const handleChangePage = (event, value) => {
        setPage(value);
        const skip = (value - 1) * rowsPerPage
        fetchStaff(skip);
    };
    const dummyEvents = [
        {
            title: "Booked Appointment",
            start: new Date(2025, 8, 9, 10, 0),
            end: new Date(2025, 8, 9, 11, 0),
        },
    ];
    useEffect(() => {    
        fetchStaff(0);
        setPage(1)   
    }, []);
    return(
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
         style={{ height: "calc(100vh - 60px)",display:"flex",flexDirection:"column"}}
        >
            <ReusableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Book Appointment - Dr. ${selectedDoctor?.firstname || ""}`}
            >
                <CustomCalendar
                    events={dummyEvents}
                    onSelectSlot={(slot) => {
                        console.log("Selected empty slot:", slot);
                        // open slot booking form here
                    }}
                    onSelectEvent={(event) => {
                        console.log("Clicked booked event:", event);
                    }}
                />
            </ReusableModal>
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Book Appointment
            </span>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Stack sx={{ color: '#1a6f8b' }}>
                        <CircularProgress color="inherit" size="40px" />
                    </Stack>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-4">
                    {staffData.map((staff) => (
                        <div
                        key={staff._id}
                        className="bg-white shadow-md rounded-[12px] p-4 flex flex-col justify-between w-full border border-[#e0e0e0] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {console.log(staffData,"staffdata")}
                            <div className="flex-1 text-left space-y-1">
                                <span className="text-xl font-bold text-[#1a6f8b]">
                                    {staff.firstname} {staff.lastname}
                                </span>
                                <p className="text-sm text-gray-700">{staff.specialization}</p>
                                <p className="text-sm text-gray-700">
                                    {staff.professionalStatus === "experienced"
                                    ? `${staff.workExperience_totalYears} years experienced as a ${staff.workExperience_position}`
                                    : staff.professionalStatus}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {staff.qualification} - {staff.gender}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-[#8b8a8a]" />
                                    {staff.address}, {staff.city}, {staff.state}, {staff.country} - {staff.pincode}
                                </p>
                                 <div className="flex items-center gap-6 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <LuPhone className="text-[#8b8a8a]" fill="#8b8a8a" />
                                    {staff.countryCode} {staff.phone}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <FaEnvelope className="text-[#8b8a8a]" />
                                    {staff.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-[#1a6f8b] text-white px-4 py-2 rounded-lg hover:bg-[#15596e] transition"
                                onClick={() => {
                                    console.log("LL")
                                    setSelectedDoctor(staff);
                                    setIsModalOpen(true);
                                }}
                                >
                                Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            <div className="p-4 border-t flex justify-end">
                <Pagination
                    count={Math.ceil(totalCounts / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    className="member-pagination"
                />
            </div>
        </div>
    )
}
export default AddAppointment;