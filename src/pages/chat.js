// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { initSocket, disconnectSocket } from '../utils/socket'; 
// // import axios from '../utils/axiosConfig';
// import '../styles/Chat.css';
// import { getMessages } from "../api/messageApi"; 
// import { uploadFile } from "../api/uploadFileApi";

// const Chat = () => {
//   const { user, token } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [attachment, setAttachment] = useState(null);
//   const [onlineStatus, setOnlineStatus] = useState(false);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [socket, setSocket] = useState(null);
  
//   const adminId = '68ac53cd94d1159bdf9ead68';

//   const markMessageAsSeen = useCallback((messageId) => {
//     if (socket && user && user._id) { 
//       socket.emit('message_seen', {   
//         messageId,
//         user_id: user._id, 
//         isGroup: false 
//       });
//     }
//   }, [user, socket]); 

//   const fetchMessages = useCallback(async () => {
//     if (!user || !user._id || !token) {
//       console.warn("fetchMessages called before user is available.");
//       return;
//     }
//     try {
//     //   const response = await axios.get(`/message/get/${user._id}/${adminId}`);
//     const msgs = await getMessages( adminId, token);
//       setMessages(msgs || []);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   }, [user,token, adminId]);

//   const setupSocketListeners = useCallback((socketInstance) => {
//     if (!socketInstance) {
//       console.warn("setupSocketListeners called with null socketInstance.");
//       return () => {};
//     }

//     const handleChatMessage = (message) => {
//       setMessages(prev => {
//         if (prev.some(msg => msg._id === message._id)) {
//           return prev;
//         }
//         return [...prev, message];
//       });
//       if (user && message.sender_id !== user._id) {
//         markMessageAsSeen(message._id);
//       }
//     };

//     const handleMessageUpdated = (updatedMessage) => {
//       setMessages(prev => prev.map(msg => 
//         msg._id === updatedMessage._id ? updatedMessage : msg
//       ));
//     };

//     const handleMessageDeleted = ({ messageId }) => {
//       setMessages(prev => prev.filter(msg => msg._id !== messageId));
//     };

//     const handlePresenceUpdate = ({ isOnline }) => {
//       setOnlineStatus(isOnline);
//     };

//     socketInstance.on('chat_message', handleChatMessage);
//     socketInstance.on('message_updated', handleMessageUpdated);
//     socketInstance.on('message_deleted', handleMessageDeleted);
//     socketInstance.on('presence_update', handlePresenceUpdate);

//     return () => {
//       socketInstance.off('chat_message', handleChatMessage);
//       socketInstance.off('message_updated', handleMessageUpdated);
//       socketInstance.off('message_deleted', handleMessageDeleted);
//       socketInstance.off('presence_update', handlePresenceUpdate);
//     };
//   }, [user, markMessageAsSeen]);

//   useEffect(() => {
//     let socketCleanupFunction = () => {};
// console.log("useEffect running, user:", user);
//     if (user && user._id) {
//       const newSocketInstance = initSocket(user._id);
//       console.log("initSocket returned:", newSocketInstance); 
//       setSocket(newSocketInstance);

//          newSocketInstance.on('connect', () => {
//       console.log('Socket instance CONNECTED from component lifecycle');
//     });
//     newSocketInstance.on('disconnect', () => {
//       console.log('Socket instance DISCONNECTED from component lifecycle');
//     });
//     newSocketInstance.on('connect_error', (err) => {
//       console.error('Socket instance CONNECTION ERROR:', err.message);
//     })

//       fetchMessages();
//       socketCleanupFunction = setupSocketListeners(newSocketInstance);
//     } else {
//     console.log("User not available, skipping socket initialization.");
//   }

//     return () => {
//       socketCleanupFunction();
//       disconnectSocket();
//     };
//   }, [user, fetchMessages, setupSocketListeners]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() && !attachment) return;
//     if (!socket || !socket.connected) {
//       console.error("Socket is not connected. Cannot send message.");
//       return;
//     }

//     let messageData = {
//       sender_id: user._id,
//       receiver_id: adminId,
//       message: newMessage,
//       message_type: attachment ? attachment.type : 'text'
//     };

//     if (attachment) {
//       try {
//         // const formData = new FormData();
//         // formData.append('file', attachment.file);

//         // const uploadResponse = await axios.post('/file/upload', formData, {
//         //   headers: { 'Content-Type': 'multipart/form-data' }
//         // });
//          const uploadResponse = await uploadFile(attachment.file, token);
//         messageData.attechment_id = uploadResponse.data._id;
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         return;
//       }
//     }

//     try {
//       socket.emit('chat_message', messageData);
//       setNewMessage('');
//       setAttachment(null);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     } catch (error) {
//       console.error('Error emitting chat message:', error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileType = file.type.split('/')[0];
//     const allowedTypes = ['image', 'video', 'audio', 'application'];

//     if (allowedTypes.includes(fileType)) {
//       setAttachment({
//         file,
//         type: fileType === 'application' ? 'document' : fileType,
//         preview: fileType === 'image' ? URL.createObjectURL(file) : null
//       });
//     } else {
//       console.warn("Unsupported file type selected:", file.type);
//       alert("Unsupported file type. Please select an image, video, audio, or document.");
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <div className="user-info">
//           <span className="user-name">Admin Support</span>
//           <span className={`status ${onlineStatus ? 'online' : 'offline'}`}>
//             {onlineStatus ? 'Online' : 'Offline'}
//           </span>
//         </div>
//       </div>

//       <div className="messages-container">
//         {(messages || []).map((message) => (
//           <div 
//             key={message._id}
//             className={`message ${message.sender_id === user._id ? 'sent' : 'received'}`}
//           >
//             {message.message_type === 'image' && message.attechment_details?.[0]?.url && (
//               <img src={message.attechment_details[0].url} alt="Attachment" className="attachment" />
//             )}
//             {message.message_type === 'video' && message.attechment_details?.[0]?.url && (
//               <video controls className="attachment">
//                 <source src={message.attechment_details[0].url} type="video/mp4" />
//               </video>
//             )}
//             {message.message_type === 'document' && message.attechment_details?.[0]?.url && (
//               <a href={message.attechment_details[0].url} target="_blank" rel="noopener noreferrer" className="document-attachment">
//                 Download Document
//               </a>
//             )}
//             {message.message_type === 'audio' && message.attechment_details?.[0]?.url && (
//               <audio controls className="attachment">
//                 <source src={message.attechment_details[0].url} type="audio/mpeg" />
//               </audio>
//             )}
//             {message.message && (
//               <div className="message-content">{message.message}</div>
//             )}
//             <div className="message-meta">
//               <span className="time">
//                 {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
//               {message.sender_id === user._id && (
//                 <span className="message-status">
//                   {message.message_status === 'seen' ? '✓✓' : 
//                    message.message_status === 'delivered' ? '✓' : ''}
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="input-area">
//         {attachment && (
//           <div className="attachment-preview">
//             {attachment.preview ? (
//               <img src={attachment.preview} alt="Preview" />
//             ) : (
//               <span>{attachment.file.name}</span>
//             )}
//             <button onClick={() => setAttachment(null)}>×</button>
//           </div>
//         )}
//         <div className="input-container">
//           <button className="attachment-btn" onClick={() => fileInputRef.current?.click()} title="Attach file">
//             <svg viewBox="0 0 24 24" width="24" height="24">
//               <path fill="currentColor" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
//             </svg>
//           </button>
//           <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
//           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
//           <button className="send-btn" onClick={sendMessage} >
//             <svg viewBox="0 0 24 24" width="24" height="24">
//               <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;



// src/pages/Chat.js
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { getMessages } from "../api/messageApi";
import { uploadFile } from "../api/uploadFileApi";
import { Paperclip } from "lucide-react"; // 📎 icon

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);
  const adminId = "68ac53cd94d1159bdf9ead68";

  //  Fetch message history on load
  useEffect(() => {
    if (!user || !user._id || !token) return;

    const fetchHistory = async () => {
      try {
        console.log('enter fetch history');
        // const adminId = "68ac53cd94d1159bdf9ead68";
        const history = await getMessages(adminId, token);
        console.log(history);
        setMessages(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
      }
    };

    fetchHistory();
  }, [user, token]);

  // 🔌 Setup socket listeners
  useEffect(() => {
    if (!user || !user._id) return;

    const socket = initSocket(user._id);

    const handleIncoming = (msg) => {
      console.log("📩 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat_message", handleIncoming);

    return () => {
      socket.off("chat_message", handleIncoming);
    };
  }, [user]);

  // 📤 Send text message
  const sendMessage = () => {
    if (!input.trim()) return;

    const socket = getSocket();
    if (socket && socket.connected) {
      const msgData = {
        sender_id: user._id,
        receiver_id: adminId, // hardcoded for test
        message: input,
        message_type: "text",
        created_at: new Date(),
      };

      socket.emit("chat_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setInput("");
    } else {
      console.error("⚠️ Socket not connected");
    }
  };

  // 📤 Upload file then send as message
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file, token);

      const msgData = {
        sender_id: user._id,
        receiver_id: adminId, 
        message_type: uploaded.fileType,
        attechment_id: uploaded._id,   
        attechment_details: [uploaded],
        created_at: new Date(),
      };

      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit("chat_message", msgData);
        setMessages((prev) => [...prev, msgData]);
      }
    } catch (err) {
      console.error("❌ File upload failed:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {/* {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.sender_id === user?._id ? "sent" : "received"
            }`}
          >
            {msg.message_type === "text" && <p>{msg.message}</p>}

            {msg.message_type === "image" && Array.isArray(msg.attechment_details) &&
              msg.attechment_details?.map((file, idx) => (
                <img
                  key={idx}
                  src={file.url}
                  alt={file.name}
                  className="chat-image"
                />
              ))}

            {msg.message_type === "video" &&
              msg.attechment_details?.map((file, idx) => (
                <video
                  key={idx}
                  src={file.url}
                  controls
                  className="chat-video"
                />
              ))}

            {msg.message_type === "audio" &&
              msg.attechment_details?.map((file, idx) => (
                <audio
                  key={idx}
                  src={file.url}
                  controls
                  className="chat-audio"
                />
              ))}
          </div>
        ))} */}
        {messages.map((msg, i) => (
  <div
    key={i}
    className={`chat-message ${
      msg.sender_id === user?._id ? "sent" : "received"
    }`}
  >
    {msg.message_type === "text" && <p>{msg.message}</p>}

    {msg.message_type === "image" &&
      Array.isArray(msg.attechment_details) &&
      msg.attechment_details.map((file, idx) => (
        <img
          key={idx}
          src={file.url}
          alt={file.name || "image"}
          className="chat-image"
        />
      ))}

    {msg.message_type === "video" &&
      Array.isArray(msg.attechment_details) &&
      msg.attechment_details.map((file, idx) => (
        <video
          key={idx}
          src={file.url}
          controls
          className="chat-video"
        />
      ))}

    {msg.message_type === "audio" &&
      Array.isArray(msg.attechment_details) &&
      msg.attechment_details.map((file, idx) => (
        <audio
          key={idx}
          src={file.url}
          controls
          className="chat-audio"
        />
      ))}
  </div>
))}

      </div>

      <div className="chat-input">
        <button
          className="file-btn"
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;







// import React, { useState, useEffect } from "react";
// import "../styles/Chat.css";
// import { getSocket, initSocket } from "../utils/socket";
// import { useAuth } from "../context/AuthContext";


// const Chat = () => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     if (!user || !user._id) return;

//     const socket = initSocket(user._id);

//     socket.on("chat_message", (msg) => {
//       console.log("📩 Received:", msg);
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       if (socket) {
//         socket.off("chat_message");
//       }
//     };
//   }, [user]);

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const socket = getSocket();
//     if (socket && socket.connected) {
//       const msgData = {
//         sender_id: user._id,
//         receiver_id: "68ac53cd94d1159bdf9ead68", // <-- hardcoded for test
//         message: input,
//         message_type: "text",
//         created_at: new Date(),
//       };

//       socket.emit("chat_message", msgData);
//       setMessages((prev) => [...prev, msgData]);
//       setInput("");
//     } else {
//       console.error("⚠️ Socket not connected");
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`chat-message ${
//               msg.sender_id === user._id ? "sent" : "received"
//             }`}
//           >
//             {msg.message}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
