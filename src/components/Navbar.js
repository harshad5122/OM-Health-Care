import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DehazeIcon from '@mui/icons-material/Dehaze';
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/team", label: "Our Team" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthClick = () => {
    navigate("/auth/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full navbar bg-white z-[1000] ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="flex px-4 sm:px-6 xl:px-12 justify-between items-center py-2">
        <button
          onClick={() => setMenuOpen(true)}
          className="xl:hidden flex items-center mr-2"
        >
          <DehazeIcon className="text-[#1a6f8b]" />
        </button>
        {!menuOpen && (
          <Link
            to="/"
            className="flex text-[1.4rem] sm:text-[1.6rem] xl:text-[1.8rem] font-bold no-underline text-[#1a6f8b]"
          >
            <span className="text-[#4caf50]">OM</span> Health Care
          </Link>
        )}
        <ul className="hidden xl:flex gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} 
              // className="navbar-link"
               className="relative font-medium text-base text-[#495057] transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#4caf50] after:transition-all after:duration-300 hover:text-[#1a6f8b] hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden xl:flex gap-4 items-center">
          <button
            onClick={handleAuthClick}
            className="bg-transparent text-[#1a6f8b] border-2 border-[#1a6f8b] 
              px-5 py-1 rounded-full font-medium text-base cursor-pointer transition-all duration-300 
              hover:bg-[#1a6f8b] hover:text-white hover:-translate-y-0.5"
          >
            Login / Register
          </button>

          <Link
            // to="/appointment"
             to="/auth/login"
            className="bg-[#1a6f8b] text-white px-5 py-1 rounded-full font-medium no-underline 
              transition-all duration-300 hover:bg-[#145369] hover:-translate-y-0.5 hover:shadow-md"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[1200] xl:hidden">
          <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-1">
              <Link
                to="/"
                className="text-[1.4rem] font-bold no-underline text-[#1a6f8b]"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-[#4caf50]">OM</span>Health Care
              </Link>
              <button onClick={() => setMenuOpen(false)}>
                <CloseIcon className="text-[#1a6f8b]" />
              </button>
            </div>
            <ul className="flex flex-col gap-4 text-left">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    // className="navbar-link"
                    className="relative font-medium text-base text-[#495057] transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#4caf50] after:transition-all after:duration-300 hover:text-[#1a6f8b] hover:after:w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                handleAuthClick();
                setMenuOpen(false);
              }}
              className="bg-transparent text-[#1a6f8b] border-2 border-[#1a6f8b] 
                px-5 py-1 rounded-full font-medium text-base cursor-pointer transition-all duration-300 
                hover:bg-[#1a6f8b] hover:text-white"
            >
              Login / Register
            </button>

            <Link
              // to="/appointment"
              to="/auth/login"
              className="bg-[#1a6f8b] text-white px-5 py-1 rounded-full font-medium no-underline 
                transition-all duration-300 hover:bg-[#145369]"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;