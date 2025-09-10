import React from 'react';
import { Link } from "react-router-dom";
import '../styles/TopBar.css';
import { FaRegBell } from "react-icons/fa6";
import { useNotification } from '../context/NotificationContext';
import { useNotificationApi } from '../api/notification';
import ReusableModal from './ReusableModal';

const TopBar = ({ toggleDrawer, title, user, userRole }) => {
  const basePaths = {
    1: "/dashboard/user",
    2: "/dashboard/admin",
    3: "/dashboard/staff",
  };
  const { notifications } = useNotification();
  const {updateNotificationStatus} = useNotificationApi();
  const [open, setOpen] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen]= React.useState(false)
  return (
    <header className="top-bar">
      {isConfirmModalOpen && 
        <ReusableModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false)
          }}
          title={`Confirm Appointment ?`}
        >
          <div className='px-2 pt-1 flex flex-col'>
            <span>Are you sure you want to accept this appointment?</span>
            <div className='flex gap-2 justify-end mt-3'>
              <button 
                className="bg-[#1a6f8b] text-white px-4 py-1 rounded hover:bg-[#15596e] transition"
              >
                Yes
              </button>
              <button className="bg-[#1a6f8b] text-white px-4 py-1 rounded hover:bg-[#15596e] transition"
               onClick={()=>{
                setIsConfirmModalOpen(false)
               }}
              >
                No
              </button>
            </div>
          </div>
        </ReusableModal>
      }
      <div className="left-section">
        {/* <button className="menu-btn" onClick={toggleDrawer}>
          ☰
        </button>
        <h1 className="title">{title}</h1> */}
      </div>
     
      <div className="right-section">
        {console.log(notifications,"notiff")}
        <div className="relative">
          <button
            className="relative"
            onClick={() => setOpen((prev) => !prev)}
          >
            <FaRegBell className="text-xl cursor-pointer text-gray-600 hover:text-gray-800" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md border border-[#eee] p-3 z-50 max-h-[30rem] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="border-b border-gray-200 py-2 last:border-none"
                  >
                    <p className="text-sm text-gray-700 text-left">{notif.message}</p>
                    <div className="flex gap-2 mt-4 justify-end">
                      <button className="bg-[#1a6f8b] text-white text-xs px-2 py-1.5 rounded"
                       onClick={()=>{
                        setIsConfirmModalOpen(true)
                        setOpen(false)
                       }}
                      >
                        Accept
                      </button>
                      <button className="bg-red-500 text-white text-xs px-2 py-1.5 rounded">
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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