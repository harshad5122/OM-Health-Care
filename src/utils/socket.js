


// // utils/socket.js
// import { io } from 'socket.io-client';

// let socket = null;

// export const initSocket = (userId) => {
//   if (!socket) {
//     socket = io('https://bd91f36ea939.ngrok-free.app', {
//       path: '/socket.io',
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     // Connection events
//     socket.on('connect', () => {
//       console.log('Socket connected');
//       // Connect user after socket connection
//       socket.emit('connect_user', { user_id: userId });
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });

//     socket.on('connect_error', (err) => {
//       console.log('Socket connection error:', err);
//     });
//   }
  
//   return socket;
// };

// export const getSocket = () => {
//   if (!socket) {
//     throw new Error('Socket not initialized! Call initSocket() first.');
//   }
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };


// src/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3005", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("connect_user", { user_id: userId });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;
