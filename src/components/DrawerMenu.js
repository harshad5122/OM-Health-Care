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
import "../styles/DrawerMenu.css";
// import { logoutUser } from "../api/authApi";
import ConfirmModal from "../components/ConfirmModal";
import { useAuthApi } from "../api/authApi";
import { showAlert } from "./AlertComponent";
import { RiUserShared2Fill } from "react-icons/ri";

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
      { path: "home", label: "Dashboard", icon: <FaCubes /> },
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
    ],
    3: [
      { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
      {path:"leave",label:"Leave Management",icon: <RiUserShared2Fill className="text-[22px]"/> }
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
      
      {isOpen ? <div className="drawer-header">
        <Link to="/" className="sidebar-title">
          Om Health Care
        </Link>
        <button className="close-btn" onClick={toggleDrawer}>
          &times;
        </button>
      </div>: 
      <div className="flex items-center justify-center mt-[10px]">
        <button className="menu-btn" onClick={toggleDrawer}>
          ☰
        </button>
      </div>}
      
      <nav className={`${isOpen ? "drawer-nav":"drawerclose-nav"}`}>
      {menuItems[userRole]?.map((item) => {
        // Check if current path matches the menu item
        const isActive = location.pathname === `${basePaths[userRole]}/${item.path}`;

        return (
          <Link
            key={item.path}
            to={`${basePaths[userRole]}/${item.path}`}
            className={`sidebar-link ${isActive ? "active-link" : ""}`}
          >
            <span className="icon">{item.icon}</span>
           {isOpen && <span className="label">{item.label}</span>}
          </Link>
        );
      })}
    </nav>

      {/* Logout at bottom */}
      <div className="drawer-footer">
        <button className={`logout-btn ${isOpen ? "":"justify-center"}`} onClick={() => setModalOpen(true)}>
          <span className="icon">
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
