import React, { useState, useEffect } from 'react';
import { useDashboardApi } from '../../api/dashboardApi';
import ChartComponent from '../../components/ChartComponent';
import {
	CircularProgress,
	MenuItem,
	Select,
	FormControl,
	Pagination,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { showAlert } from '../../components/AlertComponent';

function Dashboard({ isDrawerOpen }) {
	const { getChart } = useDashboardApi();
	const [charts, setCharts] = useState([
		{ option: null },
		{ option: null },
		{ option: null },
		{ option: null },
	]);

	const [loading, setLoading] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);
	const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
	const [toDate, setToDate] = useState(dayjs().endOf('month'));
	const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
	const [selectedYear, setSelectedYear] = useState(dayjs().year());
	const [totals, setTotals] = useState({
		totalAppointments: 0,
		totalPatients: 0,
		newPatients: 0,
		totalDoctors: 0,
	});
	const [staffLeaves, setStaffLeaves] = useState([]);
	const [availableStaff, setAvailableStaff] = useState([]);
	const [tableLimit] = useState(5);
	const [staffLeavesPage, setStaffLeavesPage] = useState(1);
	const [availableStaffPage, setAvailableStaffPage] = useState(1);
	const [staffLeavesTotal, setStaffLeavesTotal] = useState(0);
	const [availableStaffTotal, setAvailableStaffTotal] = useState(0);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
		'All',
	];

	const years = Array.from({ length: 12 }, (_, i) => dayjs().year() - i);

	const colorMapping = {
		CONFIRMED: '#51CC04',
		CANCELLED: '#FA4032',
		COMPLETED: '#0079FF',
	};

	const patientColorMapping = {
		CONTINUE: '#51CC04',
		DISCONTINUE: '#FA4032',
		ALTERNATE: '#05DFD7',
		WEEKLY: '#ff9800',
		DISCHARGE: '#0079FF',
		OBSERVATION: '#ffeb3b',
	};

	const leaveColorMapping = {
		PENDING: '#51CC04',
		CONFIRMED: '#0079FF',
		CANCELLED: '#FA4032',
	};
	const formatDate = (date) => {
		const d = new Date(date);
		return d instanceof Date && !isNaN(d)
			? d.toLocaleDateString('en-GB')
			: date;
	};

	const getLineChartOption = (data) => {
		const formattedXAxis = data.xAxis?.map(formatDate) || [];

		return {
			backgroundColor: '#fff',
			title: {
				text: 'Appointment Trends by Status',
				left: 'center',
				textStyle: { fontSize: 16, fontWeight: 'bold' },
			},
			// tooltip: { trigger: 'axis' },
			tooltip: {
				trigger: 'axis',
				backgroundColor: '#fff',
				borderWidth: 1,
				textStyle: { fontSize: 12 },
				formatter: (params) => {
					if (!params?.length) return '';

					const date = params[0].axisValue;

					let tooltipHTML = `
					
						<div style="font-weight:bold;margin-bottom:6px;text-align:left;">${date}</div>
				`;

					params.forEach((item) => {
						const color =
							colorMapping[item.seriesName?.toUpperCase()] ||
							item.color ||
							'#888';

						tooltipHTML += `
						<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
							<span style="
								display:inline-block;
								width:10px;
								height:10px;
								border-radius:50%;
								background-color:${color};
							"></span>
							<span style="color:${color};font-size:12px;">
								${item.seriesName}: ${item.data}
							</span>
						</div>
					`;
					});

					tooltipHTML += `</div>`;
					return tooltipHTML;
				},
			},

			legend: {
				data: data.legend,
				top: 'bottom',
				textStyle: { fontSize: 12 },
			},
			grid: {
				left: '5%',
				right: '3%',
				bottom: '15%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				name: 'Date',
				nameLocation: 'middle',
				nameGap: 55,
				data: formattedXAxis,
				nameTextStyle: { fontWeight: 'bold', fontSize: 12 },
				axisTick: {
					alignWithLabel: true,
				},
				axisLabel: {
					rotate: 30,
					fontSize: 12,
				},
			},
			yAxis: {
				type: 'value',
				name: 'No. of Appointments',
				minInterval: 1,
				nameTextStyle: {
					fontWeight: 'bold',
					fontSize: 12,
				},
				nameLocation: 'middle',
				nameGap: 30,
			},
			series: data.series?.map((s) => ({
				name: s.name,
				type: 'line',
				smooth: true,
				data: s.data,
				itemStyle: {
					color: colorMapping[s.name?.toUpperCase()] || '#888',
				},
			})),
		};
	};
	const getPieChartOption = (data) => {
		const fixedOrder = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

		const pieData =
			data.series[0]?.data
				?.slice()
				.sort(
					(a, b) =>
						fixedOrder.indexOf(a.name) - fixedOrder.indexOf(b.name),
				)
				.map((item) => ({
					...item,
					itemStyle: {
						color: colorMapping[item.name?.toUpperCase()] || '#888',
					},
				})) || [];

		return {
			backgroundColor: '#fff',
			title: {
				text: 'Appointment Status',
				left: 'center',
				textStyle: { fontSize: 16, fontWeight: 'bold' },
			},
			tooltip: {
				trigger: 'item',
				formatter: (params) => {
					const color = params.color;
					return `
					<div style="display:flex;align-items:center;gap:6px;">
						<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};"></span>
						<span style="color:${color};font-size:12px;">
							${params.name}: ${params.value} (${params.percent}%)
						</span>
					</div>
				`;
				},
			},
			legend: {
				top: 'bottom',
				data: pieData.map((item) => item.name),
				textStyle: { fontSize: 12 },
			},
			series: [
				{
					name: 'Appointments',
					type: 'pie',
					radius: '50%',
					data: pieData,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
			],
		};
	};
	const getPatientStatusOption = (data) => {
		return {
			backgroundColor: '#fff',
			title: {
				text: 'Patients by Status',
				left: 'center',
				textStyle: { fontSize: 16, fontWeight: 'bold' },
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' },
				formatter: (params) => {
					const item = params[0];
					return `
					<div style="display:flex;align-items:center;gap:6px;">
						<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};"></span>
						<span style="color:${item.color};font-size:12px;">
							${item.axisValue}: ${item.data}
						</span>
					</div>
				`;
				},
			},
			grid: {
				left: '5%',
				right: '3%',
				bottom: '15%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				name: 'Patient Status',
				data: data.xAxis,
				nameLocation: 'middle',
				nameGap: 50,
				axisLabel: {
					fontSize: 12,
				},
				nameTextStyle: { fontWeight: 'bold', fontSize: 12 },
				axisTick: { alignWithLabel: true },
			},
			yAxis: {
				type: 'value',
				name: 'No. of Patients',
				minInterval: 1,
				nameTextStyle: { fontWeight: 'bold', fontSize: 12 },
			},
			series: [
				{
					name: 'Patients',
					type: 'bar',
					data: data.series?.[0]?.data || [],
					itemStyle: {
						color: function (params) {
							const name = params.name?.toUpperCase();
							return (
								patientColorMapping[name] || '#888' // fallback color
							);
						},
					},
					emphasis: { focus: 'series' },
				},
			],
		};
	};
	const getLeavePieChartOption = (data) => {
		const fixedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];

		const pieData =
			data.series[0]?.data
				?.slice()
				.sort(
					(a, b) =>
						fixedStatuses.indexOf(a.name) -
						fixedStatuses.indexOf(b.name),
				)
				.map((item) => ({
					...item,
					itemStyle: {
						color:
							leaveColorMapping[item.name?.toUpperCase()] ||
							'#888',
					},
				})) || [];
		return {
			backgroundColor: '#fff',
			title: {
				text: 'Doctor Leaves by Status',
				left: 'center',
				textStyle: { fontSize: 16, fontWeight: 'bold' },
			},
			tooltip: {
				trigger: 'item',
				formatter: (params) => {
					return `
					<div style="display:flex;align-items:center;gap:6px;">
						<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${params.color};"></span>
						<span style="color:${params.color};font-size:12px;">
							${params.name}: ${params.value} (${params.percent}%)
						</span>
					</div>
				`;
				},
			},
			legend: {
				top: 'bottom',
				data: pieData.map((item) => item.name),
				textStyle: { fontSize: 12 },
			},
			series: [
				{
					name: 'Staff Leaves',
					type: 'pie',
					radius: '50%',
					data: pieData,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
			],
		};
	};

	const fetchStaffLeaves = async (page = 1) => {
		try {
			setLoading((prev) => {
				const updated = [...prev];
				updated[5] = true;
				return updated;
			});

			const response = await getChart({
				chartName: 'todays_staff_leaves',
				skip: (page - 1) * tableLimit,
				limit: tableLimit,
			});

			if (response?.data) {
				setStaffLeaves(response.data);
				setStaffLeavesTotal(response.totalCount);
			}
		} catch (error) {
			console.error('Error fetching staff leaves:', error);
		} finally {
			setLoading((prev) => {
				const updated = [...prev];
				updated[5] = false;
				return updated;
			});
		}
	};

	const fetchAvailableStaff = async (page = 1) => {
		try {
			setLoading((prev) => {
				const updated = [...prev];
				updated[6] = true;
				return updated;
			});

			const response = await getChart({
				chartName: 'todays_staff_available',
				skip: (page - 1) * tableLimit,
				limit: tableLimit,
			});

			if (response?.data) {
				setAvailableStaff(response.data);
				setAvailableStaffTotal(response.totalCount);
			}
		} catch (error) {
			console.error('Error fetching available staff:', error);
		} finally {
			setLoading((prev) => {
				const updated = [...prev];
				updated[6] = false;
				return updated;
			});
		}
	};
	const fetchCharts = async (filter) => {
		try {
			setLoading((prev) => [
				true,
				true,
				true,
				true,
				true,
				...prev.slice(5),
			]);

			const defaultFilter = {
				from: fromDate ? fromDate.format('YYYY-MM-DD') : null,
				to: toDate ? toDate.format('YYYY-MM-DD') : null,
			};
			const applyFilter = filter || defaultFilter;

			const lineResponse = await getChart({
				chartName: 'appointmnet_trend_by_status',
				filter: applyFilter,
			});
			const lineData = lineResponse?.data || {};
			const lineOption = getLineChartOption(lineData);

			const pieResponse = await getChart({
				chartName: 'appointment_status',
				filter: applyFilter,
			});
			const pieData = pieResponse?.data || {};
			const pieOption = getPieChartOption(pieData);

			const patientResponse = await getChart({
				chartName: 'patient_status',
				filter: applyFilter,
			});
			const patientData = patientResponse?.data || {};
			const patientOption = getPatientStatusOption(patientData);

			const leavePieResponse = await getChart({
				chartName: 'doctor_leaves',
				filter: applyFilter,
			});
			const leavePieData = leavePieResponse?.data || {};
			const leavePieOption = getLeavePieChartOption(leavePieData);

			const totalsResponse = await getChart({
				chartName: 'dashboard_totals',
				filter: applyFilter,
			});
			if (totalsResponse?.data) setTotals(totalsResponse.data);

			setCharts([
				{ option: lineOption },
				{ option: pieOption },
				{ option: leavePieOption },
				{ option: patientOption },
			]);
		} catch (error) {
			console.error('Error fetching charts:', error);
		} finally {
			setLoading((prev) => [
				false,
				false,
				false,
				false,
				false,
				...prev.slice(5),
			]);
		}
	};

	const resetFilters = () => {
		const firstDay = dayjs().startOf('month');
		const lastDay = dayjs().endOf('month');

		setSelectedMonth(dayjs().month() + 1);
		setSelectedYear(dayjs().year());
		setFromDate(firstDay);
		setToDate(lastDay);
		const filter = {
			from: firstDay.format('YYYY-MM-DD'),
			to: lastDay.format('YYYY-MM-DD'),
		};
		fetchCharts(filter);
	};

	useEffect(() => {
		fetchCharts();
		fetchStaffLeaves(staffLeavesPage);
		fetchAvailableStaff(availableStaffPage);
	}, []);

	return (
		<div
			id="dashboard-container"
			className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
			style={{
				height: 'calc(100vh - 60px)',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: '#f5f7fa',
			}}
		>
			<div className="sticky top-0 z-20 bg-[#f5f7fa]">
				<span
					className="text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee]"
					style={{ fontFamily: "'Arial', sans-serif" }}
				>
					My Dashboard
				</span>
				{/* <div className="flex flex-wrap items-center gap-3 px-[20px] py-4 justify-end">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className="flex gap-2 items-center filter-daterange">
							<DatePicker
								value={fromDate}
								onChange={(newValue) => setFromDate(newValue)}
								format="DD/MM/YYYY"
							/>
							<span className="text-gray-600">-</span>
							<DatePicker
								format="DD/MM/YYYY"
								value={toDate}
								onChange={(newValue) => setToDate(newValue)}
							/>
						</div>
					</LocalizationProvider>

					<FormControl
						size="small"
						sx={{ minWidth: 120 }}
					>
						<Select
							value={selectedMonth}
							className="bg-white"
							onChange={(e) => {
								const month = e.target.value;
								setSelectedMonth(month);

								let firstDay, lastDay;

								if (month === 13) {
									// 'All' selected (index 13 because it's last in months array, 0-based)
									firstDay = dayjs()
										.year(selectedYear)
										.startOf('year');
									lastDay = dayjs()
										.year(selectedYear)
										.endOf('year');
								} else {
									// specific month selected
									firstDay = dayjs()
										.year(selectedYear)
										.month(month - 1)
										.startOf('month');
									lastDay = dayjs()
										.year(selectedYear)
										.month(month - 1)
										.endOf('month');
								}

								setFromDate(firstDay);
								setToDate(lastDay);
							}}
						>
							{months.map((month, index) => (
								<MenuItem
									key={index}
									value={index + 1}
								>
									{month}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						size="small"
						sx={{ minWidth: 120 }}
					>
						<Select
							value={selectedYear}
							className="bg-white"
							onChange={(e) => {
								const year = e.target.value;
								setSelectedYear(year);

								let firstDay, lastDay;

								if (selectedMonth === 13) {
									// 'All' selected, set full year
									firstDay = dayjs()
										.year(year)
										.startOf('year');
									lastDay = dayjs().year(year).endOf('year');
								} else {
									// specific month selected
									firstDay = dayjs()
										.year(year)
										.month(selectedMonth - 1)
										.startOf('month');
									lastDay = dayjs()
										.year(year)
										.month(selectedMonth - 1)
										.endOf('month');
								}

								setFromDate(firstDay);
								setToDate(lastDay);
							}}
						>
							{years.map((year) => (
								<MenuItem
									key={year}
									value={year}
								>
									{year}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<button
						className="bg-[#1a6f8b] text-white px-4 py-2 rounded"
						onClick={() => {
							const filter = {
								from: fromDate
									? fromDate.format('YYYY-MM-DD')
									: null,
								to: toDate ? toDate.format('YYYY-MM-DD') : null,
							};
							fetchCharts(filter);
						}}
					>
						Search
					</button>
					<button
						className="bg-[#1a6f8b] text-white px-4 py-2 rounded"
						onClick={resetFilters}
					>
						Clear
					</button>
				</div> */}

				<div className="flex flex-wrap items-center gap-3 px-[20px] py-4 justify-end">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className="flex gap-2 items-center filter-daterange">
						<DatePicker
							value={fromDate}
							onChange={(newValue) => {
							setFromDate(newValue);
							if (newValue || toDate) {
								// If custom date picked, clear month selection
								setSelectedMonth(null);
							}
							}}
							format="DD/MM/YYYY"
						/>
						<span className="text-gray-600">-</span>
						<DatePicker
							value={toDate}
							onChange={(newValue) => {
							setToDate(newValue);
							if (newValue || fromDate) {
								// If custom date picked, clear month selection
								setSelectedMonth(null);
							}
							}}
							format="DD/MM/YYYY"
						/>
						</div>
					</LocalizationProvider>
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<Select
						value={selectedMonth || ''}
						displayEmpty
						className="bg-white"
						onChange={(e) => {
							const month = e.target.value;
							setSelectedMonth(month);

							if (!month) return; // handle empty selection

							let firstDay, lastDay;

							if (month === 13) {
							// 'All' selected (Full year)
							firstDay = dayjs().year(selectedYear).startOf('year');
							lastDay = dayjs().year(selectedYear).endOf('year');
							} else {
							// specific month selected
							firstDay = dayjs()
								.year(selectedYear)
								.month(month - 1)
								.startOf('month');
							lastDay = dayjs()
								.year(selectedYear)
								.month(month - 1)
								.endOf('month');
							}

							setFromDate(firstDay);
							setToDate(lastDay);
						}}
						>
						<MenuItem value="">Select Month</MenuItem>
						{months.map((month, index) => (
							<MenuItem key={index} value={index + 1}>
							{month}
							</MenuItem>
						))}
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<Select
						value={selectedYear}
						className="bg-white"
						onChange={(e) => {
							const year = e.target.value;
							setSelectedYear(year);

							if (selectedMonth) {
							let firstDay, lastDay;

							if (selectedMonth === 13) {
								// 'All' selected
								firstDay = dayjs().year(year).startOf('year');
								lastDay = dayjs().year(year).endOf('year');
							} else {
								// specific month
								firstDay = dayjs()
								.year(year)
								.month(selectedMonth - 1)
								.startOf('month');
								lastDay = dayjs()
								.year(year)
								.month(selectedMonth - 1)
								.endOf('month');
							}

							setFromDate(firstDay);
							setToDate(lastDay);
							}
						}}
						>
						{years.map((year) => (
							<MenuItem key={year} value={year}>
							{year}
							</MenuItem>
						))}
						</Select>
					</FormControl>
					<button
						className="bg-[#1a6f8b] text-white px-4 py-2 rounded"
						onClick={() => {
							// Validation: if one date is selected but not the other
							if ((fromDate && !toDate) || (!fromDate && toDate)) {
							showAlert("Please select both From and To dates before searching.");
							return;
							}

							let finalFrom = fromDate;
							let finalTo = toDate;

							// If both empty but month/year selected → set based on month
							if ((!fromDate || !toDate) && selectedMonth) {
							if (selectedMonth === 13) {
								finalFrom = dayjs().year(selectedYear).startOf("year");
								finalTo = dayjs().year(selectedYear).endOf("year");
							} else {
								finalFrom = dayjs()
								.year(selectedYear)
								.month(selectedMonth - 1)
								.startOf("month");
								finalTo = dayjs()
								.year(selectedYear)
								.month(selectedMonth - 1)
								.endOf("month");
							}
							setFromDate(finalFrom);
							setToDate(finalTo);
							}

							const filter = {
							from: finalFrom ? finalFrom.format("YYYY-MM-DD") : null,
							to: finalTo ? finalTo.format("YYYY-MM-DD") : null,
							};

							fetchCharts(filter);
						}}
						>
						Search
					</button>
					<button
						className="bg-[#1a6f8b] text-white px-4 py-2 rounded"
						onClick={resetFilters}
					>
						Clear
					</button>
				</div>

			</div>

			<div className="flex-1 overflow-y-auto px-[20px] pb-[20px]">
				<div className="flex flex-wrap gap-6 pt-1 h-[100px]">
					<div className="bg-white p-4 rounded shadow flex-1 text-center border border-gray-200">
						{loading[4] ? (
							<div className="flex justify-center items-center h-full">
								<CircularProgress size={20} />
							</div>
						) : (
							<>
								<span className="text-gray-500 text-sm">
									Total Appointments
								</span>
								<div className="text-2xl font-bold text-[#0079FF] pt-2">
									{totals.totalAppointments}
								</div>
							</>
						)}
					</div>
					<div className="bg-white p-4 rounded shadow flex-1 text-center border border-gray-200">
						{loading[4] ? (
							<div className="flex justify-center items-center h-full">
								<CircularProgress size={20} />
							</div>
						) : (
							<>
								<span className="text-gray-500 text-sm">
									Total Patients
								</span>
								<div className="text-2xl font-bold text-[#51CC04] pt-2">
									{totals.totalPatients}
								</div>
							</>
						)}
					</div>
					<div className="bg-white p-4 rounded shadow flex-1 text-center border border-gray-200">
						{loading[4] ? (
							<div className="flex justify-center items-center h-full">
								<CircularProgress size={20} />
							</div>
						) : (
							<>
								<span className="text-gray-500 text-sm">
									New Patients (This Month)
								</span>
								<div className="text-2xl font-bold text-[#ff9800] pt-2">
									{totals.newPatients}
								</div>
							</>
						)}
					</div>
					<div className="bg-white p-4 rounded shadow flex-1 text-center border border-gray-200">
						{loading[4] ? (
							<div className="flex justify-center items-center h-full">
								<CircularProgress size={20} />
							</div>
						) : (
							<>
								<span className="text-gray-500 text-sm">
									Total Doctors
								</span>
								<div className="text-2xl font-bold text-[#05DFD7] pt-2">
									{totals.totalDoctors}
								</div>
							</>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-6 mt-6">
					<div className="bg-white p-4 rounded shadow flex-1 border border-gray-200">
						{loading[5] ? (
							<div className="flex justify-center items-center h-72 w-full">
								<CircularProgress size={30} />
							</div>
						) : staffLeaves?.length === 0 ? (
							<span className="text-gray-500 flex items-center h-full justify-center">
								Today, no doctors are on leave.
							</span>
						) : (
							<div className="h-72 flex flex-col gap-2">
								<div className="flex justify-between">
									<h3 className="text-lg font-semibold">
										Today's Doctor Leaves
									</h3>
									<Pagination
										count={Math.ceil(
											staffLeavesTotal / tableLimit,
										)}
										page={staffLeavesPage}
										onChange={(e, page) => {
											setStaffLeavesPage(page);
											fetchStaffLeaves(page);
										}}
										size="small"
										color="primary"
										className="member-pagination"
									/>
								</div>
								<table className="min-w-full border border-gray-200">
									<thead className="bg-gray-100 sticky top-[-1px] z-10 border border-gray-200">
										<tr className="text-left text-[13px]">
											<th className="px-4 py-2 border-b">
												Doctor Name
											</th>
											<th className="px-4 py-2 border-b">
												Leave Type
											</th>
										</tr>
									</thead>
									<tbody>
										{staffLeaves.map((leave, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50 text-[13px] text-left"
											>
												<td className="px-4 py-2 border-b">
													{leave.staffName}
												</td>
												{/* <td className="px-4 py-2 border-b">
													{leave.leaveType}
												</td> */}
												<td className="px-4 py-2 border-b">
													{leave.leaveType === "FIRST_HALF"
														? "First Half"
														: leave.leaveType === "SECOND_HALF"
														? "Second Half"
														: leave.leaveType === "FULL_DAY"
														? "Full Day"
														: leave.leaveType}
												</td>

											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					<div className="bg-white p-4 rounded shadow flex-1 border border-gray-200">
						{loading[6] ? (
							<div className="flex justify-center items-center h-72 w-full">
								<CircularProgress size={30} />
							</div>
						) : availableStaff.length === 0 ? (
							<p className="text-gray-500">
								No available staff found.
							</p>
						) : (
							<>
								<div className="h-72 flex flex-col gap-2">
									<div className="flex justify-between">
										<h3 className="text-lg font-semibold">
											Today's Available Doctor
										</h3>
										<Pagination
											count={Math.ceil(
												availableStaffTotal /
													tableLimit,
											)}
											page={availableStaffPage}
											onChange={(e, page) => {
												setAvailableStaffPage(page);
												fetchAvailableStaff(page);
											}}
											size="small"
											color="primary"
											className="member-pagination"
										/>
									</div>
									<table className="min-w-full border border-gray-200">
										<thead className="bg-gray-100 sticky top-[-1px] z-10 border border-gray-200">
											<tr className="text-left text-[13px]">
												<th className="px-4 py-2 border-b">
													Doctor Name
												</th>
												<th className="px-4 py-2 border-b">
													Available Time
												</th>
											</tr>
										</thead>
										<tbody>
											{availableStaff.map(
												(staff, index) => (
													<tr
														key={index}
														className="hover:bg-gray-50 text-left text-[13px]"
													>
														<td className="px-4 py-2 border-b">
															{staff.doctorName}
														</td>
														<td className="px-4 py-2 border-b">
															{
																staff.availableTime
															}
														</td>
													</tr>
												),
											)}
										</tbody>
									</table>
								</div>
							</>
						)}
					</div>
				</div>

				{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{charts.map((chart, i) => (
						<div
							key={i}
							className="bg-white rounded shadow-md border border-gray-200 p-4"
							style={{ height: '400px' }}
						>
							{loading[i] ? (
								<div className="flex justify-center items-center h-full w-full">
									<CircularProgress size={30} />
								</div>
							) : (
								<ChartComponent option={chart.option} />
							)}
						</div>
					))}
				</div> */}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{charts.map((chart, i) => {
						const hasData =
							Array.isArray(chart.option?.series) &&
							chart.option.series.some(
								(s) =>
									Array.isArray(s.data) &&
									s.data.some(
										(d) =>
											d !== null &&
											d !== undefined &&
											d !== '',
									),
							);

						return (
							<div
								key={i}
								className="bg-white rounded shadow-md border border-gray-200 p-4"
								style={{ height: '400px' }}
							>
								{loading[i] ? (
									<div className="flex justify-center items-center h-full w-full">
										<CircularProgress size={30} />
									</div>
								) : hasData ? (
									<ChartComponent option={chart.option} />
								) : (
									<div className="flex justify-center items-center h-full text-gray-500">
										No data available
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
