import React, { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import {
  FaCubes,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaUserMd,
  FaUserPlus,
  FaUsers,
FaCalendarAlt,

} from "react-icons/fa";
import ConfirmModal from "../components/ConfirmModal";
import { useAuthApi } from "../api/authApi";
import { showAlert } from "./AlertComponent";
import { RiUserShared2Fill } from "react-icons/ri";
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const DrawerMenu = ({ isOpen, toggleDrawer, userRole }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const { logoutUser } = useAuthApi();
   const location = useLocation();

  const basePaths = {
    1: "/dashboard/user",
    2: "/dashboard/admin",
    3: "/dashboard/staff",
  };

  const menuItems = {
    1: [
      // { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
      { path: "appointment", label: "Book Appointment", icon: <FaCalendarAlt /> },
    ],
    2: [
      { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
      { path: "add-doctor", label: "Add Doctor", icon: <FaUserMd /> },
      { path: "add-user", label: "Add User", icon: <FaUserPlus /> },
      { path: "members", label: "Members", icon: <FaUsers /> },
      { path: "appointment", label: "Book Appointment", icon: <FaCalendarAlt /> },
      { path: "admin-appointment", label: "Appointments", icon: <ListAltIcon /> },
      {path:"doctor-leave",label:"Leaves",icon: <RiUserShared2Fill className="text-[22px]"/> },
    ],
    3: [
      // { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
      {path:"leave",label:"Leave Management",icon: <RiUserShared2Fill className="text-[22px]"/> },
      { path: "book-appointment", label: "Book Appointment", icon: <FaCalendarAlt /> },
      { path: "appointments", label: "Appointments", icon: <ListAltIcon /> },
      { path: "patient-status", label: "Patients", icon: <AssignmentIndIcon /> },
    ],
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showAlert("Logout successfully !", "success");
      navigate("/");
    } catch (err) {
      console.log("Logout failed:", err);
      showAlert("Failed to logout. Please try again.", "error")
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div 
    // className={`drawer ${isOpen ? "open" : "closed"}`}
    className={`fixed top-0 left-0 h-screen bg-light-color shadow-md flex flex-col justify-between transition-all duration-300 z-[1000] ${isOpen ? "w-72" : "w-16"}`}
    >
      
      {isOpen ? <div className="p-4 flex justify-between items-center bg-[#1a6f8b] border-b border-white/20">
        <Link to="/" className="m-0 text-[1.2rem] text-white font-semibold no-underline">
          Om Health Care
        </Link>
        <button className="bg-transparent border-none text-white text-[1.6rem] cursor-pointer" onClick={toggleDrawer}>
          &times;
        </button>
      </div>: 
      <div className="flex items-center justify-center mt-[10px]">
        <button className="menu-btn" onClick={toggleDrawer}>
          ☰
        </button>
      </div>}
      
      <nav 
        className={`${isOpen ? "flex flex-col p-4 flex-grow" : "flex flex-col items-center flex-grow mt-5 p-2.5"}`}
      >
        {menuItems[userRole]?.map((item) => {
          const isActive = location.pathname === `${basePaths[userRole]}/${item.path}`;

          return (
            <Link
              key={item.path}
              to={`${basePaths[userRole]}/${item.path}`}
              title={!isOpen ? item.label : ''} 
              className={`flex items-center gap-4 px-3 py-3 mb-3 rounded-md font-medium no-underline transition-colors duration-200 hover:bg-[#0077cc1a] hover:text-[#1a6f8b] ${
                isActive ? "bg-[#0077cc1a] text-[#1a6f8b]" : "text-[#495057]"
              }`}
            >
              <span className="flex items-center text-[1.2rem]">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-gray-200">
        <button 
        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-md bg-transparent text-[#e63946] font-medium transition-colors duration-200 hover:bg-[#e639461a] hover:text-[#d62828] ${
          !isOpen && "justify-center"
        }`}
         onClick={() => setModalOpen(true)}
         >
          <span className="flex items-center text-[1.2rem]">
            <FaSignOutAlt />
          </span>
         {isOpen && <span className="label">Logout</span>}
        </button>
      </div>
      <ConfirmModal
        open={isModalOpen}
        title="Confirm Logout ?"
        message="Are you sure you want to logout ?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default DrawerMenu;
