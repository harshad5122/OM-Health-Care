import React from 'react';
import { Link } from "react-router-dom";
import '../styles/TopBar.css';
import { FaRegBell } from "react-icons/fa6";
const TopBar = ({ toggleDrawer, title, user, userRole }) => {
  const basePaths = {
    1: "/dashboard/user",
    2: "/dashboard/admin",
    3: "/dashboard/staff",
  };

  return (
    <header className="top-bar">
      <div className="left-section">
        {/* <button className="menu-btn" onClick={toggleDrawer}>
          ☰
        </button>
        <h1 className="title">{title}</h1> */}
      </div>
     
      <div className="right-section">
        <button className="relative">
          <FaRegBell className="text-xl cursor-pointer text-gray-600 hover:text-gray-800" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
        {user && (
          <Link 
            to={`${basePaths[userRole]}/profile`} 
            className="user-profile-link"
          >
            <span className="user-name">
              {user.firstname} {user.lastname}
            </span>
            <div className="user-avatar">
              {user.firstname?.charAt(0).toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default TopBar;