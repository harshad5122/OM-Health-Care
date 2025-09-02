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
