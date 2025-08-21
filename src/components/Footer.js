import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { RiWhatsappFill } from 'react-icons/ri'; // For WhatsApp icon

const Footer = () => {
  return (
    <footer className="footer-v2">
      <div className="footer-v2-container">
        {/* Section 1: About Om Health Care */}
        <div className="footer-v2-section footer-v2-about">
          <h3 className="footer-v2-logo">
            <span>OM</span> Health Care
          </h3>
          <p className="footer-v2-about-text">
            Dedicated to restoring your health and enhancing your life through expert, personalized physiotherapy care. Your well-being is our priority.
          </p>
          <div className="footer-v2-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-v2-section footer-v2-links">
          <h4 className="footer-v2-heading">Quick Links</h4>
          <ul className="footer-v2-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact">Contact</Link></li> 
          </ul>
        </div>

        {/* Section 3: Contact Information */}
        <div className="footer-v2-section footer-v2-contact">
          <h4 className="footer-v2-heading">Get in Touch</h4>
          <ul className="footer-v2-list footer-v2-contact-list">
            <li>
              <FaMapMarkerAlt className="footer-v2-icon" />
              <span>123 Wellness St, Health City, HC 12345, India</span>
            </li>
            <li>
              <a href="tel:+919876543210">
                <FaPhoneAlt className="footer-v2-icon" />
                <span>+91 98765 43210</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@omhealthcare.com">
                <FaEnvelope className="footer-v2-icon" />
                <span>info@omhealthcare.com</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <RiWhatsappFill className="footer-v2-icon" />
                <span>WhatsApp Us</span>
              </a>
            </li>
          </ul>
          <Link to="/appointment" className="footer-v2-cta-btn">
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="footer-v2-bottom">
        <p>&copy; {new Date().getFullYear()} Om Health Care. All Rights Reserved.</p>
        <div className="footer-v2-legal-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;