// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../../styles/dashboard/Home.css'; // Make sure this path is correct

// const Home = () => { // Receiving title prop from App.js route
// //   const [userName, setUserName] = useState("John Doe"); // Mock user name
//   const [welcomeMessage, setWelcomeMessage] = useState('');

//   useEffect(() => {
//     const getWelcomeMessage = () => {
//       const currentHour = new Date().getHours();
//       if (currentHour < 12) {
//         return "Good morning";
//       } else if (currentHour < 18) {
//         return "Good afternoon";
//       } else {
//         return "Good evening";
//       }
//     };
//     setWelcomeMessage(getWelcomeMessage());
//   }, []);

//   // Mock data for demonstration
//   const nextAppointment = {
//     date: '2025-09-10',
//     time: '10:30 AM',
//     therapist: 'Dr. Jane Smith',
//     location: 'Clinic Room 3'
//   };

//   const todayExercises = [
//     { id: 1, name: 'Knee Flexion', sets: '3 sets', reps: '10 reps' },
//     { id: 2, name: 'Shoulder Rotations', sets: '2 sets', reps: '15 reps' },
//   ];

//   const progressData = [
//     { month: 'Jul', pain: 8 },
//     { month: 'Aug', pain: 6 },
//     { month: 'Sep', pain: 4 },
//     { month: 'Oct', pain: 3 },
//   ];

//   const messages = [
//     { id: 1, sender: 'Dr. Jane Smith', snippet: 'Your new exercise plan is ready.', unread: true },
//     { id: 2, sender: 'Admin', snippet: 'Clinic will be closed on Nov 1st.', unread: false },
//   ];

//   const educationalContent = [
//     { id: 1, title: 'Understanding Chronic Pain', link: '#' },
//     { id: 2, title: 'Tips for Home Exercise', link: '#' },
//   ];

//   return (
//     <div className="home-dashboard">
//       <div className="welcome-section">
//         <h2>{welcomeMessage}, Ishita!</h2>
//         <p>Welcome back to your personalized health dashboard. Let's make progress today!</p>
//       </div>

//       <div className="dashboard-cards-grid">
//         {/* Next Appointment Card */}
//         <div className="dashboard-card appointment-card">
//           <h3>Upcoming Appointment</h3>
//           {nextAppointment ? (
//             <>
//               <p className="appointment-date">{new Date(nextAppointment.date).toDateString()} at {nextAppointment.time}</p>
//               <p>With: {nextAppointment.therapist}</p>
//               <p>Location: {nextAppointment.location}</p>
//               <Link to="/appointment" className="btn btn-primary">Manage Appointment</Link>
//             </>
//           ) : (
//             <p>No upcoming appointments. <Link to="/appointment">Book now!</Link></p>
//           )}
//         </div>

//         {/* Today's Exercises Card */}
//         <div className="dashboard-card exercise-card">
//           <h3>Today's Exercises</h3>
//           {todayExercises.length > 0 ? (
//             <ul>
//               {todayExercises.map(exercise => (
//                 <li key={exercise.id}>
//                   <strong>{exercise.name}</strong>: {exercise.sets}, {exercise.reps}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No exercises scheduled for today.</p>
//           )}
//           <Link to="/dashboard/user/exercises" className="btn btn-secondary">View Full Plan</Link>
//         </div>

//         {/* Progress Tracker Card - Simple Graph */}
//         <div className="dashboard-card progress-card">
//           <h3>My Progress</h3>
//           <p className="current-progress-text">Pain Level over Last 4 Months</p>
//           <div className="progress-chart-container">
//             {progressData.map((dataPoint, index) => (
//               <div key={index} className="chart-bar-wrapper">
//                 <div 
//                   className="chart-bar" 
//                   style={{ height: `${dataPoint.pain * 10}%`, backgroundColor: `var(--primary-color)` }}
//                   title={`Pain: ${dataPoint.pain}`}
//                 ></div>
//                 <span className="chart-label">{dataPoint.month}</span>
//               </div>
//             ))}
//           </div>
//           <p className="progress-insight">Great job! Your pain level has significantly reduced.</p>
//           <Link to="/dashboard/user/progress" className="btn btn-tertiary">Detailed Progress</Link>
//         </div>

//         {/* Messages Card */}
//         <div className="dashboard-card messages-card">
//           <h3>Messages ({messages.filter(msg => msg.unread).length} Unread)</h3>
//           {messages.length > 0 ? (
//             <ul className="message-list">
//               {messages.slice(0, 2).map(message => (
//                 <li key={message.id} className={message.unread ? 'unread' : ''}>
//                   <strong>{message.sender}:</strong> {message.snippet}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No new messages.</p>
//           )}
//           <Link to="/dashboard/user/messages" className="btn btn-secondary">View All Messages</Link>
//         </div>

//         {/* Educational Content Card */}
//         <div className="dashboard-card education-card">
//           <h3>Recommended Reading</h3>
//           {educationalContent.length > 0 ? (
//             <ul className="education-list">
//               {educationalContent.map(item => (
//                 <li key={item.id}>
//                   <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No recommendations at the moment.</p>
//           )}
//           <Link to="/dashboard/user/resources" className="btn btn-secondary">Explore All Resources</Link>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Home;



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
    // const today = new Date();
    // const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}>
            <div id="dashboard-content">
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




// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import './Dashboard.css';
// import { FaCalendarAlt, FaUserMd, FaUsers, FaChartLine, FaChartPie, FaChartBar, FaStethoscope } from 'react-icons/fa'; // Example icons

// // Mock Data for demonstration
// const mockPatientStats = {
//     today: 5,
//     thisWeek: 35,
//     thisMonth: 150,
//     completed: 12,
//     cancelled: 2,
//     upcoming: 25,
//     trend: 'up' // 'up' or 'down'
// };

// const mockAppointmentsData = [
//     { name: 'Mon', appointments: 15 },
//     { name: 'Tue', appointments: 20 },
//     { name: 'Wed', appointments: 18 },
//     { name: 'Thu', appointments: 25 },
//     { name: 'Fri', appointments: 22 },
//     { name: 'Sat', appointments: 10 },
//     { name: 'Sun', appointments: 5 },
// ];

// const mockPatientsByAge = [
//     { name: '0-18', value: 20 },
//     { name: '19-40', value: 45 },
//     { name: '41-60', value: 25 },
//     { name: '60+', value: 10 },
// ];
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example colors for pie chart

// const mockTreatmentProgress = [
//     { session: 'Week 1', score: 70 },
//     { session: 'Week 2', score: 65 },
//     { session: 'Week 3', score: 80 },
//     { session: 'Week 4', score: 85 },
//     { session: 'Week 5', score: 90 },
// ];

// const mockTopServices = [
//     { service: 'Back Pain', count: 120 },
//     { service: 'Knee Therapy', count: 90 },
//     { service: 'Post-Surgery Rehab', count: 75 },
//     { service: 'Sports Injury', count: 60 },
//     { service: 'Neck Pain', count: 50 },
// ];

// const mockDoctors = [
//     { id: 1, name: 'Dr. Anya Sharma', status: 'Online', shift: '9 AM - 5 PM', specialty: 'Orthopedic Rehab' },
//     { id: 2, name: 'Dr. Raj Patel', status: 'In Session', shift: '10 AM - 6 PM', specialty: 'Neurological Physio' },
//     { id: 3, name: 'Dr. Chloe Davis', status: 'Offline', shift: '1 PM - 9 PM', specialty: 'Pediatric Physio' },
// ];

// // Mock Appointments for Calendar (simplified for example)
// const mockCalendarAppointments = [
//     { id: 1, date: '2025-09-02', time: '10:00 AM', patient: 'Rahul Kumar', therapist: 'Dr. Sharma', status: 'Confirmed' },
//     { id: 2, date: '2025-09-02', time: '11:30 AM', patient: 'Priya Singh', therapist: 'Dr. Patel', status: 'Pending' },
//     { id: 3, date: '2025-09-02', time: '02:00 PM', patient: 'Amit Gupta', therapist: 'Dr. Sharma', status: 'Completed' },
//     { id: 4, date: '2025-09-03', time: '09:00 AM', patient: 'Neha Verma', therapist: 'Dr. Davis', status: 'Confirmed' },
// ];


// function Dashboard({ isDrawerOpen, toggleDrawer }) {
//     const [chartType, setChartType] = useState('bar'); // For Appointments Overview

//     // This useEffect would simulate data fetching
//     useEffect(() => {
//         // In a real app, fetch data here
//         console.log('Dashboard mounted or drawer state changed');
//     }, [isDrawerOpen]);

//     const today = new Date();
//     const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     return (
//         <div className={`dashboard-container ${isDrawerOpen ? 'drawer-open' : 'drawer-closed'}`}>
//             {/* Top Bar / Header - You'd likely have this in a parent component */}
//             <header className="dashboard-header">
//                 <h1>Welcome Back, Dr. [Your Name]!</h1>
//                 <p>{formattedDate}</p>
//                 <button onClick={toggleDrawer} className="drawer-toggle-button">
//                     {isDrawerOpen ? 'Close Drawer' : 'Open Drawer'}
//                 </button>
//             </header>

//             <div className="dashboard-content">
//                 {/* 2.1. Patient Overview Card (Hero Section) */}
//                 <div className="card patient-overview-card">
//                     <div className="card-header">
//                         <h2>Patient Overview</h2>
//                         <FaUsers size={24} color="var(--primary-color)" />
//                     </div>
//                     <div className="patient-stats">
//                         <div className="stat-item">
//                             <span className="stat-label">Patients This Month</span>
//                             <span className="stat-value">{mockPatientStats.thisMonth}</span>
//                             <span className={`trend ${mockPatientStats.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
//                                 {mockPatientStats.trend === 'up' ? '▲' : '▼'} 15%
//                             </span>
//                         </div>
//                         <div className="stat-grid">
//                             <div className="mini-stat">
//                                 <span className="mini-stat-label">Completed</span>
//                                 <span className="mini-stat-value">{mockPatientStats.completed}</span>
//                             </div>
//                             <div className="mini-stat">
//                                 <span className="mini-stat-label">Cancelled</span>
//                                 <span className="mini-stat-value">{mockPatientStats.cancelled}</span>
//                             </div>
//                             <div className="mini-stat">
//                                 <span className="mini-stat-label">Upcoming</span>
//                                 <span className="mini-stat-value">{mockPatientStats.upcoming}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 2.3. Doctor Availability Card */}
//                 <div className="card doctor-availability-card">
//                     <div className="card-header">
//                         <h2>Doctor Availability</h2>
//                         <FaUserMd size={24} color="var(--secondary-color)" />
//                     </div>
//                     <div className="doctor-list">
//                         {mockDoctors.map(doctor => (
//                             <div key={doctor.id} className="doctor-item">
//                                 <span className={`status-indicator ${doctor.status.toLowerCase().replace(' ', '-')}`}></span>
//                                 <div className="doctor-info">
//                                     <span className="doctor-name">{doctor.name}</span>
//                                     <span className="doctor-specialty">{doctor.specialty}</span>
//                                 </div>
//                                 <span className="doctor-shift">{doctor.shift}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* 2.2. Appointment Management Card (Interactive Calendar) */}
//                 <div className="card appointment-calendar-card">
//                     <div className="card-header">
//                         <h2>Appointments</h2>
//                         <FaCalendarAlt size={24} color="var(--tertiary-color)" />
//                         <button className="add-appointment-btn">+ Add New</button>
//                     </div>
//                     <div className="calendar-view">
//                         {/* Simplified calendar view - in a real app, this would be a full calendar component */}
//                         <div className="calendar-header-days">
//                             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
//                         </div>
//                         <div className="calendar-appointments">
//                             <h3>{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
//                             {mockCalendarAppointments
//                                 .filter(app => app.date === today.toISOString().slice(0, 10)) // Filter for today
//                                 .map(app => (
//                                 <div key={app.id} className={`appointment-item status-${app.status.toLowerCase()}`}>
//                                     <span className="app-time">{app.time}</span>
//                                     <span className="app-patient">{app.patient}</span>
//                                     <span className="app-therapist">({app.therapist})</span>
//                                     {/* Draggable handle would go here */}
//                                 </div>
//                             ))}
//                             {mockCalendarAppointments.filter(app => app.date === today.toISOString().slice(0, 10)).length === 0 && (
//                                 <p className="no-appointments">No appointments today.</p>
//                             )}
//                         </div>
//                     </div>
//                     <div className="calendar-actions">
//                         <button className="btn-filter">Filter</button>
//                         <button className="btn-view-all">View All</button>
//                     </div>
//                 </div>

//                 {/* 2.4. Appointments Overview (Bar/Line Chart) */}
//                 <div className="card appointments-overview-chart">
//                     <div className="card-header">
//                         <h2>Appointments Trends</h2>
//                         <FaChartLine size={24} color="var(--quaternary-color)" />
//                         <div className="chart-type-toggle">
//                             <button onClick={() => setChartType('bar')} className={chartType === 'bar' ? 'active' : ''}>Bar</button>
//                             <button onClick={() => setChartType('line')} className={chartType === 'line' ? 'active' : ''}>Line</button>
//                         </div>
//                     </div>
//                     <ResponsiveContainer width="100%" height={250}>
//                         {chartType === 'bar' ? (
//                             <BarChart data={mockAppointmentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                                 <XAxis dataKey="name" stroke="var(--text-color-light)" />
//                                 <YAxis stroke="var(--text-color-light)" />
//                                 <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
//                                 <Legend />
//                                 <Bar dataKey="appointments" fill="var(--primary-color)" />
//                             </BarChart>
//                         ) : (
//                             <LineChart data={mockAppointmentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                                 <XAxis dataKey="name" stroke="var(--text-color-light)" />
//                                 <YAxis stroke="var(--text-color-light)" />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Line type="monotone" dataKey="appointments" stroke="var(--primary-color)" strokeWidth={2} activeDot={{ r: 8 }} />
//                             </LineChart>
//                         )}
//                     </ResponsiveContainer>
//                 </div>

//                 {/* 2.5. Patients by Age Group (Pie Chart / Donut Chart) */}
//                 <div className="card patients-by-age-chart">
//                     <div className="card-header">
//                         <h2>Patients by Age Group</h2>
//                         <FaChartPie size={24} color="var(--accent-color)" />
//                     </div>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                             <Pie
//                                 data={mockPatientsByAge}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={60}
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 paddingAngle={5}
//                                 dataKey="value"
//                                 labelLine={false}
//                                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                             >
//                                 {mockPatientsByAge.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                             <Legend />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* 2.6. Treatment Progress (Line Chart) */}
//                 <div className="card treatment-progress-chart">
//                     <div className="card-header">
//                         <h2>Avg. Treatment Progress</h2>
//                         <FaChartBar size={24} color="var(--primary-color)" />
//                     </div>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <LineChart data={mockTreatmentProgress} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                             <XAxis dataKey="session" stroke="var(--text-color-light)" />
//                             <YAxis domain={[0, 100]} stroke="var(--text-color-light)" />
//                             <Tooltip />
//                             <Legend />
//                             <Line type="monotone" dataKey="score" stroke="var(--secondary-color)" strokeWidth={2} activeDot={{ r: 8 }} />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* 2.7. Top Services Availed (Bar Chart) */}
//                 <div className="card top-services-chart">
//                     <div className="card-header">
//                         <h2>Top Services Availed</h2>
//                         <FaStethoscope size={24} color="var(--tertiary-color)" />
//                     </div>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <BarChart
//                             layout="vertical"
//                             data={mockTopServices}
//                             margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                             <XAxis type="number" stroke="var(--text-color-light)" />
//                             <YAxis dataKey="service" type="category" stroke="var(--text-color-light)" />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="count" fill="var(--quaternary-color)" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;