import React, { useEffect, useState } from "react";
import { useDoctorApi } from "../../api/doctorApi";
import { useAppointmentApi } from "../../api/appointment";
import {
    CircularProgress,
    Stack,
    Pagination,
} from "@mui/material";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"
import { LuPhone } from "react-icons/lu";
import ReusableModal from "../../components/ReusableModal";
import CustomCalendar from "../../components/Calander";
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { showAlert } from "../../components/AlertComponent";

function AddAppointment({ isDrawerOpen }) {
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalCounts, setTotalCounts] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [patients, setPatients] = useState([]);
    const rowsPerPage = 5;
    const { getDoctor } = useDoctorApi();
    const { getPatients } = useAppointmentApi();
    const { createAppointment, getAppointments } = useAppointmentApi();

    const fetchStaff = async (skip) => {
        try {
            setLoading(true);
            const data = await getDoctor({
                skip, limit: rowsPerPage, search, from_date: "",
                to_date: "",
            });
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
    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data)
        } catch (err) {
            console.log("Error fetching staff:", err);

        }

    };
    const submitForm = async () => {
        try {
            const payload = {
                patient_id: appointment.patient_id,
                patient_name: appointment.patient_name,
                staff_id: selectedDoctor?._id || "",
                date: appointment.date,
                time_slot: {
                    start: appointment.time_slot.start,
                    end: appointment.time_slot.end,
                },
                visit_type: appointment.visit_type || "CLINIC",
            };

            const result = await createAppointment(payload);

            showAlert("Appointment created successfully!", "success");
            console.log("API Response:", result);
            setAppointment(null)
        } catch (error) {
            console.error("Error creating appointment:", error);
            showAlert("Failed to create appointment!", "error");
        }
    };
    const handleGetAppointments = async (staff) => {
        try {
            const result = await getAppointments(staff?._id);
            console.log(result, ">> result ")
            setSelectedDoctor(staff);
            setIsModalOpen(true);


        } catch (error) {
            console.error("Error creating appointment:", error);
            showAlert("Failed to create appointment!", "error");
        }
    }
    useEffect(() => {
        fetchStaff(0);
        setPage(1)
    }, []);
    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
            style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}
        >
            <ReusableModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setAppointment(null)
                }}
                title={`Book Appointment - Dr. ${selectedDoctor?.firstname || ""}`}
            >
                <div className="flex gap-4">
                    <div className="w-[700px]">
                        <CustomCalendar
                            events={dummyEvents}
                            onSelectSlot={(slot) => {
                                console.log("Selected empty slot:", slot);
                                const isoDate = dayjs(slot.start).format("YYYY-MM-DD"); // store in state
                                setAppointment({
                                    date: isoDate,
                                    time_slot: {},
                                    visit_type: ""
                                });
                            }}
                            onSelectEvent={(event) => {
                                console.log("Clicked booked event:", event);
                            }}
                        />
                    </div>
                    {appointment && (
                        <div className="w-[300px] bg-white rounded shadow-sm border border-[#eee] px-4 py-2">
                            <div className="flex justify-between">
                                <p className="text-[18px] font-semibold text-[#1a6f8b]">Book Appointment</p>
                                <span
                                    onClick={() => setAppointment(null)}
                                    className="cursor-pointer"
                                >
                                    <CloseIcon className="text-[#1a6f8b]" />
                                </span>
                            </div>
                            <form className="space-y-4 pt-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submitForm();
                                    console.log("Final Appointment Payload:", appointment);
                                }}
                            >
                                <div className="flex flex-col">
                                    <label className="block text-sm text-left font-medium text-gray-700">
                                        Selected Date
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                        value={appointment?.date ? dayjs(appointment.date).format("D MMMM, YYYY") : ""}
                                        readOnly
                                    />
                                </div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 appo-timepicker">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 text-left">
                                                Start Time
                                            </label>
                                            <TimePicker
                                                value={appointment?.time_slot?.start ? dayjs(appointment.time_slot.start, "HH:mm") : null}
                                                onChange={(newValue) => {
                                                    setAppointment((prev) => ({
                                                        ...prev,
                                                        time_slot: {
                                                            ...prev?.time_slot,
                                                            start: dayjs(newValue).format("HH:mm"),
                                                        },
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 text-left">
                                                End Time
                                            </label>
                                            <TimePicker
                                                value={appointment?.time_slot?.end ? dayjs(appointment.time_slot.end, "HH:mm") : null}
                                                onChange={(newValue) => {
                                                    setAppointment((prev) => ({
                                                        ...prev,
                                                        time_slot: {
                                                            ...prev?.time_slot,
                                                            end: dayjs(newValue).format("HH:mm"),
                                                        },
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                </LocalizationProvider>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">Select Patient</label>
                                    <select
                                        className="mt-1 block w-full rounded-md text-[14px] border border-gray-300 p-2"
                                        value={appointment?.patient_id || ""} // keep controlled
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            const selectedPatient = patients.find((p) => p._id === selectedId);

                                            if (selectedPatient) {
                                                setAppointment((prev) => ({
                                                    ...prev,
                                                    patient_id: selectedPatient._id,
                                                    patient_name: `${selectedPatient.firstname} ${selectedPatient.lastname}`,
                                                }));
                                            }
                                        }}
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map((patient) => (
                                            <option key={patient._id} value={patient._id}>
                                                {patient.firstname} {patient.lastname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">Visit Type</label>
                                    <select className="mt-1 block w-full rounded-md text-[14px] border border-gray-300 p-2"
                                        value={appointment?.visit_type || ""}
                                        onChange={(e) =>
                                            setAppointment((prev) => ({
                                                ...prev,
                                                visit_type: e.target.value.toUpperCase(),
                                            }))
                                        }
                                    >
                                        <option value="">Select visit type</option>
                                        <option value="HOME">Home Visit</option>
                                        <option value="CLINIC">Clinic Visit</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        className="px-4 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setAppointment(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#1a6f8b] text-white px-4 py-1 rounded-md hover:bg-[#15596e] transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
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
                                        onClick={() => handleGetAppointments(staff)}
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