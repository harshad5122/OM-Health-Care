import React, { useEffect, useState } from "react";
import { useDoctorApi } from "../../api/doctorApi";
function AddAppointment({isDrawerOpen}){
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const rowsPerPage = 5;
    const { getDoctor } = useDoctorApi();
    const fetchStaff = async (skip) => {
        try {
            setLoading(true);
            const data = await getDoctor({ skip, limit: rowsPerPage, search, from_date: "",
                       to_date:"",}); 
            setStaffData(data?.rows);

        } catch (err) {
            console.error("Error fetching staff:", err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {    
        fetchStaff(0);
        setPage(1)   
    }, []);
    return(
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
         style={{ height: "calc(100vh - 60px)",display:"flex",flexDirection:"column"}}
        >
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Book Appointment
            </span>
           <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                {staffData.map((staff) => (
                <div
                    key={staff._id}
                    className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between"
                >
                    {/* Top section: details */}
                    <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {staff.firstname} {staff.lastname}
                    </h2>
                    <p className="text-sm text-gray-600">📞 {staff.phone}</p>
                    <p className="text-sm text-gray-600">🎓 {staff.qualification}</p>
                    <p className="text-sm text-gray-600">
                        💼 {staff.professionalStatus}
                    </p>
                    <p className="text-sm text-gray-600">
                        🏥 {staff.specialization}
                    </p>
                    <p className="text-sm text-gray-600">✉️ {staff.email}</p>
                    <p className="text-sm text-gray-600">
                        🌍 {staff.country}, {staff.city}
                    </p>
                    <p className="text-sm text-gray-600">⚧ {staff.gender}</p>
                    </div>

                    {/* Bottom section: button */}
                    <div className="flex justify-end mt-4">
                    <button className="bg-[#1a6f8b] text-white px-4 py-2 rounded-lg hover:bg-[#15596e] transition">
                        Book Appointment
                    </button>
                    </div>
                </div>
                ))}
           </div>
        </div>
    )
}
export default AddAppointment;