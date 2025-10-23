import React, { useEffect, useState } from "react";
import { useDoctorApi } from "../../api/doctorApi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import Filter from "../../components/Filter";
import dayjs from 'dayjs';
import { useAppointmentApi } from "../../api/appointment";
import { CircularProgress } from '@mui/material';
import ReusableModal from "../../components/ReusableModal";
import CustomCalendar from "../../components/Calander";
import { showAlert } from "../../components/AlertComponent";
import CloseIcon from '@mui/icons-material/Close';

function AdminAppointment({ isDrawerOpen }) {
	const [doctorList, setDoctorList] = useState([]);
	const [filteredDoctors, setFilteredDoctors] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = React.useState('thisMonth');
    const [fromDate, setFromDate] = React.useState(dayjs().startOf('month'));
    const [toDate, setToDate] = React.useState(dayjs().endOf('month'));
    const { getPatients ,getAppointmentsByPatients} = useAppointmentApi();
	const { getDoctor } = useDoctorApi();
    const [patientList, setPatientList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [hasFetchedPatients, setHasFetchedPatients] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const dropdownRef = React.useRef(null);


    const columns = [
		'Patient Name',
		'Patient Email',
		'Patient Phone',
		'Patient Address',
        'Visit Count',
        'Total Appointments',
        'Patient Status'
	];
	const fetchDoctors = async () => {
		try {
			const data = await getDoctor({
				skip: "",
				limit: "",
				rowsPerPage: "",
				search: "",
				from_date: "",
				to_date: "",
			});
			const doctors = data?.rows || [];
			setDoctorList(doctors);
			setFilteredDoctors(doctors);
		} catch (err) {
			console.error("Error fetching doctors:", err);
		}
	};

	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchTerm(value);

		const filtered = doctorList.filter((doc) => {
			const first = (doc.firstname || "").toLowerCase();
			const last = (doc.lastname || "").toLowerCase();
			return first.includes(value) || last.includes(value);
		});

		setFilteredDoctors(filtered);
	};

	const handleSelect = (doctor) => {
		setSelectedDoctor(doctor);
		setDropdownOpen(false);
		setSearchTerm("");
        setFilteredDoctors(doctorList)
	};

    const fetchAppointments = async (
            from_date = fromDate,
            to_date = toDate,
    ) => {
        setLoading(true);
        setHasFetchedPatients(false);
        try {
            if (selectedDoctor._id) {
                const result = await getPatients(
                    selectedDoctor._id,
                    from_date ? dayjs(from_date).format('YYYY-MM-DD') : '',
                    to_date ? dayjs( to_date).format('YYYY-MM-DD') : '',
                );
                setPatientList(result?.rows);
                setHasFetchedPatients(true);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setHasFetchedPatients(true);
        } finally {
            setLoading(false);
        }
    };
    const handleSearchButton = () => {
        fetchAppointments();
    };
    const handleClearButton = () => {
        const start = dayjs().startOf('month');
        const end = dayjs().endOf('month');
        setFilter('thisMonth');
        setFromDate(start);
        setToDate(end);
        setSelectedDoctor(null);
        setPatientList([])
        setHasFetchedPatients(false);
        setFilteredDoctors(doctorList)
    };
    const handleGetAppointments = async (newDate) => {
            try {
                const doctorid = selectedDoctor._id
                const patientid= selectedPatient._id
                const targetDate = newDate ? dayjs(newDate) : dayjs(); 
                const from_date = targetDate.startOf("month").format("YYYY-MM-DD");
                const to_date = targetDate.endOf("month").format("YYYY-MM-DD");
                const result = await getAppointmentsByPatients(doctorid,patientid, from_date, to_date);
    
    
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
                // setIsModalOpen(true);
    
            } catch (error) {
                console.error("Error getting appointments:", error);
                showAlert("Failed to get appointments!", "error");
            }
    }
    
    useEffect(() => {
		fetchDoctors();
	}, []);

    useEffect(() => {
        if (isModalOpen && selectedDoctor?._id && selectedPatient?._id) {
            setCalendarEvents([]);
            handleGetAppointments();
        }
    }, [isModalOpen]);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

	return (
		<div
			id="dashboard-container"
			className={isDrawerOpen ? "drawer-open" : "drawer-closed"}
			style={{
				height: "calc(100vh - 60px)",
				display: "flex",
				flexDirection: "column",
			}}
		>
            <ReusableModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedEvent(null)
                }}
                title={selectedPatient ? `Appointments - ${selectedPatient.firstname} ${selectedPatient.lastname}` : '' }
                modalClassName="mt-10"
            >
                <div className="flex gap-4">
                    <div className="w-[700px]">
                        <CustomCalendar
                            events={calendarEvents}
                            // onSelectEvent={handleOnSelectEvent}
                            onSelectEvent={(event) => setSelectedEvent(event)}
                            onNevigate={handleGetAppointments}
                        />
                    </div>
                    {selectedEvent && (
                        <div className="w-[250px] bg-white rounded shadow-sm border border-[#eee] px-4 py-2">
                            <div className="flex justify-between">
                                <p className="text-[18px] font-semibold text-[#1a6f8b]">Event Details</p>
                                <span
                                    onClick={() => setSelectedEvent(null)}
                                    className="cursor-pointer"
                                >
                                    <CloseIcon className="text-[#1a6f8b]" />
                                </span>
                            </div>
                            <div className="flex flex-col pt-4">
                                <label className="block text-sm text-left font-medium text-gray-700">
                                    Selected Event Date
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                    value={dayjs(selectedEvent.date).format("DD MMM YYYY")}
                                    readOnly
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Start Time
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                        value={selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        End Time
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                        value={selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-2">
                                <label className="block text-sm text-left font-medium text-gray-700">
                                    Status 
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                    value={selectedEvent.status}
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col pt-2">
                                <label className="block text-sm text-left font-medium text-gray-700">
                                    Visit Type:
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full text-[14px] rounded-md border border-gray-300 p-2"
                                    value={selectedEvent.visit_type}
                                    readOnly
                                />
                            </div>                       
                        </div>
                    )}
                </div>
            </ReusableModal>
			<span
				className="text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]"
				style={{ fontFamily: "'Arial', sans-serif" }}
			>
				Appointments
			</span>
			<div className="p-[20px] flex justify-end gap-2">
				<div className="relative w-full max-w-[250px]" ref={dropdownRef}>
					<div
						className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white flex justify-between items-center text-[14px]"
						onClick={() => setDropdownOpen(!dropdownOpen)}
					>
						<span>
							{selectedDoctor
								? `${selectedDoctor.firstname || ""} ${
										selectedDoctor.lastname || ""
								  }`.trim()
								: "Select Doctor"}
						</span>
						<KeyboardArrowDownIcon fontSize="small" />
					</div>
					{dropdownOpen && (
						<div className="absolute z-20 w-full bg-white border border-gray-300 mt-1 shadow-lg">
							<div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
								<input
									type="text"
									value={searchTerm}
									onChange={handleSearch}
									placeholder="Search doctor..."
									className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#a4a8af] text-[14px]"
								/>
                                <SearchIcon
                                    fontSize="small"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                />
							</div>
							<ul className="max-h-[180px] overflow-y-auto text-left text-[14px]">
								{filteredDoctors.length > 0 ? (
									filteredDoctors.map((doctor) => (
										<li
											key={doctor._id}
											onClick={() => handleSelect(doctor)}
											className="px-3 py-1 cursor-pointer hover:bg-[#f0f8fa] text-gray-700"
										>
											{doctor.firstname} {doctor.lastname}
										</li>
									))
								) : (
									<li className="px-3 py-2 text-gray-500 text-sm">
										No doctors found
									</li>
								)}
							</ul>
						</div>
					)}
				</div>
                <Filter
					filter={filter}
					setFilter={setFilter}
					fromDate={fromDate}
					setFromDate={setFromDate}
					toDate={toDate}
					setToDate={setToDate}
					handleSearchButton={handleSearchButton}
					handleClearButton={handleClearButton}
					showSearch={false}
				/>
			</div>
            <div className="px-4 flex-1 py-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto h-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-full w-full">
                            <CircularProgress size={30} />
                        </div>
                    ) :(!hasFetchedPatients) ? (
                        <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                            Select a doctor to view appointments
                        </div>
                    ): ( 
                        <table className="min-w-full border-collapse">
                            <thead className="sticky top-0 bg-[#ddedf7] z-10">
                                <tr className="border border-gray-200b">
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 text-left"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientList.length > 0 ? (
                                    patientList.map((patient) => {
                                        const addressParts = [
                                            patient?.address,
                                            patient?.city,
                                            patient?.state,
                                            patient?.country,
                                        ].filter(Boolean); 
                                        const fullAddress = addressParts.join(", ");
                                        return (
                                            <tr
                                                key={patient._id}
                                                className="border border-gray-200 text-left"
                                                // onClick={() => {
                                                //     setSelectedPatient(patient);
                                                //     setIsModalOpen(true);
                                                // }}
                                            >
                                                <td className="px-4 py-2 text-sm truncate max-w-[150px]"
                                                title={`${patient?.firstname} ${patient?.lastname}`}
                                                >
                                                    {`${patient?.firstname} ${patient?.lastname}`}
                                                </td>
                                                <td className="px-4 py-2 text-sm truncate max-w-[180px]"
                                                title={patient.email}
                                                >
                                                    {patient.email}
                                                </td>                                                         
                                                <td className="px-4 py-2 text-sm">
                                                    {patient.phone}
                                                </td>
                                                <td className="px-4 py-2 text-sm truncate  max-w-[200px]"
                                                title={fullAddress}
                                                >
                                                    {fullAddress}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {patient.visit_count}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {patient.total_appointments}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {patient.patient_status}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    <button
                                                        className="bg-[#1a6f8b] text-white text-xs px-3 py-1 rounded-md hover:bg-[#155a70] transition cursor-pointer"
                                                        onClick={() => {
                                                        setSelectedPatient(patient);
                                                        setIsModalOpen(true);
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center text-gray-500 text-sm py-4"
                                        >
                                            No Patient available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
		</div>
	);
}

export default AdminAppointment;
