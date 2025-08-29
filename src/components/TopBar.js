import React from 'react';
import '../styles/TopBar.css';

const TopBar = ({ toggleDrawer, title, user }) => {
  return (
    <header className="top-bar">
      <div className="left-section">
        <button className="menu-btn" onClick={toggleDrawer}>
          ☰
        </button>
        <h1 className="title">{title}</h1>
      </div>
      <div className="right-section">
        <span className="user-name">{user.name}</span>
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default TopBar;