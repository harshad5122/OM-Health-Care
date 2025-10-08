import React, { useEffect, useState } from "react";
import { useDoctorApi } from "../../api/doctorApi";
import { useAppointmentApi } from "../../api/appointment";
import {
    CircularProgress,
    Stack,
    Pagination,
    TextField
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
    const [eventType, setEventType] = useState(null);
    const [formDisabled, setFormDisabled] = useState(false);
    const { user } = useAuth();


    const rowsPerPage = 6;
    const { getDoctor } = useDoctorApi();
    const { getPatients } = useAppointmentApi();

    const isFormValid = appointment?.date && appointment?.time_slot?.start && appointment?.time_slot?.end && appointment?.visit_type && (appointment?.patient_id);
    const { createAppointment, getAppointments, updateAppointment } = useAppointmentApi();
    const today = new Date();


    const formatTime12Hour = (time24) => {
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert 0 to 12
        return `${hour}:${minute} ${ampm}`;
    };

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


        // After getting matchingSlot and before booked slot check
        const leaveEvents = (matchingSlot?.events || []).filter(e => e.type === "leave");
        const { start, end } = appointment.time_slot;

        // Convert to minutes for easier comparison

        const apptStart = toMinutes(start);
        const apptEnd = toMinutes(end);


        if (leaveEvents.length > 0) {
            for (let leave of leaveEvents) {
                if (leave.full_day) {
                    // full-day leave → doctor unavailable
                    showAlert(
                        `Dr. ${selectedDoctor?.firstname || ""} is on leave for the whole day (${dayjs(appointment.date).format("D MMMM, YYYY")}).`,
                        "error"
                    );
                    return false;
                } else {
                    // partial leave → check overlap
                    const leaveStart = toMinutes(leave.start);
                    const leaveEnd = toMinutes(leave.end);

                    if (!(apptEnd <= leaveStart || apptStart >= leaveEnd)) {
                        showAlert(
                            `Dr. ${selectedDoctor?.firstname || ""} is on leave from ${leave.start}–${leave.end} on ${dayjs(appointment.date).format("D MMMM, YYYY")}.`,
                            "error"
                        );
                        return false;
                    }
                }
            }
        }


        if (!matchingSlot ||
            ((!matchingSlot.slots?.available?.length || matchingSlot.slots.available.length === 0) &&
                (!matchingSlot.slots?.booked?.length || matchingSlot.slots.booked.length === 0))) {
            return true; // no restrictions
        }


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


            if (oldBooked) {
                // add the old slot back into available so the user can reuse it or change within
                effectiveAvail.push({ start: oldBooked.start, end: oldBooked.end });
            }
        }

        // 3. Check if new time slot falls into any of the effective available slots
        const mergedAvail = mergeSlots(effectiveAvail);
        const isInsideEffectiveAvailable = mergedAvail.some((a) => {
            const availableStart = toMinutes(a.start);
            const availableEnd = toMinutes(a.end);


            return apptStart >= availableStart && apptEnd <= availableEnd;
        });

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
            } else {
                result = await createAppointment(payload);
            }

            await handleGetAppointments(selectedDoctor)

            showAlert("Appointment created successfully!", "success");
            setAppointment(null)
        } catch (error) {
            console.error("Error creating appointment:", error);
            showAlert("Failed to create appointment!", "error");
        }
    };
    const handleGetAppointments = async (staffPayload, newDate) => {
        try {
            const staff = staffPayload !== null ? staffPayload : selectedDoctor

            const targetDate = newDate ? dayjs(newDate) : dayjs(); // use newDate or current date
            const from_date = targetDate.startOf("month").format("YYYY-MM-DD");
            const to_date = targetDate.endOf("month").format("YYYY-MM-DD");
            const result = await getAppointments(staff?._id, from_date, to_date);
            setAllBookings(result);


            const mappedEvents = result.flatMap((day) => {
                return day.events.map((event) => {
                    const [startHour, startMinute] = event?.start?.split(":").map(Number);
                    const [endHour, endMinute] = event?.end?.split(":").map(Number);

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

        let disableForm = false;

        if (event && user?.role === 1) {
            if (!(event.created_by === "USER" && event.creator === user?._id)) {
                disableForm = true;
            }
        }
        const isoDate = dayjs(event.date).format("YYYY-MM-DD"); 

        setAppointment({
            _id: event?.id,
            date: isoDate,
            time_slot: {
                start: dayjs(event?.start).format("HH:mm"),
                end: dayjs(event?.end).format("HH:mm")
            },
            visit_type: event?.visit_type,
            patient_id: event?.patient_id,
            patient_name:`${user?.firstname} ${user?.lastname}`,
        });
        setEventType(event?.type || null);
        setFormDisabled(disableForm);
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
                title={`${appointment?._id ? `Edit Appointment - ${selectedDoctor?.firstname || ""} ${selectedDoctor?.lastname || ""}`  : `Book Appointment - ${selectedDoctor?.firstname || ""} ${selectedDoctor?.lastname || ""}`} `}
                modalClassName="mt-10"
            >
                <div className="flex gap-4">
                    <div className="w-[700px]">
                        <CustomCalendar
                            // events={dummyEvents}
                            events={calendarEvents}
                            onSelectSlot={(slot) => {
                                if (slot.start < today.setHours(0, 0, 0, 0)) {
                                    return; 
                                }
                                const isoDate = dayjs(slot.start).format("YYYY-MM-DD");

                                setAppointment({
                                    date: isoDate,
                                    time_slot: {},
                                    visit_type: "",
                                    ...(user?.role === 1 && {
                                        patient_id: user._id,
                                        patient_name: `${user.firstname} ${user.lastname}`,
                                    }),
                                });
                                setEventType(null)
                                setFormDisabled(false);
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

                                {eventType !== "leave" && (() => {
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
                                                <div className="flex-wrap max-h-[44px] overflow-y-auto border border-gray-300 rounded py-2 px-2 flex gap-1">
                                                    {matchingSlot.slots.available.length > 0 ? (
                                                        matchingSlot.slots.available.map((slot, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="px-1 py-0.5 w-fit rounded bg-blue-100 text-blue-800 border border-blue-400 text-xs cursor-pointer hover:bg-blue-200"

                                                            >
                                                                {/* {slot.start} - {slot.end} */}
                                                                {formatTime12Hour(slot.start)} - {formatTime12Hour(slot.end)}
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
                                                <div className="flex-wrap max-h-[44px] overflow-y-auto border border-gray-300 rounded py-2 px-2 gap-1 flex">
                                                    {matchingSlot.slots.booked.length > 0 ? (
                                                        matchingSlot.slots.booked.map((slot, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="px-1 py-0.5 w-fit rounded bg-green-100 text-green-800 border border-green-400 text-xs cursor-pointer hover:bg-green-200"
                                                            >
                                                                {/* {slot.start} - {slot.end} */}
                                                                 {formatTime12Hour(slot.start)} - {formatTime12Hour(slot.end)}
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
                                                readOnly={eventType === "leave"|| formDisabled} 
                                                onOpen={(e) => {
                                                    if (eventType === "leave"|| formDisabled) e.preventDefault(); 
                                                }}
                                                componentsProps={{
                                                    textField: {
                                                        size: "small",
                                                        InputProps: {
                                                        readOnly: eventType === "leave"|| formDisabled,
                                                        },
                                                        sx: {
                                                        "& .MuiInputBase-input": {
                                                            color: "black", 
                                                        },
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "#fff",
                                                        },
                                                        },
                                                    },
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
                                                 readOnly={eventType === "leave"|| formDisabled} 
                                                onOpen={(e) => {
                                                    if (eventType === "leave"|| formDisabled) e.preventDefault(); 
                                                }}
                                                componentsProps={{
                                                    textField: {
                                                        size: "small",
                                                        InputProps: {
                                                        readOnly: eventType === "leave"|| formDisabled,
                                                        },
                                                        sx: {
                                                        "& .MuiInputBase-input": {
                                                            color: "black", 
                                                        },
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "#fff",
                                                        },
                                                       
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>

                                </LocalizationProvider>
                                {eventType !== "leave" && user?.role === 2 && (
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
                                            {patients?.map((patient) => (
                                                <option key={patient._id} value={patient._id}>
                                                    {patient.firstname} {patient.lastname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>)}
                                {eventType !== "leave" && user?.role === 1 && !formDisabled &&(
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
                             

                                {eventType !== "leave" &&(
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
                                            disabled={formDisabled}
                                        >
                                            <option value="">Select visit type</option>
                                            <option value="HOME">Home Visit</option>
                                            <option value="CLINIC">Clinic Visit</option>
                                        </select>
                                    </div>
                                )}
                                {/* {(() => {
                                    const dayBooking = allBookings.find(b => b.date === appointment?.date);
                                    const leaveEvent = dayBooking?.events?.find(e => e.type === "leave");
                                    console.log(dayBooking,"daybooking",leaveEvent,"leaveevnett")

                                    if (leaveEvent) {
                                        const startTime = appointment?.time_slot?.start || leaveEvent.start;
                                        const endTime = appointment?.time_slot?.end || leaveEvent.end;
                                        return (
                                        <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded text-sm">
                                            {`The doctor will not be available on ${
                                            appointment?.date
                                                ? dayjs(appointment.date).format("D MMMM, YYYY")
                                                : "this date"
                                            }${
                                            startTime && endTime
                                                ? `, from ${dayjs(startTime, "HH:mm").format("h:mm A")} to ${dayjs(
                                                    endTime,
                                                    "HH:mm"
                                                ).format("h:mm A")}`
                                                : ""
                                            }.`}
                                        </div>
                                        );
                                    }
                                    return null;
                                })()} */}
                                {(() => {
                                    const dayBooking = allBookings.find(b => b.date === appointment?.date);
                                    const leaveEvents = dayBooking?.events?.filter(e => e.type === "leave") || [];

                                    if (leaveEvents.length > 0) {
                                        const dateText = appointment?.date
                                        ? dayjs(appointment.date).format("D MMMM, YYYY")
                                        : "this date";

                                        const startTime = appointment?.time_slot?.start;
                                        const endTime = appointment?.time_slot?.end;

                                        let timeMessage = "";

                                        if (startTime && endTime) {
                                        timeMessage = `from ${dayjs(startTime, "HH:mm").format("h:mm A")} to ${dayjs(
                                            endTime,
                                            "HH:mm"
                                        ).format("h:mm A")}`;
                                        } else {
                                        const leaveTimes = leaveEvents
                                            .map(e => {
                                            if (e.start && e.end) {
                                                return `${dayjs(e.start, "HH:mm").format("h:mm A")} to ${dayjs(
                                                e.end,
                                                "HH:mm"
                                                ).format("h:mm A")}`;
                                            }
                                            return null;
                                            })
                                            .filter(Boolean)
                                            .join(", ");
                                        if (leaveTimes) timeMessage = `during ${leaveTimes}`;
                                        }

                                        return (
                                        <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded text-sm">
                                            {`The doctor will not be available on ${dateText}${
                                            timeMessage ? `, ${timeMessage}.` : "."
                                            }`}
                                        </div>
                                        );
                                    }
                                    return null;
                                })()}


                                {eventType !== "leave" &&(
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
                                            className={`px-4 py-1 rounded-md transition text-white bg-[#1a6f8b] ${isFormValid&& !formDisabled
                                                ? "hover:bg-[#15596e] cursor-pointer"
                                                : "cursor-not-allowed opacity-50"
                                                }`}
                                            disabled={!isFormValid|| formDisabled}
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
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

               <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staffData.map((staff) => (
                            <div
                                key={staff._id}
                                className="bg-white rounded-2xl shadow-md px-6 py-4 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                <h2 className="text-xl font-bold text-[#1a6f8b] truncate">
                                    {staff.firstname} {staff.lastname}
                                </h2>

                                <div className="border-b border-gray-300 w-full"></div>
                                    <p className="text-gray-700 text-sm mt-2">
                                        <span className="truncate block">
                                            {staff.specialization}{" "}
                                            {staff.professionalStatus === "experienced" && (
                                            <span className="text-gray-700 font-semibold">
                                                ({staff.workExperience_totalYears} yrs)
                                            </span>
                                            )}
                                        </span>
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full truncate max-w-full block">
                                        {staff.qualification} - {staff.gender}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 mt-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <LuPhone className="text-[#8b8a8a] flex-shrink-0" />
                                        <span className="truncate block">{staff.countryCode} {staff.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-[#8b8a8a] flex-shrink-0" />
                                        <span className="truncate block">{staff.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-[#8b8a8a] flex-shrink-0" />
                                        <span className="truncate block">{staff.address}, {staff.city}, {staff.state}, {staff.country} - {staff.pincode}</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="bg-[#1a6f8b] hover:bg-[#15596e] text-white font-semibold px-5 py-2 rounded-md shadow-md transition-all"
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