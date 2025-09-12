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
import { useAuth } from "../../context/AuthContext";

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
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const { user } = useAuth();

    const rowsPerPage = 6;
    const { getDoctor } = useDoctorApi();
    const { getPatients } = useAppointmentApi();

    const isFormValid = appointment?.date && appointment?.time_slot?.start && appointment?.time_slot?.end && appointment?.visit_type && (appointment?.patient_id );
    const { createAppointment, getAppointments, updateAppointment } = useAppointmentApi();
    const today = new Date();


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

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data)
        } catch (err) {
            console.log("Error fetching staff:", err);

        }
    };
    const toMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };
    function mergeSlots(slots) {
        slots.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
      
        const merged = [];
        let current = slots[0];
      
        for (let i = 1; i < slots.length; i++) {
          const next = slots[i];
          if (toMinutes(next.start) <= toMinutes(current.end)) {
            // overlapping or continuous → merge
            current.end = next.end > current.end ? next.end : current.end;
          } else {
            merged.push(current);
            current = next;
          }
        }
        merged.push(current);
        return merged;
      }
      
    const validateAppointment = () => {
        if (!appointment?.date || !appointment?.time_slot?.start || !appointment?.time_slot?.end) {
            showAlert("Please select a valid date and time slot!", "warning");
            return false;
        }

        const matchingSlot = allBookings.find((slot) => slot.date === appointment.date);

        if (!matchingSlot ||
            ((!matchingSlot.slots?.available?.length || matchingSlot.slots.available.length === 0) &&
                (!matchingSlot.slots?.booked?.length || matchingSlot.slots.booked.length === 0))) {
            return true; // no restrictions
        }

        const { start, end } = appointment.time_slot;

        // Convert to minutes for easier comparison
     
        const apptStart = toMinutes(start);
        const apptEnd = toMinutes(end);

        console.log(matchingSlot)
        // 1. Check overlap with already booked slots
        const isOverlapping = matchingSlot.slots.booked.some((b) => {
            if (appointment?._id && b.id?.toString() === appointment._id.toString()) {
                return false;
            }
            const bookedStart = toMinutes(b.start);
            const bookedEnd = toMinutes(b.end);
            return !(apptEnd <= bookedStart || apptStart >= bookedEnd); // overlap check
        });

        if (isOverlapping) {
            showAlert(
                `The selected time overlaps with an existing appointment for Dr. ${selectedDoctor?.firstname || ""} on ${dayjs(appointment.date).format("D MMMM, YYYY")}.`,
                "error"
            );
            return false;
        }

        // 2. Check if inside available slots
        // const isInsideAvailable = matchingSlot.slots.available.some((a) => {
        //     const availableStart = toMinutes(a.start);
        //     const availableEnd = toMinutes(a.end);

        //     console.log(availableStart, ">av start")
        //     console.log(availableEnd, ">av end")
        //     console.log(apptStart, apptEnd, ">LOO appointmnet ")
        //     return apptStart >= availableStart && apptEnd <= availableEnd;
        // });
        let effectiveAvail = [...(matchingSlot.slots.available || [])];

        

        if (appointment?._id) {
            const oldBooked = matchingSlot.slots.booked.find(
                (b) => b.id?.toString() === appointment._id.toString()
            );

            console.log(oldBooked,">> old one ")
            if (oldBooked) {
                // add the old slot back into available so the user can reuse it or change within
                effectiveAvail.push({ start: oldBooked.start, end: oldBooked.end });
            }
        }
console.log(effectiveAvail,">>> effective availble")
        // 3. Check if new time slot falls into any of the effective available slots
        const mergedAvail = mergeSlots(effectiveAvail);
        const isInsideEffectiveAvailable = mergedAvail.some((a) => {
            const availableStart = toMinutes(a.start);
            const availableEnd = toMinutes(a.end);

            console.log(availableStart, "> av effective start");
            console.log(availableEnd, "> av effective end");
            console.log(apptStart, apptEnd, "> new appointment times");

            return apptStart >= availableStart && apptEnd <= availableEnd;
        });

        console.log(isInsideEffectiveAvailable, "ppp")
        if (!isInsideEffectiveAvailable) {
            showAlert(
                `Dr. ${selectedDoctor?.firstname || ""} is not available for ${start}–${end} on ${dayjs(appointment.date).format("D MMMM, YYYY")}`,
                "error"
            );
            return false;
        }

        return true; // ✅ validation passed
    };

    const submitForm = async () => {
        try {
            if (!validateAppointment()) return; // ⛔ stop if invalid
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
            let result;
            if (appointment?._id) {
                result = await updateAppointment({ reference_id: appointment?._id, ...payload })
                console.log("edit appt")
            } else {
                result = await createAppointment(payload);
            }

            await handleGetAppointments(selectedDoctor)

            showAlert("Appointment created successfully!", "success");
            console.log("API Response:", result);
            setAppointment(null)
        } catch (error) {
            console.error("Error creating appointment:", error);
            showAlert("Failed to create appointment!", "error");
        }
    };
    const handleGetAppointments = async (staffPayload, newDate) => {
        try {
            const staff = staffPayload !== null ? staffPayload : selectedDoctor
            console.log(newDate, ">>> new data")

            const targetDate = newDate ? dayjs(newDate) : dayjs(); // use newDate or current date
            const from_date = targetDate.startOf("month").format("YYYY-MM-DD");
            const to_date = targetDate.endOf("month").format("YYYY-MM-DD");
            const result = await getAppointments(staff?._id, from_date, to_date);
            setAllBookings(result);


            const mappedEvents = result.flatMap((day) => {
                return day.events.map((event) => {
                    const [startHour, startMinute] = event.start.split(":").map(Number);
                    const [endHour, endMinute] = event.end.split(":").map(Number);

                    const baseDate = dayjs(day.date);

                    return {
                        ...event,
                        title: event.title,
                        start: baseDate.hour(startHour).minute(startMinute).toDate(),
                        end: baseDate.hour(endHour).minute(endMinute).toDate(),
                        type: event.type,
                        status: event.status,
                        date: baseDate
                    };
                });
            });

            setCalendarEvents(mappedEvents)
            setSelectedDoctor(staff);
            setIsModalOpen(true);

        } catch (error) {
            console.error("Error getting appointments:", error);
            showAlert("Failed to get appointments!", "error");
        }
    }
    const handleOnSelectEvent = (event) => {
        console.log(event, ">> ll")

        const isoDate = dayjs(event.date).format("YYYY-MM-DD"); // store in state

        setAppointment({
            _id: event?.id,
            date: isoDate,
            time_slot: {
                start: dayjs(event?.start).format("HH:mm"),
                end: dayjs(event?.end).format("HH:mm")
            },
            visit_type: event?.visit_type,
            patient_id: event?.patient_id
        });
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
                title={`${appointment?._id ? `Book Appointment - Dr. ${selectedDoctor?.firstname || ""}` : 'Edit Appointment'} `}
                modalClassName="mt-10"
            >
                <div className="flex gap-4">
                    <div className="w-[700px]">
                        <CustomCalendar
                            // events={dummyEvents}
                            events={calendarEvents}
                            onSelectSlot={(slot) => {
                                if (slot.start < today.setHours(0, 0, 0, 0)) {
                                    return; // 🚫 prevent selecting past dates
                                }
                                const isoDate = dayjs(slot.start).format("YYYY-MM-DD"); // store in state
                                setAppointment({
                                    date: isoDate,
                                    time_slot: {},
                                    visit_type: "",
                                    ...(user?.role === 1 && {
                                        patient_id: user._id,
                                        patient_name: `${user.firstname} ${user.lastname}`,
                                    }),
                                });
                            }}
                            onSelectEvent={handleOnSelectEvent}
                            onNevigate={handleGetAppointments}
                        />
                    </div>
                    {appointment && (
                        <div className="w-[300px] bg-white rounded shadow-sm border border-[#eee] px-4 py-2">
                            <div className="flex justify-between">
                                <p className="text-[18px] font-semibold text-[#1a6f8b]">{`${appointment?._id ? 'Edit Appointment' : 'Book Appointment'}`}</p>
                                <span
                                    onClick={() => setAppointment(null)}
                                    className="cursor-pointer"
                                >
                                    <CloseIcon className="text-[#1a6f8b]" />
                                </span>
                            </div>
                            <form className="space-y-3 pt-2"
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
                                {(() => {
                                    const matchingSlot = allBookings.find(
                                        (slot) => slot.date === appointment?.date
                                    );

                                    if (!matchingSlot) return null;

                                    return (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 text-left ">
                                                    Available Slots
                                                </label>
                                                <div className="mt-1 max-h-[44px] overflow-y-auto border border-gray-300 rounded p-2 flex gap-1">
                                                    {matchingSlot.slots.available.length > 0 ? (
                                                        matchingSlot.slots.available.map((slot, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="px-1 py-0.5 w-fit rounded bg-blue-100 text-blue-800 border border-blue-400 text-xs cursor-pointer hover:bg-blue-200"

                                                            >
                                                                {slot.start} - {slot.end}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No available slots</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 text-left">
                                                    Booked Slots
                                                </label>
                                                <div className="mt-1 max-h-[44px] overflow-y-auto border border-gray-300 rounded p-2 gap-1 flex">
                                                    {matchingSlot.slots.booked.length > 0 ? (
                                                        matchingSlot.slots.booked.map((slot, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="px-1 py-0.5 w-fit rounded bg-green-100 text-green-800 border border-green-400 text-xs cursor-pointer hover:bg-green-200"
                                                            >
                                                                {slot.start} - {slot.end}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No booked slots</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
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
                                {user?.role === 2 && (
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
                                    </div>)}
                                {user?.role === 1 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left">
                                            Select Patient
                                        </label>
                                        <div className="flex gap-4 items-center">
                                            <label className="flex items-center gap-1 text-[13px] cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="patientOption"
                                                    value="self"
                                                    checked={appointment?.patient_name === `${user.firstname} ${user.lastname}`}
                                                    onChange={() => {
                                                        setAppointment((prev) => ({
                                                            ...prev,
                                                            patient_id: user._id,
                                                            patient_name: `${user.firstname} ${user.lastname}`,
                                                        }));
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                                {user.firstname} {user.lastname}
                                            </label>
                                            <label className="flex items-center gap-1 text-[13px] cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="patientOption"
                                                    value="other"
                                                    checked={
                                                        appointment?.patient_name !== `${user.firstname} ${user.lastname}`
                                                    }
                                                    onChange={() => {
                                                        setAppointment((prev) => ({
                                                            ...prev,
                                                            patient_id: user._id,
                                                            patient_name: "",
                                                        }));
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                                Other
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            className="mt-2 block w-full rounded text-[14px] border border-gray-300 p-2"
                                            value={appointment?.patient_name || ""}
                                            onChange={(e) => {
                                                setAppointment((prev) => ({
                                                    ...prev,
                                                    patient_id: user._id,
                                                    patient_name: e.target.value,
                                                }));
                                            }}
                                            disabled={appointment?.patient_name === `${user.firstname} ${user.lastname}`}
                                            placeholder={
                                                appointment?.patient_name !== `${user.firstname} ${user.lastname}`
                                                    ? "Type patient name"
                                                    : ""
                                            }
                                            required={appointment?.patient_name !== `${user.firstname} ${user.lastname}`}
                                        />
                                    </div>
                                )}

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
                                        className={`px-4 py-1 rounded-md transition text-white bg-[#1a6f8b] ${isFormValid
                                                ? "hover:bg-[#15596e] cursor-pointer"
                                                : "cursor-not-allowed opacity-50"
                                            }`}
                                        disabled={!isFormValid}
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