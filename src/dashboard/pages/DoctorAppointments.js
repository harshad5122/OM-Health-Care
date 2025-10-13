import React from 'react';
import Filter from '../../components/Filter';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import { useAppointmentApi } from '../../api/appointment';
import { Edit } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useNotificationApi } from '../../api/notification';
import ReusableModal from '../../components/ReusableModal';
import {
	Select,
	MenuItem,
	Chip,
	OutlinedInput,
	Box,
	FormControl,
	Tooltip,
	 IconButton
} from '@mui/material';
import { ContentCopy } from "@mui/icons-material";
import { showAlert } from '../../components/AlertComponent';

function DoctorAppointmnets(isDrawerOpen) {
	const { user } = useAuth();
	const { getAppointmentList } = useAppointmentApi();
	const { updateNotificationStatus } = useNotificationApi();
	const [filter, setFilter] = React.useState('thisMonth');
	const [appointmentList, setAppointmentList] = React.useState([]);
	const [fromDate, setFromDate] = React.useState(dayjs().startOf('month'));
	const [toDate, setToDate] = React.useState(dayjs().endOf('month'));
	const [status, setStatus] = React.useState([]);
	const STATUS_OPTIONS = ['CONFIRMED', 'CANCELLED','COMPLETED',];
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
	const [selectedAppointment, setSelectedAppointment] = React.useState(null);
	const [newStatus, setNewStatus] = React.useState('');
	const [reason, setReason] = React.useState('');

	const columns = [
		'Patient Name',
		'Appointment Date',
		'Start Time',
		'End Time',
		'Visit Type',
		'Patient Phone',
		'Patient Address',
		'Status',
	];

	const formatTime12Hour = (time) => {
		const [hour, minute] = time.split(':');
		const h = parseInt(hour, 10);
		const ampm = h >= 12 ? 'PM' : 'AM';
		const hour12 = h % 12 === 0 ? 12 : h % 12;
		return `${hour12}:${minute} ${ampm}`;
	};

	const fetchAppointments = async (
		from = fromDate,
		to = toDate,
		currentStatus = status,
	) => {
		setLoading(true);
		try {
			if (user?.staff_id) {
				const result = await getAppointmentList(
					user.staff_id,
					from ? dayjs(from).format('YYYY-MM-DD') : '',
					to ? dayjs(to).format('YYYY-MM-DD') : '',
					currentStatus.length > 0 ? currentStatus.join(',') : '',
				);
				setAppointmentList(result);
			}
		} catch (error) {
			console.error('Error fetching appointments:', error);
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
		setStatus([]);
		fetchAppointments(start, end, []);
	};
	const handleChange = (event) => {
		const value = event.target.value;
		setStatus(value);
		setOpen(false);
	};
	const handleSaveStatus = async () => {
		try {
			if (!selectedAppointment) return;
			if (newStatus === 'CANCELLED' && !reason.trim()) {
				showAlert('Please enter a reason for cancel the appointment.', 'error');
				return;
			}
			const payload = {
				reference_id: selectedAppointment._id,
				creator_id: selectedAppointment.creator,
				patient_id:selectedAppointment.patient_id,
				status: newStatus,
				message: newStatus === 'CANCELLED' ? reason.trim() : '',
				notification_id: null,
			};

			await updateNotificationStatus(payload);

			setAppointmentList((prev) =>
				prev.map((appt) =>
					appt._id === selectedAppointment._id
						? { ...appt, status: newStatus }
						: appt
				)
			);

			fetchAppointments();
			setIsEditModalOpen(false);
			setSelectedAppointment(null);
		} catch (error) {
			console.log('Error updating status:', error);
		}
	};
	React.useEffect(() => {
		fetchAppointments();
	}, [user?.staff_id]);


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
					title={'Update appointment status ?'}
				>
					<div className="space-y-4 flex flex-col">
						<span>
							<label className="block font-semibold text-[13px] text-left text-gray-700">
								Appointment Date
							</label>
							<input
								type="text"
								value={new Date(
									selectedAppointment.date,
								).toLocaleDateString("en-GB")}
								readOnly
								className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
							/>
						</span>
						<div className="flex gap-4 mt-1">
							<span>
								<label className="block font-semibold text-[13px] text-left text-gray-700">
									Patient Name
								</label>
								<input
									type="text"
									value={selectedAppointment.patient_name}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>
							<span>
								<label className="block font-semibold text-[13px] text-gray-700 text-left">
									Visit Type
								</label>
								<input
									type="text"
									value={selectedAppointment.visit_type}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>
						</div>
						<div className="flex gap-4 mt-1">
							<span>
								<label className="block font-semibold text-[13px] text-gray-700 text-left">
									Start Time
								</label>
								<input
									type="text"
									value= {formatTime12Hour(selectedAppointment.time_slot.start)}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>

							<span>
								<label className="block font-semibold text-[13px] text-gray-700 text-left">
									End Time
								</label>
								<input
									type="text"
									value= {formatTime12Hour(selectedAppointment.time_slot.end)}
									readOnly
									className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-700 text-[14px]"
								/>
							</span>
						</div>

						<span>
							<label className="block font-semibold text-[13px] text-gray-700 text-left">
								Status
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
						{newStatus === 'CANCELLED' && (
							<span>
								<label className="block font-semibold text-[13px] text-left text-gray-700">
									Reason
								</label>
								<textarea
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									rows="3"
									placeholder="Enter reason for canceling appointment..."
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
				Patient Appointments
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
												...(st === 'CONFIRMED' && {
													backgroundColor: '#dcfce7',
													color: '#15803d',
												}),
												...(st === 'COMPLETED' && {
													backgroundColor: '#dbeafe',
													color: '#1d4ed8',
												}),
												...(st === 'CANCELLED' && {
													backgroundColor: '#fee2e2',
													color: '#b91c1c',
												}),
												...(![
													'CONFIRMED',
													'COMPLETED',
													'CANCELLED',
												].includes(st) && {
													backgroundColor: '#f3f4f6',
													color: '#374151',
												}),
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
				<div className="flex-1 overflow-y-auto">
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
								{appointmentList.length > 0 ? (
									appointmentList.map((appointment) => {
										const addressParts = [
											appointment?.patient_address,
											appointment?.patient_city,
											appointment?.patient_state,
											appointment?.patient_country,
											 
										].filter(Boolean); 
										const fullAddress = addressParts.join(", ");
										return (
											<tr
												key={appointment._id}
												className="border border-gray-200 text-left"
											>
												<td className="px-4 py-2 text-sm truncate max-w-[150px]"
												title={appointment.patient_name}
												>
													{appointment.patient_name}
												</td>
												<td className="px-4 py-2 text-sm">
													{new Date(
														appointment.date,
													).toLocaleDateString("en-GB")}
												</td>
												<td className="px-4 py-2 text-sm">
													  {formatTime12Hour(appointment.time_slot.start)}
												</td>
												<td className="px-4 py-2 text-sm">
													 {formatTime12Hour(appointment.time_slot.end)}
												</td>
												<td className="px-4 py-2 text-sm">
													{appointment.visit_type}
												</td>
												<td className="px-4 py-2 text-sm">
													{appointment.patient_phone}
													{appointment.patient_phone && (
														<Tooltip title="Copy phone">
															<IconButton
																size="small"
																onClick={() => navigator.clipboard.writeText(appointment.patient_phone)}
															>
																<ContentCopy sx={{ fontSize: "12px" }} />
															</IconButton>
														</Tooltip>
													)}
												</td>
												<td className="px-4 py-2 text-sm relative flex"
												title={fullAddress}
												>
													{/* {fullAddress} */}
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
																onClick={() => navigator.clipboard.writeText(fullAddress)}
																 className="absolute right-0 "
															>
																<ContentCopy sx={{ fontSize: "12px" }} />
															</IconButton>
														</Tooltip>
													)}
												</td>
												<td className="px-4 py-2 text-sm">
													<span
														className={`px-2 py-1 rounded text-xs font-medium
														${
															appointment.status ===
															'CONFIRMED'
																? 'bg-green-100 text-green-700'
																: appointment.status ===
																  'COMPLETED'
																? 'bg-blue-100 text-blue-700'
																: appointment.status ===
																  'CANCELLED'
																? 'bg-red-100 text-red-700'
																: 'bg-gray-100 text-gray-700'
														}`}
													>
														{appointment.status}
													</span>
												</td>
												<td className="px-4 pl-8 py-2 flex">
													{appointment.status === "COMPLETED"  ? (
														 <Tooltip title="Cannot edit once status is completed">
																<span>
																	<Edit
																	className="text-gray-400 cursor-not-allowed"
																	sx={{ fontSize: "18px" }}
																	/>
																</span>
															</Tooltip>
														) : (
														<Edit
															className="text-blue-500 cursor-pointer"
															sx={{ fontSize: "18px" }}
															onClick={() => {
																setIsEditModalOpen(true);
																setNewStatus(appointment.status);
																setReason(appointment.message || '');
																setSelectedAppointment({
																...appointment,
																});
															}}
														/>
													)}
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
											No appointments available
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
export default DoctorAppointmnets;
