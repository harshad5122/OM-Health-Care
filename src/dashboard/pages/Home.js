import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard/Home.css'; // Make sure this path is correct

const Home = () => { // Receiving title prop from App.js route
//   const [userName, setUserName] = useState("John Doe"); // Mock user name
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const getWelcomeMessage = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good morning";
      } else if (currentHour < 18) {
        return "Good afternoon";
      } else {
        return "Good evening";
      }
    };
    setWelcomeMessage(getWelcomeMessage());
  }, []);

  // Mock data for demonstration
  const nextAppointment = {
    date: '2025-09-10',
    time: '10:30 AM',
    therapist: 'Dr. Jane Smith',
    location: 'Clinic Room 3'
  };

  const todayExercises = [
    { id: 1, name: 'Knee Flexion', sets: '3 sets', reps: '10 reps' },
    { id: 2, name: 'Shoulder Rotations', sets: '2 sets', reps: '15 reps' },
  ];

  const progressData = [
    { month: 'Jul', pain: 8 },
    { month: 'Aug', pain: 6 },
    { month: 'Sep', pain: 4 },
    { month: 'Oct', pain: 3 },
  ];

  const messages = [
    { id: 1, sender: 'Dr. Jane Smith', snippet: 'Your new exercise plan is ready.', unread: true },
    { id: 2, sender: 'Admin', snippet: 'Clinic will be closed on Nov 1st.', unread: false },
  ];

  const educationalContent = [
    { id: 1, title: 'Understanding Chronic Pain', link: '#' },
    { id: 2, title: 'Tips for Home Exercise', link: '#' },
  ];

  return (
    <div className="home-dashboard">
      <div className="welcome-section">
        <h2>{welcomeMessage}, Ishita!</h2>
        <p>Welcome back to your personalized health dashboard. Let's make progress today!</p>
      </div>

      <div className="dashboard-cards-grid">
        {/* Next Appointment Card */}
        <div className="dashboard-card appointment-card">
          <h3>Upcoming Appointment</h3>
          {nextAppointment ? (
            <>
              <p className="appointment-date">{new Date(nextAppointment.date).toDateString()} at {nextAppointment.time}</p>
              <p>With: {nextAppointment.therapist}</p>
              <p>Location: {nextAppointment.location}</p>
              <Link to="/appointment" className="btn btn-primary">Manage Appointment</Link>
            </>
          ) : (
            <p>No upcoming appointments. <Link to="/appointment">Book now!</Link></p>
          )}
        </div>

        {/* Today's Exercises Card */}
        <div className="dashboard-card exercise-card">
          <h3>Today's Exercises</h3>
          {todayExercises.length > 0 ? (
            <ul>
              {todayExercises.map(exercise => (
                <li key={exercise.id}>
                  <strong>{exercise.name}</strong>: {exercise.sets}, {exercise.reps}
                </li>
              ))}
            </ul>
          ) : (
            <p>No exercises scheduled for today.</p>
          )}
          <Link to="/dashboard/user/exercises" className="btn btn-secondary">View Full Plan</Link>
        </div>

        {/* Progress Tracker Card - Simple Graph */}
        <div className="dashboard-card progress-card">
          <h3>My Progress</h3>
          <p className="current-progress-text">Pain Level over Last 4 Months</p>
          <div className="progress-chart-container">
            {progressData.map((dataPoint, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="chart-bar" 
                  style={{ height: `${dataPoint.pain * 10}%`, backgroundColor: `var(--primary-color)` }}
                  title={`Pain: ${dataPoint.pain}`}
                ></div>
                <span className="chart-label">{dataPoint.month}</span>
              </div>
            ))}
          </div>
          <p className="progress-insight">Great job! Your pain level has significantly reduced.</p>
          <Link to="/dashboard/user/progress" className="btn btn-tertiary">Detailed Progress</Link>
        </div>

        {/* Messages Card */}
        <div className="dashboard-card messages-card">
          <h3>Messages ({messages.filter(msg => msg.unread).length} Unread)</h3>
          {messages.length > 0 ? (
            <ul className="message-list">
              {messages.slice(0, 2).map(message => (
                <li key={message.id} className={message.unread ? 'unread' : ''}>
                  <strong>{message.sender}:</strong> {message.snippet}
                </li>
              ))}
            </ul>
          ) : (
            <p>No new messages.</p>
          )}
          <Link to="/dashboard/user/messages" className="btn btn-secondary">View All Messages</Link>
        </div>

        {/* Educational Content Card */}
        <div className="dashboard-card education-card">
          <h3>Recommended Reading</h3>
          {educationalContent.length > 0 ? (
            <ul className="education-list">
              {educationalContent.map(item => (
                <li key={item.id}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recommendations at the moment.</p>
          )}
          <Link to="/dashboard/user/resources" className="btn btn-secondary">Explore All Resources</Link>
        </div>

      </div>
    </div>
  );
};

export default Home;