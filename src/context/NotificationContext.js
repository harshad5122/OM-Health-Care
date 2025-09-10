import React, { createContext, useState, useEffect, useContext } from "react";
import { useNotificationApi } from "../api/notification";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";

const Notification = createContext();


export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null)


    const { getNotifications } = useNotificationApi();
    const { user } = useAuth();
    console.log(user, ">>> user")


    useEffect(() => {
        if (user != null) {

            // getNotifications().then((res) => {
            //     setNotifications(Array.isArray(res?.data?.data) ? res?.data?.data : []);
            // });
            
            // console.log(user?._id, ">>>")
            // const socket = initSocket(user._id);
            // setSocket(socket)
            (async () => {
                try {
                    const res = await getNotifications();
                    console.log(res, ">>> res");  
                    setNotifications(Array.isArray(res?.body) ? res?.body : []);
                    const socket = initSocket(user._id);
                    setSocket(socket)
                } catch (err) {
                    console.error("Error fetching notifications", err);
                }
            })();
        }
    }, [user]);

    useEffect(() => {
        // socket.emit("joinDoctorRoom", doctorId);
        console.log(socket, ">>")
        if (socket != null) {
            socket.on("appointmentRequest", (data) => {
                console.log(data, ">LLLLUU")
                // alert(data.message); 
                setNotifications([...notifications, data])
                // optionally refresh calendar
            });

            return () => socket.off("appointmentRequest");
        }
    }, [socket]);

    return (
        <Notification.Provider value={{ notifications, setNotifications }}>
            {children}
        </Notification.Provider>
    );
};

export const useNotification = () => useContext(Notification);
