import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAppointmentApi } from '../../api/appointment';
import { CircularProgress } from '@mui/material';
import { Edit } from '@mui/icons-material';
import ReusableModal from '../../components/ReusableModal';
import dayjs from 'dayjs';
import {
	Select,
	MenuItem,
	Chip,
	OutlinedInput,
	Box,
	FormControl,
	Tooltip,
	IconButton,
	Pagination
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import Filter from '../../components/Filter';
import { usePatientApi } from '../../api/patientApi';
import { showAlert } from '../../components/AlertComponent';

function PatientStatus() {
	const { isDrawerOpen, user } = useOutletContext();
	const { getPatients } = useAppointmentApi();
	const { editPatientStatus } = usePatientApi();
	const [patientList, setPatientList] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
	const [newStatus, setNewStatus] = React.useState('');
	const STATUS_OPTIONS = [
		'CONTINUE',
		'DISCONTINUE',
		'ALTERNATE',
		'WEEKLY',
		'DISCHARGE',
		'OBSERVATION',
	];
	const [selectedPatient, setSelectedPatient] = React.useState(null);
	const [fromDate, setFromDate] = React.useState(dayjs().startOf('month'));
	const [toDate, setToDate] = React.useState(dayjs().endOf('month'));
	const [status, setStatus] = React.useState([]);
	const [filter, setFilter] = React.useState('thisMonth');
	const [open, setOpen] = React.useState(false);
	const [reason, setReason] = useState('');
	const [search, setSearch] = React.useState("");
	const [page, setPage] = React.useState(1);
	const [totalCounts, setTotalCounts] = React.useState(0);
	const rowsPerPage = 20;
	const columns = [
		'Patient Name',
		'Patient Email',
		'Patient Phone',
		'Patient Address',
		'Visit Count',
		'Total Appointments',
		'Patient Status',
	];
	const fetchPatients = async (
		from = fromDate,
		to = toDate,
		currentStatus = status,
		skip,
		searchValue = search
	) => {
		setLoading(true);
		try {
			if (user.staff_id) {
				const data = await getPatients(
					user.staff_id,
					from ? dayjs(from).format('YYYY-MM-DD') : '',
					to ? dayjs(to).format('YYYY-MM-DD') : '',
					currentStatus.length > 0 ? currentStatus.join(',') : '',
					skip,
                	rowsPerPage,      
                	searchValue 
				);
				setPatientList(data?.rows);
				setTotalCounts(data?.total_count)
			}
		} catch (error) {
			console.log('Error fetching appointments:', error);
			showAlert(error,"error")
		} finally {
			setLoading(false);
		}
	};
	const handleChangePage = (event, value) => {
        setPage(value);
        const skip = (value - 1) * rowsPerPage
        fetchPatients(fromDate, toDate, status,skip)
    };
	const handleSearch = () => {
        const skip = (page - 1) * rowsPerPage
        fetchPatients(fromDate, toDate, status,skip);
    }
	const handleSaveStatus = async () => {
		if (!selectedPatient) return;
		if (newStatus === 'DISCONTINUE' && !reason.trim()) {
			showAlert('Please enter a reason for discontinuing the patient.', 'error');
			return;
	    }
		const payload = {
			patient_status: newStatus,
			message: newStatus === 'DISCONTINUE' ? reason.trim() : '',
		};

		try {
			await editPatientStatus(selectedPatient._id, payload); 

			showAlert('Patient status updated successfully', 'success');

			setPatientList((prev) =>
				prev.map((patient) =>
					patient._id === selectedPatient._id
						? { ...patient, status: newStatus }
						: patient,
				),
			);

			setIsEditModalOpen(false);
			setSelectedPatient(null);
			fetchPatients();
		} catch (err) {
			console.log('Failed to update leave:', err);
			showAlert(err, 'error');
		}
	};
	const handleChange = (event) => {
		const value = event.target.value;
		setStatus(value);
		setOpen(false);
	};
	const handleSearchButton = () => {
		fetchPatients();
	};
	const handleClearButton = () => {
		const start = dayjs().startOf('month');
		const end = dayjs().endOf('month');
		setFilter('thisMonth');
		setFromDate(start);
		setToDate(end);
		setStatus([]);
		setSearch("")
		setPage(1);
		const skip = 0;
		fetchPatients(start, end, [],skip,"");
	};
	React.useEffect(() => {
		if (user?.staff_id) {
			fetchPatients();
			setPage(1)
		}
	}, [user]);
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
			{isEditModalOpen && (
				<ReusableModal
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
					}}
					title={'Update Patient status ?'}
				>
					<div className="space-y-4 flex flex-col">
						<span>
							<label className="block font-semibold text-[13px] text-left text-gray-700">
								Patient Name
							</label>
							<input
								type="text"
								value={`${selectedPatient?.firstname} ${selectedPatient?.lastname}`}
								readOnly
								className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
							/>
						</span>
						<div className="flex gap-4 mt-1">
							<span>
								<label className="block font-semibold text-[13px] text-left text-gray-700">
									Patient phone
								</label>
								<input
									type="text"
									value={selectedPatient.phone}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>
							<span>
								<label className="block font-semibold text-[13px] text-gray-700 text-left">
									Patient Email
								</label>
								<input
									type="text"
									value={selectedPatient.email}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>
						</div>
						<span>
							<label className="block font-semibold text-[13px] text-left text-gray-700">
								Patient Address
							</label>
							<input
								type="text"
								value={
									[
										selectedPatient?.address,
										selectedPatient?.city,
										selectedPatient?.state,
										selectedPatient?.country,
									]
										.filter(Boolean)
										.join(', ') || ''
								}
								readOnly
								className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
							/>
						</span>

						<span>
							<label className="block font-semibold text-[13px] text-gray-700 text-left">
								Patient Status
							</label>
							<select
								value={newStatus}
								onChange={(e) => setNewStatus(e.target.value)}
								className="w-full border rounded px-3 py-2 cursor-pointer text-gray-700 text-[14px]"
							>
								{STATUS_OPTIONS.map((opt) => (
									<option
										key={opt}
										value={opt}
									>
										{opt}
									</option>
								))}
							</select>
						</span>
						{newStatus === 'DISCONTINUE' && (
							<span>
								<label className="block font-semibold text-[13px] text-left text-gray-700">
									Reason
								</label>
								<textarea
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									rows="3"
									placeholder="Enter reason for discontinuing..."
									className="w-full border rounded px-3 py-2 text-gray-700 text-[14px] resize-none"
								></textarea>
							</span>
						)}


						<div className="flex justify-end space-x-2 mt-4">
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="bg-[#1a6f8b] text-white px-4 py-1 rounded hover:bg-[#15596e] transition"
							>
								Cancel
							</button>
							<button
								className={`px-4 py-1 rounded text-white transition bg-[#1a6f8b] hover:bg-[#15596e]`}
								onClick={handleSaveStatus}
							>
								Save
							</button>
						</div>
					</div>
				</ReusableModal>
			)}
			<span
				className="text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]"
				style={{ fontFamily: "'Arial', sans-serif" }}
			>
				Patients
			</span>
			<div className="flex items-center pt-2 px-4 space-x-4 justify-end">
				<FormControl
					size="small"
					sx={{ minWidth: 150 }}
				>
					<Select
						multiple
						displayEmpty
						value={status}
						open={open}
						onOpen={() => setOpen(true)}
						onClose={() => setOpen(false)}
						onChange={handleChange}
						input={<OutlinedInput />}
						className='bg-white'
						renderValue={(selected) => {
							if (selected.length === 0) {
								return (
									<span className="text-gray-400 text-[15px]">
										Select Status
									</span>
								);
							}
							return (
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 0.5,
									}}
								>
									{selected.map((st) => (
										<Chip
											key={st}
											label={st}
											onMouseDown={(e) =>
												e.stopPropagation()
											}
											onDelete={() =>
												setStatus((prev) =>
													prev.filter(
														(s) => s !== st,
													),
												)
											}
											sx={{
												borderRadius: '6px',
												fontSize: '0.75rem',
												fontWeight: 500,
												px: 1,
												backgroundColor: '#dbeafe',
												color: '#1d4ed8',
											}}
											size="small"
										/>
									))}
								</Box>
							);
						}}
					>
						{STATUS_OPTIONS.filter(
							(option) => !status.includes(option),
						).length === 0 ? (
							<MenuItem disabled>No status available</MenuItem>
						) : (
							STATUS_OPTIONS.filter(
								(option) => !status.includes(option),
							).map((option) => (
								<MenuItem
									key={option}
									value={option}
								>
									{option}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>
				<Filter
					search={search}
                    setSearch={setSearch}
					handleSearch={handleSearch}
					filter={filter}
					setFilter={setFilter}
					fromDate={fromDate}
					setFromDate={setFromDate}
					toDate={toDate}
					setToDate={setToDate}
					handleSearchButton={handleSearchButton}
					handleClearButton={handleClearButton}
				/>
			</div>
			<div className="px-4 flex-1 py-4 overflow-hidden flex flex-col">
				<div className="flex-1 overflow-y-auto h-full">
					{loading ? (
						<div className="flex justify-center items-center h-full w-full">
							<CircularProgress size={30} />
						</div>
					) : (
						<table className="min-w-full border-collapse">
							<thead className="sticky top-0 bg-[#ddedf7] z-10">
								<tr className="border border-gray-200b">
									{columns.map((col, index) => (
										<th
											key={index}
											className="px-4 py-2 text-sm font-semibold text-gray-700 text-center"
										>
											{col}
										</th>
									))}
									<th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{patientList?.length > 0 ? (
									patientList.map((patient) => {
										const addressParts = [
											patient?.address,
											patient?.city,
											patient?.state,
											patient?.country,
										].filter(Boolean);
										const fullAddress =
											addressParts.join(', ');
										return (
											<tr
												key={patient._id}
												className="border border-gray-200 text-left text-center"
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
													{patient.phone && (
														<Tooltip title="Copy phone">
															<IconButton
																size="small"
																onClick={() =>
																	navigator.clipboard.writeText(
																		patient.phone,
																	)
																}
															>
																<ContentCopy
																	sx={{
																		fontSize:
																			'12px',
																	}}
																/>
															</IconButton>
														</Tooltip>
													)}
												</td>
												<td className="px-4 py-2 text-sm relative flex justify-center"
												title={fullAddress}
												>
													<span
														className="truncate block max-w-[200px]" 
														title={fullAddress}
													>
														{fullAddress}
													</span>
													{fullAddress && (
														<Tooltip title="Copy address">
															<IconButton
																size="small"
																onClick={() =>
																	navigator.clipboard.writeText(
																		fullAddress,
																	)
																}
																className="absolute right-0 "
															>
																<ContentCopy
																	sx={{
																		fontSize:
																			'12px',
																	}}
																/>
															</IconButton>
														</Tooltip>
													)}
												</td>
												<td className="px-4 py-2 text-sm">
													{patient.visit_count}
												</td>
												<td className="px-4 py-2 text-sm">
													{patient.total_appointments}
												</td>
												<td className="px-4 py-2 text-sm">
													{patient.patient_status ||
														'-'}
												</td>
												<td className="px-4 py-2 text-center">
													<Edit
														// className="text-blue-500 cursor-pointer"
														className={` ${
															!patient.patient_status ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 cursor-pointer'
														}`}
														onClick={() => {
															if (!patient.patient_status) return;
															setIsEditModalOpen(
																true,
															);
															setNewStatus(
																patient.patient_status,
															);
															setReason(patient.patient_message || '');
															setSelectedPatient({
																...patient,
															});
														}}
														sx={{
															fontSize: '18px',
														}}
													/>
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
				<div className="flex justify-end">
					<Pagination
					count={Math.ceil(totalCounts / rowsPerPage)}
					page={page}
					onChange={handleChangePage}
					color="primary"
					className="member-pagination"/>
				</div>
			</div>
		</div>
	);
}
export default PatientStatus;
