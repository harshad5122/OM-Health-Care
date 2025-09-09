
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import TopBar from '../components/TopBar';
import '../styles/DashboardLayout.css';
import { useAuth } from "../context/AuthContext"; 


const DashboardLayout = ({ userRole, title }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const navigate = useNavigate();

  const { user } = useAuth();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  };
  // const user = { name: "John Doe", role: userRole };

  return (
    <div className="dashboard-layout h-full overflow-auto no-scrollbar" >
      <TopBar 
        toggleDrawer={toggleDrawer} 
        title={title} 
        user={user} 
        userRole={userRole} 
      />
      
      <DrawerMenu 
        isOpen={isDrawerOpen} 
        toggleDrawer={toggleDrawer} 
        userRole={userRole} 
      />
      
      <main className={`main-content ${isDrawerOpen ? 'drawer-open' : 'drawer-close'}`}>
        <Outlet isDrawerOpen={isDrawerOpen}/>
      </main>
    </div>
  );
};

export default DashboardLayout;
