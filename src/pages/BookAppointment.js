import React, { useEffect, useState, useRef } from 'react';
import '../styles/BookAppointment.css';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';

// Date picker imports
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Don't forget the CSS!

// Image imports (replace with your actual image paths)
import appointmentHeroBg from '../assets/images/hero-image.jpg';
import appointmentFormImg from '../assets/images/icon-personalized.jpg';

const servicesList = [
  'General Consultation',
  'Back Pain Treatment',
  'Neck Pain Treatment',
  'Sports Injury Rehabilitation',
  'Post-Surgical Physiotherapy',
  'Neurological Rehabilitation',
  'Manual Therapy & Massage',
  'Pre-Natal & Post-Natal Exercises',
  'Fracture Rehabilitation',
  'Sciatica Treatment',
  'Parkinson’s Disease Physiotherapy',
  'Paralysis Rehabilitation',
  'Other / Not sure'
];

const BookAppointment = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    service_type: '',
    appointment_date: null, // Date object for react-datepicker
    appointment_time: null, // Date object for react-datepicker
    reason_for_visit: ''
  });
  const [formStatus, setFormStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errors, setErrors] = useState({});

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Intersection Observer for animations
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: formSectionRef, inView: formSectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, appointment_date: date });
    if (errors.appointment_date) {
      setErrors(prevErrors => ({ ...prevErrors, appointment_date: undefined }));
    }
  };

  const handleTimeChange = (time) => {
    setFormData({ ...formData, appointment_time: time });
    if (errors.appointment_time) {
      setErrors(prevErrors => ({ ...prevErrors, appointment_time: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_name.trim()) newErrors.user_name = 'Full Name is required';
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = 'Email is invalid';
    }
    if (!formData.user_phone.trim()) newErrors.user_phone = 'Phone number is required';
    if (!formData.service_type) newErrors.service_type = 'Please select a service';
    if (!formData.appointment_date) newErrors.appointment_date = 'Please select a date';
    if (!formData.appointment_time) newErrors.appointment_time = 'Please select a time';
    if (!formData.reason_for_visit.trim()) newErrors.reason_for_visit = 'Please describe your reason for visit';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');

    const templateParams = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone: formData.user_phone,
        service_type: formData.service_type,
        appointment_date: formData.appointment_date ? formData.appointment_date.toDateString() : '',
        appointment_time: formData.appointment_time ? formData.appointment_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        reason_for_visit: formData.reason_for_visit
    };

    // Replace with your actual EmailJS Service ID, Template ID, and Public Key
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';
    const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // User ID

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((result) => {
        console.log('EmailJS Success!', result.text);
        setFormStatus('success');
        setFormData({
          user_name: '', user_email: '', user_phone: '', service_type: '',
          appointment_date: null, appointment_time: null, reason_for_visit: ''
        });
        setErrors({});
      }, (error) => {
        console.log('EmailJS Failed...', error.text);
        setFormStatus('error');
      });
  };

  // Filter for available times (e.g., clinic opens 9 AM, closes 6 PM)
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div className="appointment-page">
      {/* Hero Section */}
      <section ref={heroRef} className={`appointment-hero ${heroInView ? 'in-view' : ''}`} style={{ backgroundImage: `url(${appointmentHeroBg})` }}>
        <div className="appointment-hero-overlay"></div>
        <div className="appointment-hero-content animate-fade-in-up">
          <h1>Book Your Physiotherapy Appointment</h1>
          <p className="delay-1">Conveniently schedule your visit online and take the first step towards recovery.</p>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section ref={formSectionRef} className={`appointment-form-section ${formSectionInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="form-content-wrapper">
            <div className="form-image-container animate-fade-in-left">
              <img src={appointmentFormImg} alt="Schedule Your Visit" />
            </div>
            <div className="appointment-form-container animate-fade-in-right">
              <h2>Your Path to Wellness Starts Here</h2>
              <p className="form-intro-text">Fill out the form below to book your appointment. Our team will confirm your slot shortly.</p>

              <form ref={formRef} onSubmit={handleSubmit} className="appointment-form">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="user_name">Full Name</label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className={errors.user_name ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  />
                  {errors.user_name && <span className="error-message">{errors.user_name}</span>}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label htmlFor="user_email">Email Address</label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    className={errors.user_email ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  />
                  {errors.user_email && <span className="error-message">{errors.user_email}</span>}
                </div>

                {/* Contact Phone Number */}
                <div className="form-group">
                  <label htmlFor="user_phone">Contact Phone Number</label>
                  <input
                    type="tel"
                    id="user_phone"
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={handleChange}
                    className={errors.user_phone ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  />
                  {errors.user_phone && <span className="error-message">{errors.user_phone}</span>}
                </div>

                {/* Select Service */}
                <div className="form-group">
                  <label htmlFor="service_type">Select Service</label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className={errors.service_type ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  >
                    <option value="">-- Choose a Service --</option>
                    {servicesList.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service_type && <span className="error-message">{errors.service_type}</span>}
                </div>

                {/* Appointment Date */}
                <div className="form-group">
                  <label htmlFor="appointment_date">Appointment Date</label>
                  <DatePicker
                    selected={formData.appointment_date}
                    onChange={handleDateChange}
                    minDate={new Date()} // Cannot select past dates
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a Date"
                    className={errors.appointment_date ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  />
                  {errors.appointment_date && <span className="error-message">{errors.appointment_date}</span>}
                </div>

                {/* Appointment Time */}
                <div className="form-group">
                  <label htmlFor="appointment_time">Appointment Time</label>
                  <DatePicker
                    selected={formData.appointment_time}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    minTime={new Date(0, 0, 0, 9, 0)} // Clinic opens 9 AM
                    maxTime={new Date(0, 0, 0, 18, 0)} // Clinic closes 6 PM
                    filterTime={filterPassedTime} // Prevent selecting past times on current day
                    placeholderText="Select a Time"
                    className={errors.appointment_time ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  />
                  {errors.appointment_time && <span className="error-message">{errors.appointment_time}</span>}
                </div>

                {/* Brief reason for visit */}
                <div className="form-group">
                  <label htmlFor="reason_for_visit">Reason for Visit</label>
                  <textarea
                    id="reason_for_visit"
                    name="reason_for_visit"
                    rows="4"
                    value={formData.reason_for_visit}
                    onChange={handleChange}
                    className={errors.reason_for_visit ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  ></textarea>
                  {errors.reason_for_visit && <span className="error-message">{errors.reason_for_visit}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={formStatus === 'loading'}>
                  {formStatus === 'loading' ? 'Submitting...' : 'Confirm Appointment'}
                </button>

                {formStatus === 'success' && (
                  <p className="form-submission-message success-message animate-fade-in-up">
                    Success! Your appointment request has been sent. We will confirm your booking within 24 hours.
                  </p>
                )}
                {formStatus === 'error' && (
                  <p className="form-submission-message error-message animate-fade-in-up">
                    There was an error submitting your request. Please check your details or try again later.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookAppointment;