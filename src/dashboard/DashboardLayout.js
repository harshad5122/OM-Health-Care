
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import TopBar from '../components/TopBar';
import { useAuth } from "../context/AuthContext"; 
import { useUserApi } from '../api/userApi';


const DashboardLayout = ({ userRole, title }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const navigate = useNavigate();

  const { user ,setUser} = useAuth();
  const { getProfile} = useUserApi();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  };
  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data)
    } catch (error) {
      console.log("Error fetching profile:", error);
    } 
  };
  React.useEffect(() => {
    fetchProfile();
  }, []);
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
