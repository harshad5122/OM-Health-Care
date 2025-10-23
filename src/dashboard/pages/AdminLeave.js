import React, { useEffect, useState } from 'react';
import { useDoctorApi } from '../../api/doctorApi';
import Filter from '../../components/Filter';
import dayjs from 'dayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { useLeaveApi } from '../../api/leaveApi';
import { CircularProgress } from '@mui/material';

function AdminLeave({ isDrawerOpen }) {
	const [doctorList, setDoctorList] = useState([]);
	const [filteredDoctors, setFilteredDoctors] = useState([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [filter, setFilter] = React.useState('thisMonth');
	const [fromDate, setFromDate] = React.useState(dayjs().startOf('month'));
	const [toDate, setToDate] = React.useState(dayjs().endOf('month'));
	const [loading, setLoading] = React.useState(false);
	const [leaveByIdData, setLeaveByIdData] = React.useState(null);
    const [hasFetchedLeaves, setHasFetchedLeaves] = useState(false);
	const dropdownRef = React.useRef(null);

	const columns = [
		'Start Date',
		'End Date',
		'Leave Type',
		'Admin',
		'Reason',
		'Status',
	];
	const { getDoctor } = useDoctorApi();
	const { getLeaveById } = useLeaveApi();

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-GB');
	};

	const fetchDoctors = async () => {
		try {
			const data = await getDoctor({
				skip: '',
				limit: '',
				rowsPerPage: '',
				search: '',
				from_date: '',
				to_date: '',
			});
			const doctors = data?.rows || [];
			setDoctorList(doctors);
			setFilteredDoctors(doctors);
		} catch (err) {
			console.error('Error fetching doctors:', err);
		}
	};
	const fetchLeaveById = async (from_date = fromDate, to_date = toDate) => {
		if (!selectedDoctor) return;
		setLoading(true);
       setHasFetchedLeaves(false)

		try {
			const result = await getLeaveById(
				selectedDoctor?._id,
				from_date ? dayjs(from_date).format('YYYY-MM-DD') : '',
				to_date ? dayjs(to_date).format('YYYY-MM-DD') : '',
			);
			setLeaveByIdData(result);
            setHasFetchedLeaves(true);
		} catch (error) {
			console.log('Error fetching leave by ID:', error);
             setHasFetchedLeaves(true);
		} finally {
			setLoading(false);
		}
	};
	const handleSearchButton = () => {
		fetchLeaveById();
	};
	const handleSelect = (doctor) => {
		setSelectedDoctor(doctor);
		setDropdownOpen(false);
		setSearchTerm('');
		setFilteredDoctors(doctorList)
	};
	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchTerm(value);

		const filtered = doctorList.filter((doc) => {
			const first = (doc.firstname || '').toLowerCase();
			const last = (doc.lastname || '').toLowerCase();
			return first.includes(value) || last.includes(value);
		});

		setFilteredDoctors(filtered);
	};
	const handleClearButton = () => {
		const start = dayjs().startOf('month');
		const end = dayjs().endOf('month');
		setFilter('thisMonth');
		setFromDate(start);
		setToDate(end);
		setSelectedDoctor(null);
		setLeaveByIdData(null);
         setHasFetchedLeaves(false)
		 setFilteredDoctors(doctorList)
	};
	useEffect(() => {
		fetchDoctors();
	}, []);
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
			className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
			style={{
				height: 'calc(100vh - 60px)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<span
				className="text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]"
				style={{ fontFamily: "'Arial', sans-serif" }}
			>
				Leaves
			</span>
			<div className="p-[20px] flex justify-end gap-2">
				<div className="relative w-full max-w-[250px]" ref={dropdownRef}>
					<div
						className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white flex justify-between items-center text-[14px]"
						onClick={() => setDropdownOpen(!dropdownOpen)}
					>
						<span>
							{selectedDoctor
								? `${selectedDoctor.firstname || ''} ${
										selectedDoctor.lastname || ''
								  }`.trim()
								: 'Select Doctor'}
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
					)  :(!hasFetchedLeaves) ? (
                        <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                            Select a doctor to view leaves
                        </div>
                    ):  (
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
                                </tr>
                            </thead>
							<tbody>
								{leaveByIdData?.length > 0 ? (
									leaveByIdData.map((leave, index) => (
										<tr
											key={leave._id}
											className="border border-gray-200 text-left"
										>
											<td className="px-4 py-2 text-sm">
												{formatDate(leave.start_date)}{' '}
											</td>
											<td className="px-4 py-2 text-sm">
												{formatDate(leave.end_date)}{' '}
											</td>
											{/* <td className="px-4 py-2 text-sm">
												{leave.leave_type}
											</td> */}
											<td className="px-4 py-2 text-sm">
												{leave.leave_type === "FIRST_HALF"
													? "First Half"
													: leave.leave_type === "SECOND_HALF"
													? "Second Half"
													: leave.leave_type === "FULL_DAY"
													? "Full Day"
													: leave.leave_type}
											</td>
											<td className="px-4 py-2 text-sm">
												{leave.admin_name || '-'}
											</td>
											<td
												className="px-4 py-2 text-sm max-w-[250px] truncate"
												title={leave.reason}
											>
												{leave.reason}
											</td>
											<td className="px-4 py-2 text-sm">
												<span
													className={`px-2 py-1 rounded text-xs font-medium
                                                                    ${
																		leave.status ===
																		'PENDING'
																			? 'bg-green-100 text-green-700'
																			: leave.status ===
																			  'CONFIRMED'
																			? 'bg-blue-100 text-blue-700'
																			: leave.status ===
																			  'CANCELLED'
																			? 'bg-red-100 text-red-700'
																			: 'bg-gray-100 text-gray-700'
																	}`}
												>
													{leave.status}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={columns.length + 1}
											className="text-center text-gray-500 text-sm py-4"
										>
											No leave records available
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
export default AdminLeave;
