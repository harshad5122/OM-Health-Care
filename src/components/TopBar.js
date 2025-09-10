import React from 'react';
import { Link } from "react-router-dom";
import '../styles/TopBar.css';
import { FaRegBell } from "react-icons/fa6";
import { useNotification } from '../context/NotificationContext';
import { useNotificationApi } from '../api/notification';
import ReusableModal from './ReusableModal';
import { showAlert } from './AlertComponent';

const TopBar = ({ toggleDrawer, title, user, userRole }) => {
  const basePaths = {
    1: "/dashboard/user",
    2: "/dashboard/admin",
    3: "/dashboard/staff",
  };
  const { notifications,setNotifications  } = useNotification();
  const {updateNotificationStatus} = useNotificationApi();
  const {getNotificationById}= useNotificationApi();
  const [open, setOpen] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen]= React.useState(false)
  const [selectedNotif, setSelectedNotif] = React.useState(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen]= React.useState(false)
  const [declineReason,setDeclineReason]=React.useState("")

  const handleConfirm = async () => {

    if (!selectedNotif) return;

    const payload = {
      reference_id: selectedNotif.reference_id,
      sender_id: selectedNotif.sender_id,
      status: "CONFIRMED", 
      message: null,
      notification_id: selectedNotif._id,
    };

    try {
      await updateNotificationStatus(payload);
      setNotifications((prev) =>
       prev.filter((notif) => notif._id !== selectedNotif._id)
      );
      setIsConfirmModalOpen(false);
      showAlert("Appointment Confirmed successfully!","success")
    } catch (err) {
      console.log("Error updating notification:", err);
      showAlert("something went wrong","error")
    }
  };

  const handleCancelNotification = async () => {
    if (!selectedNotif) return;

    const payload = {
      reference_id: selectedNotif.reference_id,
      sender_id: selectedNotif.sender_id,
      status: "CANCELLED",
      message: declineReason, 
      notification_id: selectedNotif._id,
    };

    try {
      await updateNotificationStatus(payload);

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== selectedNotif._id)
      );

      setIsDeclineModalOpen(false);
      setDeclineReason("");
      showAlert("Appointment cancelled successfully!", "success");
    } catch (err) {
      console.log("Error cancelling appointment:", err);
      showAlert("Something went wrong", "error");
    }
  };
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
                onClick={handleConfirm}
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
      {
        isDeclineModalOpen && 
        <ReusableModal
          isOpen={isDeclineModalOpen}
          onClose={() => {
            setIsDeclineModalOpen(false)
            setDeclineReason("");
          }}
          title={`Cancle Appointment ?`}
        >
          <div className='px-2 pt-1 flex flex-col'>
            <span>Are you sure you want to cancle this appointment?</span>
            <input
              type="text"
              placeholder="Enter reason for cancellation"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="mt-3 border border-gray-300 rounded p-2 text-sm"
            />
            <div className='flex gap-2 justify-end mt-3'>
              <button 
                className={`px-4 py-1 rounded text-white transition ${
                  declineReason.trim()
                    ? "bg-[#1a6f8b] hover:bg-[#15596e]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!declineReason.trim()} 
                onClick={handleCancelNotification}
              >
                Yes
              </button>
              <button className="bg-[#1a6f8b] text-white px-4 py-1 rounded hover:bg-[#15596e] transition"
              onClick={()=>{
                setIsDeclineModalOpen(false)
                setDeclineReason("");
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
                    // className="border-b border-gray-200 py-1 last:border-none"
                    className={`border-b border-gray-200 py-1 last:border-none ${
                      notif.type !== "APPOINTMENT_REQUEST" ? "cursor-pointer" : "cursor-default"
                    }`}
                    onClick={() => {
                      if (notif.type !== "APPOINTMENT_REQUEST") {
                        console.log("click on notification",notif._id)
                        getNotificationById(notif._id);
                        setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
                        setOpen(false);
                      }
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-800 text-left pb-1">
                      {notif.type === "APPOINTMENT_REQUEST"
                        ? "Appointment Request"
                        : notif.type === "APPOINTMENT_CONFIRMED"
                        ? "Appointment Confirmed"
                        : notif.type === "APPOINTMENT_CANCELLED"
                        ? "Appointment Cancelled"
                        : "Notification"}
                    </p>
                    <p className="text-sm text-gray-700 text-left">{notif.message}</p>
                    {notif?.type === "APPOINTMENT_REQUEST" && 
                    <div className="flex gap-2 mt-4 justify-end">
                      <button className="bg-[#1a6f8b] text-white text-xs px-2 py-1.5 rounded"
                       onClick={()=>{
                        setSelectedNotif(notif);
                        setIsConfirmModalOpen(true)
                        setOpen(false)
                       }}
                      >
                        Accept
                      </button>
                      <button className="bg-red-500 text-white text-xs px-2 py-1.5 rounded"
                       onClick={()=>{
                        setSelectedNotif(notif);
                        setIsDeclineModalOpen(true)
                        setOpen(false)
                       }}
                      >
                        Decline
                      </button>
                    </div>}
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