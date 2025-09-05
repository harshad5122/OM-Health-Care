
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/dashboard/Dashboard.css';
import { FaUserMd, FaUsers, FaChartLine, FaChartPie, FaChartBar, FaStethoscope } from 'react-icons/fa';

// Mock Data
const mockPatientStats = {
    thisMonth: 150,
    completed: 12,
    cancelled: 2,
    upcoming: 25,
    trend: 'up'
};

const mockAppointmentsData = [
    { name: 'Mon', appointments: 15 },
    { name: 'Tue', appointments: 20 },
    { name: 'Wed', appointments: 18 },
    { name: 'Thu', appointments: 25 },
    { name: 'Fri', appointments: 22 },
    { name: 'Sat', appointments: 10 },
    { name: 'Sun', appointments: 5 },
];

const mockPatientsByAge = [
    { name: '0-18', value: 20 },
    { name: '19-40', value: 45 },
    { name: '41-60', value: 25 },
    { name: '60+', value: 10 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockTreatmentProgress = [
    { session: 'Week 1', score: 70 },
    { session: 'Week 2', score: 65 },
    { session: 'Week 3', score: 80 },
    { session: 'Week 4', score: 85 },
    { session: 'Week 5', score: 90 },
];

const mockTopServices = [
    { service: 'Back Pain', count: 120 },
    { service: 'Knee Therapy', count: 90 },
    { service: 'Post-Surgery Rehab', count: 75 },
    { service: 'Sports Injury', count: 60 },
    { service: 'Neck Pain', count: 50 },
];

const mockDoctors = [
    { id: 1, name: 'Dr. Gopi Dholariya', status: 'Online', shift: '9 AM - 5 PM', specialty: 'Physiotherapy Rehab' },
];

function Dashboard({ isDrawerOpen }) {
    const [chartType, setChartType] = useState('bar');

    return (
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
         style={{ height: "calc(100vh - 60px)",display:"flex",flexDirection:"column"}}
        >
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                My Dashboard
            </span>
            <div id="dashboard-content"  style={{ flex: 1, overflowY: "auto" }}>
                {/* Patient Overview Card */}
                <div id="patient-overview-card" className="card">
                    <div className="card-header">
                        <h2>Patient Overview</h2>
                        <FaUsers size={24} />
                    </div>
                    <div id="patient-stats">
                        <div className="stat-item">
                            <span className="stat-label">Patients This Month</span>
                            <span className="stat-value">{mockPatientStats.thisMonth}</span>
                            <span className={`trend ${mockPatientStats.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                                {mockPatientStats.trend === 'up' ? '▲' : '▼'} 15%
                            </span>
                        </div>
                        <div id="stat-grid">
                            <div className="mini-stat">
                                <span className="mini-stat-label">Completed</span>
                                <span className="mini-stat-value">{mockPatientStats.completed}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="mini-stat-label">Cancelled</span>
                                <span className="mini-stat-value">{mockPatientStats.cancelled}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="mini-stat-label">Upcoming</span>
                                <span className="mini-stat-value">{mockPatientStats.upcoming}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Availability Card */}
                <div id="doctor-availability-card" className="card">
                    <div className="card-header">
                        <h2>Doctor Availability</h2>
                        <FaUserMd size={24} />
                    </div>
                    <div id="doctor-list">
                        {mockDoctors.map(doctor => (
                            <div key={doctor.id} className="doctor-item">
                                <span className={`status-indicator ${doctor.status.toLowerCase().replace(' ', '-')}`}></span>
                                <div className="doctor-info">
                                    <span className="doctor-name">{doctor.name}</span>
                                    <span className="doctor-specialty">{doctor.specialty}</span>
                                </div>
                                <span className="doctor-shift">{doctor.shift}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appointments Chart */}
                <div id="appointments-chart-card" className="card">
                    <div className="card-header">
                        <h2>Appointments Trends</h2>
                        <FaChartLine size={24} />
                        <div id="chart-type-toggle">
                            <button onClick={() => setChartType('bar')} className={chartType === 'bar' ? 'active' : ''}>Bar</button>
                            <button onClick={() => setChartType('line')} className={chartType === 'line' ? 'active' : ''}>Line</button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        {chartType === 'bar' ? (
                            <BarChart data={mockAppointmentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="appointments" fill="#3f51b5" />
                            </BarChart>
                        ) : (
                            <LineChart data={mockAppointmentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="appointments" stroke="#3f51b5" strokeWidth={2} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Patients by Age Group */}
                <div id="patients-age-card" className="card">
                    <div className="card-header">
                        <h2>Patients by Age Group</h2>
                        <FaChartPie size={24} />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={mockPatientsByAge}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {mockPatientsByAge.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Treatment Progress */}
                <div id="treatment-progress-card" className="card">
                    <div className="card-header">
                        <h2>Avg. Treatment Progress</h2>
                        <FaChartBar size={24} />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockTreatmentProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="session" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#f50057" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Services */}
                <div id="top-services-card" className="card">
                    <div className="card-header">
                        <h2>Top Services Availed</h2>
                        <FaStethoscope size={24} />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            layout="vertical"
                            data={mockTopServices}
                            margin={{ left: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="service" type="category" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#00bcd4" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


