
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

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  // const user = { name: "John Doe", role: userRole };

  return (
    <div className="dashboard-layout">
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
      
      <main className={`main-content ${isDrawerOpen ? 'drawer-open' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;



// import { Outlet } from 'react-router-dom';
// import DrawerMenu from '../components/DrawerMenu';
// import TopBar from '../components/TopBar';
// import '../styles/DashboardLayout.css';

// const DashboardLayout = ({ userRole, title }) => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   // Mock user data - replace with actual user data from your auth context
//   const user = {
//     name: "John Doe",
//     role: userRole
//   };

//   return (
//     <div className="dashboard-layout">
//       <TopBar 
//         toggleDrawer={toggleDrawer} 
//         title={title} 
//         user={user} 
//       />
      
//       <DrawerMenu 
//         isOpen={isDrawerOpen} 
//         toggleDrawer={toggleDrawer} 
//         userRole={userRole} 
//       />
      
//       <div className={`main-content ${isDrawerOpen ? 'drawer-open' : ''}`}>
//         <div className="content-wrapper">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;