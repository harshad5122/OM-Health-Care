// import React from "react";
// import "../styles/Navbar.css";

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">Om Health Care</div>
//       <ul className="navbar-links">
//         <li><a href="#hero">Home</a></li>
//         <li><a href="#services">Services</a></li>
//         <li><a href="#team">Team</a></li>
//         <li><a href="#testimonials">Testimonials</a></li>
//         <li><a href="#contact">Contact</a></li>
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;


    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate  } from 'react-router-dom';
    import '../styles/Navbar.css';


    const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

      const handleAuthClick = () => {
    navigate('/auth/login');
  };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
            <Link to="/" className="navbar-logo">
            <span>OM</span> Health Care
            </Link>

            <div 
            className={`navbar-toggle ${mobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
            <span></span>
            <span></span>
            <span></span>
            </div>

            <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li className="navbar-item">
                <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
                <Link to="/about" className="navbar-link">About</Link>
            </li>
            <li className="navbar-item">
                <Link to="/services" className="navbar-link">Services</Link>
            </li>
            <li className="navbar-item">
                <Link to="/team" className="navbar-link">Our Team</Link>
            </li>
            <li className="navbar-item">
                <Link to="/testimonials" className="navbar-link">Testimonials</Link>
            </li>
            <li className="navbar-item">
                <Link to="/contact" className="navbar-link">Contact</Link>
            </li>
            <li className="navbar-item">
            <button 
              onClick={handleAuthClick}
              className="navbar-auth"
            >
              Login / Register
            </button>
          </li>
            <li className="navbar-item">
                <Link to="/appointment" className="navbar-button">Book Appointment</Link>
            </li>
            </ul>
        </div>
        </nav>
    );
    };

    export default Navbar;