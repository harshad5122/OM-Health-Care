// utils/socket.js
import io from 'socket.io-client';
import { getToken } from './auth'; // Your auth utility to get JWT token

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL, {
      auth: {
        token: getToken()
      },
      transports: ['websocket']
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized!');
  }
  return socket;
};