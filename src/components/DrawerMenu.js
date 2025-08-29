
import React from 'react';
import { Link } from "react-router-dom";
import '../styles/DrawerMenu.css';

const DrawerMenu = ({ isOpen, toggleDrawer, userRole }) => {
    const basePaths = {
    1: "/dashboard/user",
    2: "/dashboard/admin",
    3: "/dashboard/staff",
  };
  const menuItems = {
    1: [ // User
      { path: "home", label: "Dashboard" },
      { path: "profile", label: "Profile" },
      { path: "messages", label: "Messages" },
    ],
    2: [ // Admin
      { path: "home", label: "Dashboard" },
      { path: "profile", label: "Profile" },
      { path: "messages", label: "Messages" },
    ],
    3: [ // Staff
      { path: "home", label: "Dashboard" },
      { path: "profile", label: "Profile" },
      { path: "messages", label: "Messages" },
    ],
  };

  return (
    <aside className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h2 className="sidebar-title">Dashboard</h2>
        <button className="close-btn" onClick={toggleDrawer}>
          &times;
        </button>
      </div>
      <nav className="drawer-nav">
        {menuItems[userRole]?.map((item) => (
          <Link 
            key={item.path} 
            // to={item.path} 
            to={`${basePaths[userRole]}/${item.path}`}  
            className="sidebar-link"
            onClick={toggleDrawer}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DrawerMenu;