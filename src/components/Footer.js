import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { RiWhatsappFill } from 'react-icons/ri'; // For WhatsApp icon
import mainlogo from "../assets/images/main-logo.jpg"

const Footer = () => {
  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Our Team", path: "/team" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <footer className="footer-v2 bg-gradient-to-br from-[#2c3e50] to-[#1a293a] text-[#ecf0f1] pt-10 font-poppins shadow-[0_-8px_20px_rgba(0,0,0,0.2)]">
      <div className="footer-v2-container  max-w-[1200px] mx-auto px-8 grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-12 items-start">
        {/* Section 1: About Om Health Care */}
        <div className="footer-v2-section footer-v2-about mb-[2rem] text-left">
          <h3 className="footer-v2-logo text-[2.2rem] font-bold text-white mb-6">
            <span className="text-[#4caf50]">OM</span> Physio Care
          </h3>
          <p className="footer-v2-about-text text-[0.95rem] leading-[1.7] mb-8 text-[#ecf0f1] opacity-85">
            Dedicated to restoring your health and enhancing your life through expert, personalized physiotherapy care. Your well-being is our priority.
          </p>
          <div className="footer-v2-social flex gap-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-v2-section footer-v2-links mb-[2rem] text-left">
          <h4 className="footer-v2-heading text-[1.3rem] font-semibold text-white mb-6 relative pb-2.5">
            Quick Links
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-[#4caf50] rounded-sm"></span>
          </h4>
          <ul className="footer-v2-list list-none p-0 m-0">
            {footerLinks.map((link, index) => (
              <li key={index} className="mb-3">
                <Link
                  to={link.path}
                  className="text-[rgba(236,240,241,0.8)] text-[0.95rem] flex items-center text-left transition-all duration-300 ease-linear hover:text-white hover:translate-x-2"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Contact Information */}
        <div className="footer-v2-section footer-v2-contact mb-[2rem] text-left">
          <h4 className="footer-v2-heading text-[1.3rem] font-semibold text-white mb-6 relative pb-2.5">
            Get in Touch
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-[#4caf50] rounded-sm"></span>
          </h4>
          <ul className="footer-v2-list footer-v2-contact-list list-none p-0 m-0 space-y-3">
            <li className="flex items-center gap-2 address">
              <FaMapMarkerAlt className="footer-v2-icon" />
              <span>123 Wellness St, Health City, HC 1234, India</span>
            </li>
            <li>
              <a href="tel:+919876543210" className="flex items-center gap-2">
                <FaPhoneAlt className="footer-v2-icon" />
                <span>+91 98765 43210</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@omhealthcare.com" className="flex items-center gap-2">
                <FaEnvelope className="footer-v2-icon" />
                <span>info@omphysiocare.com</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <RiWhatsappFill className="footer-v2-icon" />
                <span>WhatsApp Us</span>
              </a>
            </li>
          </ul>
          <Link  to="/auth/login" className="footer-v2-cta-btn inline-block bg-[#4caf50] text-white px-8 py-3.5 rounded-full font-semibold text-base mt-6 shadow-[0_6px_15px_rgba(76,175,80,0.3)] tracking-[0.5px] transition-all duration-300 ease-linear hover:bg-[#3b8e3f] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(76,175,80,0.4)]">
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="footer-v2-bottom bg-[rgba(0,0,0,0.15)] border-t border-[rgba(255,255,255,0.05)] mt-16 py-6 text-center">
        <p className="mb-3 text-[0.85rem] text-[#b0c4de] opacity-75">&copy; {new Date().getFullYear()} Om Physio Care. All Rights Reserved.</p>
        <div className="footer-v2-legal-links flex justify-center gap-7 mt-2">
          <Link to="/privacy-policy" className="text-[rgba(236,240,241,0.6)] text-[0.85rem] transition-colors duration-300 ease-linear hover:text-white">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-[rgba(236,240,241,0.6)] text-[0.85rem] transition-colors duration-300 ease-linear hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;