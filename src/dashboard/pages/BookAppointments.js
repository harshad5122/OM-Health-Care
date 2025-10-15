import React, { useEffect, useState } from 'react';
import CustomCalendar from '../../components/Calander';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { showAlert } from '../../components/AlertComponent';
import { useAppointmentApi } from '../../api/appointment';
import { useOutletContext } from 'react-router-dom';
import { usePatientApi } from '../../api/patientApi';

function BookAppointments() {
	const { isDrawerOpen, user } = useOutletContext();
	const [appointment, setAppointment] = useState(null);

	const [patients, setPatients] = useState([]);
	const [calendarEvents, setCalendarEvents] = useState([]);
	const [allBookings, setAllBookings] = useState([]);
	const [eventType, setEventType] = useState(null);
	const isFormValid =
		appointment?.date &&
		appointment?.time_slot?.start &&
		appointment?.time_slot?.end &&
		appointment?.visit_type &&
		appointment?.patient_id;
	const {
		createAppointment,
		getAppointments,
		updateAppointment,
	} = useAppointmentApi();
	const {getPatientByAssignDoctor}=usePatientApi();
	const today = new Date();

	const fetchPatients = async () => {
		try {
			if (user.staff_id) {
				const data = await getPatientByAssignDoctor(user.staff_id);
				setPatients(data);
			}
		} catch (err) {
			console.log('Error fetching staff:', err);
		}
	};
	const handleOnSelectEvent = (event) => {
		const isoDate = dayjs(event.date).format('YYYY-MM-DD');

		setAppointment({
			_id: event?.id,
			date: isoDate,
			time_slot: {
				start: dayjs(event?.start).format('HH:mm'),
				end: dayjs(event?.end).format('HH:mm'),
			},
			visit_type: event?.visit_type,
			patient_id: event?.patient_id,
			patient_name: `${user?.firstname} ${user?.lastname}`,
		});
		setEventType(event?.type || null);
	};
	const handleGetAppointments = async (staffPayload, newDate) => {
		try {
			const staffId = staffPayload?.staff_id ?? user?.staff_id;

			const targetDate = newDate ? dayjs(newDate) : dayjs(); // use newDate or current date
			const from_date = targetDate.startOf('month').format('YYYY-MM-DD');
			const to_date = targetDate.endOf('month').format('YYYY-MM-DD');
			const result = await getAppointments(staffId, from_date, to_date);
			setAllBookings(result);

			const mappedEvents = result.flatMap((day) => {
				return day.events.map((event) => {
					const [startHour, startMinute] = event?.start
						?.split(':')
						.map(Number);
					const [endHour, endMinute] = event?.end
						?.split(':')
						.map(Number);

					const baseDate = dayjs(day.date);

					return {
						...event,
						title: event.title,
						start: baseDate
							.hour(startHour)
							.minute(startMinute)
							.toDate(),
						end: baseDate.hour(endHour).minute(endMinute).toDate(),
						type: event.type,
						status: event.status,
						date: baseDate,
					};
				});
			});

			setCalendarEvents(mappedEvents);
		} catch (error) {
			console.error('Error getting appointments:', error);
			showAlert('Failed to get appointments!', 'error');
		}
	};
	const formatTime12Hour = (time24) => {
		const [hourStr, minute] = time24.split(':');
		let hour = parseInt(hourStr, 10);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		hour = hour % 12 || 12; // Convert 0 to 12
		return `${hour}:${minute} ${ampm}`;
	};
	const toMinutes = (time) => {
		const [h, m] = time.split(':').map(Number);
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
		if (
			!appointment?.date ||
			!appointment?.time_slot?.start ||
			!appointment?.time_slot?.end
		) {
			showAlert('Please select a valid date and time slot!', 'warning');
			return false;
		}

		const matchingSlot = allBookings.find(
			(slot) => slot.date === appointment.date,
		);

		// After getting matchingSlot and before booked slot check
		const leaveEvents = (matchingSlot?.events || []).filter(
			(e) => e.type === 'leave',
		);
		const { start, end } = appointment.time_slot;

		// Convert to minutes for easier comparison

		const apptStart = toMinutes(start);
		const apptEnd = toMinutes(end);

		if (leaveEvents.length > 0) {
			for (let leave of leaveEvents) {
				if (leave.full_day) {
					// full-day leave → doctor unavailable
					showAlert(
						`Dr. ${
							user?.firstname || ''
						} is on leave for the whole day (${dayjs(
							appointment.date,
						).format('D MMMM, YYYY')}).`,
						'error',
					);
					return false;
				} else {
					// partial leave → check overlap
					const leaveStart = toMinutes(leave.start);
					const leaveEnd = toMinutes(leave.end);

					if (!(apptEnd <= leaveStart || apptStart >= leaveEnd)) {
						showAlert(
							`Dr. ${user?.firstname || ''} is on leave from ${
								leave.start
							}–${leave.end} on ${dayjs(appointment.date).format(
								'D MMMM, YYYY',
							)}.`,
							'error',
						);
						return false;
					}
				}
			}
		}

		if (
			!matchingSlot ||
			((!matchingSlot.slots?.available?.length ||
				matchingSlot.slots.available.length === 0) &&
				(!matchingSlot.slots?.booked?.length ||
					matchingSlot.slots.booked.length === 0))
		) {
			return true; // no restrictions
		}

		// 1. Check overlap with already booked slots
		const isOverlapping = matchingSlot.slots.booked.some((b) => {
			if (
				appointment?._id &&
				b.id?.toString() === appointment._id.toString()
			) {
				return false;
			}
			const bookedStart = toMinutes(b.start);
			const bookedEnd = toMinutes(b.end);
			return !(apptEnd <= bookedStart || apptStart >= bookedEnd); // overlap check
		});

		if (isOverlapping) {
			showAlert(
				`The selected time overlaps with an existing appointment for Dr. ${
					user?.firstname || ''
				} on ${dayjs(appointment.date).format('D MMMM, YYYY')}.`,
				'error',
			);
			return false;
		}

		let effectiveAvail = [...(matchingSlot.slots.available || [])];

		if (appointment?._id) {
			const oldBooked = matchingSlot.slots.booked.find(
				(b) => b.id?.toString() === appointment._id.toString(),
			);

			if (oldBooked) {
				// add the old slot back into available so the user can reuse it or change within
				effectiveAvail.push({
					start: oldBooked.start,
					end: oldBooked.end,
				});
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
				`Dr. ${
					user?.firstname || ''
				} is not available for ${start}–${end} on ${dayjs(
					appointment.date,
				).format('D MMMM, YYYY')}`,
				'error',
			);
			return false;
		}

		return true; // ✅ validation passed
	};

	const submitForm = async () => {
        console.log("hello")
		try {
			if (!validateAppointment()) return; 
			const payload = {
				patient_id: appointment.patient_id,
				patient_name: appointment.patient_name,
				staff_id: user?.staff_id || '',
				date: appointment.date,
				time_slot: {
					start: appointment.time_slot.start,
					end: appointment.time_slot.end,
				},
				visit_type: appointment.visit_type || 'CLINIC',
			};
			let result;
			if (appointment?._id) {
				result = await updateAppointment({
					reference_id: appointment?._id,
					...payload,
				});
			} else {
				result = await createAppointment(payload);
			}

			await handleGetAppointments(user);

			showAlert('Appointment created successfully!', 'success');
			setAppointment(null);
		} catch (error) {
			console.error('Error creating appointment:', error);
			showAlert('Failed to create appointment!', 'error');
		}
	};
	useEffect(() => {
		if (user?.staff_id) {
			handleGetAppointments();
		}
	}, [user]);

	React.useEffect(() => {
        if (user?.staff_id) {
		fetchPatients();}
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
			<span
				className="text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]"
				style={{ fontFamily: "'Arial', sans-serif" }}
			>
				Book Appointments
			</span>
			<div className="flex px-[20px] pt-[15px] h-full gap-4 "
                style={{
                    display: 'grid',
                    gridTemplateColumns: appointment ? '3fr 1fr' : '1fr',
                }}
            >
				<div>
					<CustomCalendar
						height="600px"
						events={calendarEvents}
						onSelectSlot={(slot) => {
							if (slot.start < today.setHours(0, 0, 0, 0)) {
								return;
							}
							const isoDate = dayjs(slot.start).format(
								'YYYY-MM-DD',
							);

							setAppointment({
								date: isoDate,
								time_slot: {},
								visit_type: '',
								...(user?.role === 1 && {
									patient_id: user._id,
									patient_name: `${user.firstname} ${user.lastname}`,
								}),
							});
							setEventType(null);
						}}
						onSelectEvent={handleOnSelectEvent}
						onNevigate={handleGetAppointments}
					/>
				</div>
				{appointment && (
					<div className="bg-white rounded shadow-sm border border-[#eee] px-4 py-2 h-[600px] flex flex-col">
						<div className="flex justify-between">
							<p className="text-[18px] font-semibold text-[#1a6f8b]">{`${
								appointment?._id
									? 'Edit Appointment'
									: 'Book Appointment'
							}`}</p>
							<span
								onClick={() => setAppointment(null)}
								className="cursor-pointer"
							>
								<CloseIcon className="text-[#1a6f8b]" />
							</span>
						</div>
						<div className="flex-1 overflow-y-auto mt-2 overflow-x-hidden">
							<form
								className="space-y-3"
                                id="appointmentForm"
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
										value={
											appointment?.date
												? dayjs(
														appointment.date,
												  ).format('D MMMM, YYYY')
												: ''
										}
										readOnly
									/>
								</div>

								{eventType !== 'leave' &&
									(() => {
										const matchingSlot = allBookings.find(
											(slot) =>
												slot.date === appointment?.date,
										);

										if (!matchingSlot) return null;

										return (
											<div className="space-y-3">
												<div>
													<label className="block text-sm font-medium text-gray-700 text-left ">
														Available Slots
													</label>
													<div className="flex-wrap max-h-[44px] overflow-y-auto border border-gray-300 rounded py-2 px-2 flex gap-1">
														{matchingSlot.slots
															.available.length >
														0 ? (
															matchingSlot.slots.available.map(
																(slot, idx) => (
																	<div
																		key={
																			idx
																		}
																		className="px-1 py-0.5 w-fit rounded bg-blue-100 text-blue-800 border border-blue-400 text-xs cursor-pointer hover:bg-blue-200"
																	>
																		{/* {slot.start} - {slot.end} */}
																		{formatTime12Hour(
																			slot.start,
																		)}{' '}
																		-{' '}
																		{formatTime12Hour(
																			slot.end,
																		)}
																	</div>
																),
															)
														) : (
															<p className="text-sm text-gray-500">
																No available
																slots
															</p>
														)}
													</div>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 text-left">
														Booked Slots
													</label>
													<div className="flex-wrap max-h-[44px] overflow-y-auto border border-gray-300 rounded py-2 px-2 gap-1 flex">
														{matchingSlot.slots
															.booked.length >
														0 ? (
															matchingSlot.slots.booked.map(
																(slot, idx) => (
																	<div
																		key={
																			idx
																		}
																		className="px-1 py-0.5 w-fit rounded bg-green-100 text-green-800 border border-green-400 text-xs cursor-pointer hover:bg-green-200"
																	>
																		{/* {slot.start} - {slot.end} */}
																		{formatTime12Hour(
																			slot.start,
																		)}{' '}
																		-{' '}
																		{formatTime12Hour(
																			slot.end,
																		)}
																	</div>
																),
															)
														) : (
															<p className="text-sm text-gray-500">
																No booked slots
															</p>
														)}
													</div>
												</div>
											</div>
										);
									})()}
								<LocalizationProvider
									dateAdapter={AdapterDayjs}
								>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 appo-timepicker">
										<div>
											<label className="block text-sm font-medium text-gray-700 text-left">
												Start Time
											</label>
											<TimePicker
												value={
													appointment?.time_slot
														?.start
														? dayjs(
																appointment
																	.time_slot
																	.start,
																'HH:mm',
														  )
														: null
												}
												onChange={(newValue) => {
													setAppointment((prev) => ({
														...prev,
														time_slot: {
															...prev?.time_slot,
															start: dayjs(
																newValue,
															).format('HH:mm'),
														},
													}));
												}}
												readOnly={eventType === 'leave'}
												onOpen={(e) => {
													if (eventType === 'leave')
														e.preventDefault();
												}}
												componentsProps={{
													textField: {
														size: 'small',
														InputProps: {
															readOnly:
																eventType ===
																'leave',
														},
														sx: {
															'& .MuiInputBase-input':
																{
																	color: 'black',
																},
															'& .MuiInputBase-root':
																{
																	backgroundColor:
																		'#fff',
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
												value={
													appointment?.time_slot?.end
														? dayjs(
																appointment
																	.time_slot
																	.end,
																'HH:mm',
														  )
														: null
												}
												onChange={(newValue) => {
													setAppointment((prev) => ({
														...prev,
														time_slot: {
															...prev?.time_slot,
															end: dayjs(
																newValue,
															).format('HH:mm'),
														},
													}));
												}}
												readOnly={eventType === 'leave'}
												onOpen={(e) => {
													if (eventType === 'leave')
														e.preventDefault();
												}}
												componentsProps={{
													textField: {
														size: 'small',
														InputProps: {
															readOnly:
																eventType ===
																'leave',
														},
														sx: {
															'& .MuiInputBase-input':
																{
																	color: 'black',
																},
															'& .MuiInputBase-root':
																{
																	backgroundColor:
																		'#fff',
																},
														},
													},
												}}
											/>
										</div>
									</div>
								</LocalizationProvider>
								{eventType !== 'leave' && (
									<div>
										<label className="block text-sm font-medium text-gray-700 text-left">
											Select Patient
										</label>
										<select
											className="mt-1 block w-full rounded-md text-[14px] border border-gray-300 p-2"
											value={
												appointment?.patient_id || ''
											} // keep controlled
											onChange={(e) => {
												const selectedId =
													e.target.value;
												const selectedPatient =
													patients.find(
														(p) =>
															p._id ===
															selectedId,
													);

												if (selectedPatient) {
													setAppointment((prev) => ({
														...prev,
														patient_id:
															selectedPatient._id,
														patient_name: selectedPatient.full_name,
													}));
												}
											}}
										>
											<option value="">
												Select Patient
											</option>
											{patients?.map((patient) => (
												<option
													key={patient._id}
													value={patient._id}
												>
													{patient.full_name}
												</option>
											))}
										</select>
									</div>
								)}

								{eventType !== 'leave' && (
									<div>
										<label className="block text-sm font-medium text-gray-700 text-left">
											Visit Type
										</label>
										<select
											className="mt-1 block w-full rounded-md text-[14px] border border-gray-300 p-2"
											value={
												appointment?.visit_type || ''
											}
											onChange={(e) =>
												setAppointment((prev) => ({
													...prev,
													visit_type:
														e.target.value.toUpperCase(),
												}))
											}
										>
											<option value="">
												Select visit type
											</option>
											<option value="HOME">
												Home Visit
											</option>
											<option value="CLINIC">
												Clinic Visit
											</option>
										</select>
									</div>
								)}

								{(() => {
									const dayBooking = allBookings.find(
										(b) => b.date === appointment?.date,
									);
									const leaveEvents =
										dayBooking?.events?.filter(
											(e) => e.type === 'leave',
										) || [];

									if (leaveEvents.length > 0) {
										const dateText = appointment?.date
											? dayjs(appointment.date).format(
													'D MMMM, YYYY',
											  )
											: 'this date';

										const startTime =
											appointment?.time_slot?.start;
										const endTime =
											appointment?.time_slot?.end;

										let timeMessage = '';

										if (startTime && endTime) {
											timeMessage = `from ${dayjs(
												startTime,
												'HH:mm',
											).format('h:mm A')} to ${dayjs(
												endTime,
												'HH:mm',
											).format('h:mm A')}`;
										} else {
											const leaveTimes = leaveEvents
												.map((e) => {
													if (e.start && e.end) {
														return `${dayjs(
															e.start,
															'HH:mm',
														).format(
															'h:mm A',
														)} to ${dayjs(
															e.end,
															'HH:mm',
														).format('h:mm A')}`;
													}
													return null;
												})
												.filter(Boolean)
												.join(', ');
											if (leaveTimes)
												timeMessage = `during ${leaveTimes}`;
										}

										return (
											<div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded text-sm">
												{`You are on leave on ${dateText}${
													timeMessage
														? `, ${timeMessage}.`
														: '.'
												}`}
											</div>
										);
									}
									return null;
								})()}
							</form>
						</div>
						{eventType !== 'leave' && (
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
									className={`px-4 py-1 rounded-md transition text-white bg-[#1a6f8b] ${
										isFormValid
											? 'hover:bg-[#15596e] cursor-pointer'
											: 'cursor-not-allowed opacity-50'
									}`}
                                    form="appointmentForm"
									disabled={!isFormValid}
								>
									Save
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
export default BookAppointments;
