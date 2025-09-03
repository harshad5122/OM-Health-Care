
// import React from 'react';
// import { Link } from "react-router-dom";
// import '../styles/DrawerMenu.css';


// const DrawerMenu = ({ isOpen, toggleDrawer, userRole }) => {
//     const basePaths = {
//     1: "/dashboard/user",
//     2: "/dashboard/admin",
//     3: "/dashboard/staff",
//   };
//   const menuItems = {
//     1: [ // User
//       { path: "home", label: "Dashboard" },
//       { path: "profile", label: "Profile" },
//       { path: "messages", label: "Messages" },
//     ],
//     2: [ // Admin
//       { path: "home", label: "Dashboard" },
//       { path: "profile", label: "Profile" },
//       { path: "messages", label: "Messages" },
//     ],
//     3: [ // Staff
//       { path: "home", label: "Dashboard" },
//       { path: "profile", label: "Profile" },
//       { path: "messages", label: "Messages" },
//     ],
//   };

//   return (
//     <aside className={`drawer ${isOpen ? 'open' : ''}`}>
//       <div className="drawer-header">
//         <h2 className="sidebar-title">Om Health care</h2>
//         <button className="close-btn" onClick={toggleDrawer}>
//           &times;
//         </button>
//       </div>
//       <nav className="drawer-nav">
//         {menuItems[userRole]?.map((item) => (
//           <Link 
//             key={item.path} 
//             // to={item.path} 
//             to={`${basePaths[userRole]}/${item.path}`}  
//             className="sidebar-link"
//             onClick={toggleDrawer}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default DrawerMenu;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCubes,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaUserMd,
  FaUserPlus,
  FaUsers,

} from "react-icons/fa";
import "../styles/DrawerMenu.css";
// import { logoutUser } from "../api/authApi";
import ConfirmModal from "../components/ConfirmModal";
import { useAuthApi } from "../api/authApi";

const DrawerMenu = ({ isOpen, toggleDrawer, userRole }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const { logoutUser } = useAuthApi();


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
    ],
    2: [
      { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
      { path: "add-doctor", label: "Add Doctor", icon: <FaUserMd /> },
      { path: "add-user", label: "Add User", icon: <FaUserPlus /> },
      { path: "members", label: "Members", icon: <FaUsers /> },
    ],
    3: [
      { path: "home", label: "Dashboard", icon: <FaCubes /> },
      { path: "profile", label: "Profile", icon: <FaUser /> },
      { path: "messages", label: "Messages", icon: <FaEnvelope /> },
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
      alert("Logout successful!");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <aside className={`drawer ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="drawer-header">
        {/* <h2 className="sidebar-title">Om Health Care</h2> */}
        <Link to="/" className="sidebar-title">
          Om Health Care
        </Link>
        <button className="close-btn" onClick={toggleDrawer}>
          &times;
        </button>
      </div>

      {/* Menu Items */}
      <nav className="drawer-nav">
        {menuItems[userRole]?.map((item) => (
          <Link
            key={item.path}
            to={`${basePaths[userRole]}/${item.path}`}
            className="sidebar-link"
          // onClick={toggleDrawer}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="drawer-footer">
        <button className="logout-btn" onClick={() => setModalOpen(true)}>
          <span className="icon">
            <FaSignOutAlt />
          </span>
          <span className="label">Logout</span>
        </button>
      </div>
      <ConfirmModal
        open={isModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
      />
    </aside>
  );
};

export default DrawerMenu;
