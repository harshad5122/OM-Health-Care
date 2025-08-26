import React, { useEffect, useState, useRef } from 'react';
import '../styles/Contact.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // Icons for contact info
import { useInView } from 'react-intersection-observer'; // For scroll-based animations
import emailjs from '@emailjs/browser'; // For handling form submission (install if not already)

// Import contact hero background (replace with your actual image)
import contactHeroBg from '../assets/images/hero-image.jpg';
// Import supporting image for form section (replace with your actual image)
import contactFormImg from '../assets/images/service3.jpg';

const Contact = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form state
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errors, setErrors] = useState({});

  // Intersection Observer for animations
  const { ref: infoRef, inView: infoInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: formSectionRef, inView: formSectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) { // Clear error when user starts typing
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_name.trim()) newErrors.user_name = 'Name is required';
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    // Optional: Add phone validation if needed
    // if (!formData.user_phone.trim()) newErrors.user_phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormStatus('error'); // Indicate general error for form
      return;
    }

    setFormStatus('loading');

    // Replace with your actual EmailJS Service ID, Template ID, and Public Key
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';
    const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // User ID

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      .then((result) => {
        console.log('EmailJS Success!', result.text);
        setFormStatus('success');
        setFormData({ user_name: '', user_email: '', user_phone: '', message: '' }); // Clear form
        setErrors({}); // Clear errors
      }, (error) => {
        console.log('EmailJS Failed...', error.text);
        setFormStatus('error');
      });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" style={{ backgroundImage: `url(${contactHeroBg})` }}>
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1 className="animate-fade-in-up">Get in Touch with Us</h1>
          <p className="animate-fade-in-up delay-1">We're here to help you on your journey to wellness.</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section ref={infoRef} className={`contact-info-section ${infoInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="info-grid">
            {/* Address Card */}
            <div className="info-card animate-zoom-in">
              <div className="info-icon-wrapper"><FaMapMarkerAlt /></div>
              <h3>Our Location</h3>
              <p>123 Wellness Street, Health City,<br/> HC 12345, India</p>
              <a href="https://maps.app.goo.gl/YourGoogleMapsLink" target="_blank" rel="noopener noreferrer" className="info-link">Get Directions</a>
            </div>

            {/* Phone Card */}
            <div className="info-card animate-zoom-in delay-1">
              <div className="info-icon-wrapper"><FaPhoneAlt /></div>
              <h3>Call Us</h3>
              <p>+91 98765 43210</p>
              <p>Mon - Fri: 9 AM - 6 PM</p>
              <a href="tel:+919876543210" className="info-link">Call Now</a>
            </div>

            {/* Email Card */}
            <div className="info-card animate-zoom-in delay-2">
              <div className="info-icon-wrapper"><FaEnvelope /></div>
              <h3>Email Us</h3>
              <p>info@omhealthcare.com</p>
              <p>We respond within 24 hours</p>
              <a href="mailto:info@omhealthcare.com" className="info-link">Send Email</a>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Form Section */}
      <section ref={formSectionRef} className={`contact-form-section ${formSectionInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="form-content-wrapper">
            <div className="form-image-container animate-fade-in-left">
              <img src={contactFormImg} alt="Contact us at Om Health Care" />
            </div>
            <div className="contact-form-container animate-fade-in-right">
              <h2>Send Us a Message</h2>
              <p className="form-intro-text">Have a question or need to schedule an appointment? Fill out the form below and we'll get back to you shortly.</p>
              
              <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="user_name">Your Name</label>
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
                
                <div className="form-group">
                  <label htmlFor="user_email">Your Email (Optional)</label>
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

                <div className="form-group">
                  <label htmlFor="user_phone">Phone Number</label>
                  <input
                    type="tel"
                    id="user_phone"
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'input-error' : ''}
                    disabled={formStatus === 'loading'}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                
                <button type="submit" className="submit-button" disabled={formStatus === 'loading'}>
                  {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {formStatus === 'success' && (
                  <p className="form-submission-message success-message animate-fade-in-up">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                )}
                {formStatus === 'error' && (
                  <p className="form-submission-message error-message animate-fade-in-up">
                    There was an error sending your message. Please try again later or call us directly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed (Optional, but highly recommended) */}
      {/* <section className="map-section animate-fade-in-up delay-1">
        <div className="container">
          <div className="map-embed-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dYOUR_LATITUDE!2dYOUR_LONGITUDE!3dYOUR_ZOOM_LEVEL!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ5JzUyLjYiTiA3N8KwNTUnMjcuOSJF!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin" // REPLACE WITH YOUR CLINIC'S GOOGLE MAPS EMBED CODE
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Om Health Care Location"
            ></iframe>
          </div>
        </div>
      </section> */}
      {/* Google Maps Embed Section */}
      {false && (
 <section className="map-section animate-fade-in-up delay-1">
        <div className="container">
          <h2 className="section-title">Find Us</h2> {/* Add back the title if removed */}
          <div className="map-embed-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.9129399696258!2d70.77229967511785!3d22.28128747970019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb58c4f21ba1%3A0x52af9d7acdb285e8!2sLevel%20-%206!5e0!3m2!1sen!2sin!4v1755576911264!5m2!1sen!2sin"
              // The 'width' and 'height' attributes here are ignored by the CSS
              // but it's good practice to keep them for fallback or direct styling
              width="100%" // Change from 600 to 100%
              height="100%" // Change from 300 to 100%
              style={{ border: 0 }}
              allowFullScreen={true} // Changed to camelCase and boolean true
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Om Health Care Location"
            ></iframe>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default Contact;