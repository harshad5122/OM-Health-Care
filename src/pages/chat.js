// import React, { useState, useEffect, useRef } from "react";
// import "../styles/Chat.css";
// import { getSocket, initSocket } from "../utils/socket";
// import { useAuth } from "../context/AuthContext";
// import { getMessageList } from "../api/messageApi";
// import { uploadFile } from "../api/uploadFileApi";
// import { Paperclip, Send, Trash2, Edit, CornerUpLeft, Check, X, ChevronDown } from "lucide-react";

// const Chat = () => {
//   const { user, token } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [attachment, setAttachment] = useState(null);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [activeMessageMenu, setActiveMessageMenu] = useState(null);
//   const fileInputRef = useRef(null);
//   const adminId = "68ac53cd94d1159bdf9ead68"; //68ac53cd94d1159bdf9ead68,,68a714a16750987af5cc5736
//   const chatBoxRef = useRef(null);

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (!user || !user._id) return;

//     const socket = initSocket(user._id);

//     const fetchMessages = async () => {
//       const oldMsgs = await getMessageList(adminId, token);
//       setMessages(oldMsgs.reverse());
//     };
//     fetchMessages();

//     const handleIncoming = (msg) => {
//       setMessages(prev => [...prev, msg]);
//     };

//     const handleMessageUpdated = (updatedMsg) => {
//       setMessages(prev => prev.map(msg => 
//         msg._id === updatedMsg._id ? { ...updatedMsg, edited: true } : msg
//       ));
//     };

//     const handleMessageDeleted = (deletedMsg) => {
//       setMessages(prev => prev.map(msg => 
//         msg._id === deletedMsg.messageId ? { ...msg, is_deleted: true } : msg
//       ));
//     };

//     socket.on("chat_message", handleIncoming);
//     socket.on("message_updated", handleMessageUpdated);
//     socket.on("message_deleted", handleMessageDeleted);

//     return () => {
//       socket.off("chat_message", handleIncoming);
//       socket.off("message_updated", handleMessageUpdated);
//       socket.off("message_deleted", handleMessageDeleted);  
//     };
//   }, [user, token]);

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const socket = getSocket();
//     if (socket && socket.connected) {
//       if (editingMessage) {
//         // Update existing message
//         socket.emit("update_message", {
//           messageId: editingMessage._id,
//           message: input,
//           message_type: "text"
//         });

//         // Optimistic update
//         setMessages(prev => prev.map(msg => 
//           msg._id === editingMessage._id ? 
//           { ...msg, message: input, edited: true } : msg
//         ));

//         setEditingMessage(null);
//         setInput("");
//         return;
//       }

//       const msgData = {
//         sender_id: user._id,
//         receiver_id: adminId,
//         message: input,
//         message_type: attachment ? attachment.type : 'text',
//         created_at: new Date(),
//         ...(replyingTo && { reply_to: replyingTo._id })
//       };

//       console.log("📩 Sending message:", JSON.stringify(msgData, null, 2));

//       socket.emit("chat_message", msgData);
//       setMessages(prev => [...prev, msgData]);
//       setInput("");
//       setAttachment(null); 
//       setReplyingTo(null);
//     }
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const uploaded = await uploadFile(file, token);

//        setAttachment(uploaded);
//       const msgData = {
//         sender_id: user._id,
//         receiver_id: adminId,
//         message_type: uploaded.fileType,
//         attechment_id: [uploaded._id],
//         attechment_details: [uploaded],
//         created_at: new Date(),
//         ...(replyingTo && { reply_to: replyingTo._id })
//       };

//       const socket = getSocket();
//       if (socket && socket.connected) {
//         socket.emit("chat_message", msgData);
//         setMessages(prev => [...prev, msgData]);
//         setReplyingTo(null);
//         setAttachment(null);
//       }
//     } catch (err) {
//       console.error("File upload failed:", err);
//     }
//   };

//   const handleDeleteMessage = (messageId) => {
//     const socket = getSocket();
//     if (socket && socket.connected) {
//       socket.emit("delete_message", { 
//         messageId,
//         userId: user._id,
//         deleteForEveryone: true
//       });

//       // Optimistic update
//       setMessages(prev => prev.map(msg => 
//         msg._id === messageId ? { ...msg, is_deleted: true } : msg
//       ));
//     }
//     setActiveMessageMenu(null);
//   };

//   const startEditingMessage = (message) => {
//     // Only allow editing text messages
//     if (message.message_type === "text") {
//       setEditingMessage(message);
//       setInput(message.message);
//       setActiveMessageMenu(null);
//     }
//   };

//   const cancelEditing = () => {
//     setEditingMessage(null);
//     setInput("");
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const toggleMessageMenu = (messageId) => {
//     setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
//   };
// const getFirstAttachment = (m) =>
//   Array.isArray(m?.attechment_details) ? m.attechment_details[0] : null;

// const bytesToKB = (b) => (typeof b === "number" ? `${Math.round(b / 1024)} KB` : "");

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <div className="chat-user-info">
//           <div className="user-avatar">OM</div>
//           <div className="user-details">
//             <h3>OM Healthcare</h3>
//             <p>Online</p>
//           </div>
//         </div>
//       </div>

//       <div className="chat-box" ref={chatBoxRef}>
//         {messages.map((msg, i) => (
//           !msg.is_deleted && (
//             <div key={i} className={`chat-message ${msg.sender_id === user?._id ? "sent" : "received"}`}>

//               {msg.reply_to && (
//   <div className="reply-preview">
//     {(() => {
//       const originalMsg = messages.find(m => m._id === msg.reply_to);
//       if (!originalMsg) return <p>Original message</p>;

//       const att = getFirstAttachment(originalMsg);

//       switch (originalMsg.message_type) {
//         case "text":
//           return <p>{originalMsg.message}</p>;
//         case "image":
//           return (

//              <img 
//                   src={att?.url}
//               alt={att?.name || ""}
//                   className="reply-image" 
//                    loading="lazy"
//                 />
//           );
//         case "video":
//           return (
//             <video
//               src={att?.url}
//               className="reply-video"
//               muted
//               playsInline
//             />
//           );
//         case "audio":
//           return (
//             <div className="reply-audio">
//               🎧 {att?.name || "Audio"}
//             </div>
//           );
//         default:
//           return (
//             <a
//               href={att?.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="reply-document"
//               title={att?.name}
//             >
//               📄 {att?.name || "Document"}
//               {att?.size ? ` • ${bytesToKB(att.size)}` : ""}
//             </a>
//           );
//       }
//     })()}
//   </div>
// )}


//               {msg.message_type === "text" && (
//                 <p className="chat-text">
//                   {msg.message}
//                   {msg.edited && <span className="edited-label"> (edited)</span>}
//                 </p>
//               )}

//               {msg.message_type === "image" && Array.isArray(msg.attechment_details) && (
//                 <img 
//                   src={msg.attechment_details[0]?.url} 
//                   alt={msg.attechment_details[0]?.name || "image"} 
//                   className="chat-image" 
//                    loading="lazy"
//                 />
//               )}

//               {msg.message_type === "video" && Array.isArray(msg.attechment_details) && (
//                 <video src={msg.attechment_details[0]?.url} controls className="chat-video" />
//               )}

//               {msg.message_type === "audio" && Array.isArray(msg.attechment_details) && (
//                 <audio src={msg.attechment_details[0]?.url} controls className="chat-audio" />
//               )}
//               {msg.message_type === "document" && (() => {
//   const att = getFirstAttachment(msg);
//   return (
//     <a
//       href={att?.url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="chat-document"
//       title={att?.name}
//     >
//       {/* 📎 */}
//       📄 {att?.name || "Document"}   
//       {att?.size ? ` • ${bytesToKB(att.size)}` : ""}
//     </a>
//   );
// })()}

//               <div className="message-meta">
//                 <span className="time">{formatTime(msg.created_at)}</span>
//                 {msg.sender_id === user?._id && (
//                   <button className="menu-btn" onClick={() => toggleMessageMenu(msg._id)}>
//                     <ChevronDown size={16} />
//                   </button>
//                 )}
//               </div>

//               {activeMessageMenu === msg._id && (
//                 <div className="message-menu">
//                   {msg.message_type === "text" && (
//                     <button onClick={() => startEditingMessage(msg)}>
//                       <Edit size={14} /> Edit
//                     </button>
//                   )}
//                   <button onClick={() => handleDeleteMessage(msg._id)}>
//                     <Trash2 size={14} /> Delete
//                   </button>
//                   <button onClick={() => {
//                     setReplyingTo(msg);
//                     setActiveMessageMenu(null);
//                   }}>
//                     <CornerUpLeft size={14} /> Reply
//                   </button>
//                 </div>
//               )}
//             </div>
//           )
//         ))}
//       </div>

//       {replyingTo && (
//         <div className="reply-indicator">
//           <div>
//             <span>Replying to {replyingTo.sender_id === user._id ? "yourself" : "them"}</span>
//             <p>{replyingTo.message?.substring(0, 30)}{replyingTo.message?.length > 30 ? "..." : ""}</p>
//           </div>
//           <button onClick={() => setReplyingTo(null)}>
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       <div className="chat-input">
//         <button className="file-btn" onClick={() => fileInputRef.current.click()}>
//           <Paperclip size={20} />
//         </button>
//         <input 
//           type="file" 
//           ref={fileInputRef} 
//           style={{ display: "none" }} 
//           // accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
//           onChange={handleFileUpload} 
//         />
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         {editingMessage ? (
//           <div className="edit-actions">
//             <button className="cancel-edit" onClick={cancelEditing}>
//               <X size={18} />
//             </button>
//             <button className="confirm-edit" onClick={sendMessage}>
//               <Check size={18} />
//             </button>
//           </div>
//         ) : (
//           <button className="send-btn" onClick={sendMessage}>
//             <Send size={20} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;







import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
// import { getMessageList } from "../api/messageApi";
// import { uploadFile } from "../api/uploadFileApi";
// import { getAdminList, getStaffList, getUserList } from "../api/userApi";
import { Paperclip, Send, Trash2, Edit, CornerUpLeft, Check, X, ChevronDown } from "lucide-react";
import { useUserApi } from "../api/userApi";
import { useMessageApi } from "../api/messageApi";
import { useUploadFile } from "../api/uploadFileApi";

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("admins");
  const [selectedUser, setSelectedUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const fileInputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const { getAdminList, getStaffList, getUserList } = useUserApi();
  const { getMessageList } = useMessageApi()
  const { uploadFile } = useUploadFile();

  // Fetch user lists based on role
  useEffect(() => {
    if (!token) return;

    const fetchLists = async () => {
      try {
        const adminList = await getAdminList(token);
        setAdmins(adminList);

        if (user.role === 2) { // Admin
          const staffList = await getStaffList(token);
          const userList = await getUserList(token);
          setStaff(staffList);
          setUsers(userList);
        }
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    fetchLists();
  }, [token, user?.role]);


  useEffect(() => {
    if (admins.length > 0 && !selectedUser) {
      setSelectedUser(admins[0]);
    }
  }, [admins, selectedUser]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!user || !user._id || !selectedUser) {
      setMessages([]);
      return;
    }

    const socket = initSocket(user._id);

    const fetchMessages = async () => {
      try {
        const oldMsgs = await getMessageList(selectedUser._id, token);
        setMessages(oldMsgs.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };
    fetchMessages();

    const handleIncoming = (msg) => {
      if (
        (msg.sender_id === selectedUser._id && msg.receiver_id === user._id) ||
        (msg.sender_id === user._id && msg.receiver_id === selectedUser._id)
      ) {
        // setMessages(prev => [...prev, msg]);
        setMessages(prev => {
          const exists = prev.some(m => m._id === msg._id || (m._id.startsWith('temp-') && m.created_at === msg.created_at));
          return exists ? prev : [...prev, msg];
        });
      }
    };

    const handleMessageUpdated = (updatedMsg) => {
      setMessages(prev => prev.map(msg =>
        msg._id === updatedMsg._id ? { ...updatedMsg, edited: true } : msg
      ));
    };

    const handleMessageDeleted = (deletedMsg) => {
      setMessages(prev => prev.map(msg =>
        msg._id === deletedMsg.messageId ? { ...msg, is_deleted: true } : msg
      ));
    };

    socket.on("chat_message", handleIncoming);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("chat_message", handleIncoming);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [user, token, selectedUser]);
  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    const socket = getSocket();
    if (socket && socket.connected) {
      if (editingMessage) {
        socket.emit("update_message", {
          messageId: editingMessage._id,
          message: input,
          message_type: "text"
        });

        setMessages(prev => prev.map(msg =>
          msg._id === editingMessage._id ?
            { ...msg, message: input, edited: true } : msg
        ));

        setEditingMessage(null);
        setInput("");
        return;
      }

      const msgData = {
        sender_id: user._id,
        receiver_id: selectedUser._id,
        message: input,
        message_type: attachment ? attachment.type : 'text',
        created_at: new Date().toISOString(),
        ...(replyingTo && { reply_to: replyingTo._id })
      };

      socket.emit("chat_message", msgData);
      setMessages(prev => [...prev, {
        ...msgData,
        _id: `temp-${Date.now()}`,
        sender_id: user._id,
        edited: false
      }]);
      setInput("");
      setAttachment(null);
      setReplyingTo(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    try {
      const uploaded = await uploadFile(file, token);

      const msgData = {
        sender_id: user._id,
        receiver_id: selectedUser._id,
        message_type: uploaded.fileType,
        attechment_id: [uploaded._id],
        attechment_details: [uploaded],
        created_at: new Date().toISOString(),
        ...(replyingTo && { reply_to: replyingTo._id })
      };

      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit("chat_message", msgData);
        setMessages(prev => [...prev, {
          ...msgData,
          _id: `temp-${Date.now()}`,
          sender_id: user._id
        }]);
        setReplyingTo(null);
        setAttachment(null);
      }
      fileInputRef.current.value = null;
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleDeleteMessage = (messageId) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("delete_message", {
        messageId,
        userId: user._id,
        deleteForEveryone: true
      });

      setMessages(prev => prev.map(msg =>
        msg._id === messageId ? { ...msg, is_deleted: true } : msg
      ));
    }
    setActiveMessageMenu(null);
  };

  const startEditingMessage = (message) => {
    if (message.message_type === "text") {
      setEditingMessage(message);
      setInput(message.message);
      setActiveMessageMenu(null);
    }
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setInput("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  const messageMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target)) {
        setActiveMessageMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMessageMenu]);


  const toggleMessageMenu = (messageId) => {
    setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
  };

  const getFirstAttachment = (m) =>
    Array.isArray(m?.attechment_details) ? m.attechment_details[0] : null;

  const bytesToKB = (b) => (typeof b === "number" ? `${Math.round(b / 1024)} KB` : "");

  const getUserInitials = (person) => {
    if (!person || (!person.firstname && !person.lastname)) return "?";
    const firstInitial = person.firstname ? person.firstname[0] : '';
    const lastInitial = person.lastname ? person.lastname[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const renderUserList = () => {
    let list = [];
    if (user.role === 2) {
      if (activeTab === "admins") list = admins;
      else if (activeTab === "staff") list = staff;
      else if (activeTab === "users") list = users;
    } else {
      list = admins;
    }

    if (list.length === 0) {
      return <p className="no-users-message">No users found in this category.</p>;
    }

    return list.map((person) => (
      <div
        key={person._id}
        className={`user-list-item ${selectedUser?._id === person._id ? "active" : ""}`}
        onClick={() => setSelectedUser(person)}
      >
        <div className="user-avatar">
          {getUserInitials(person)}
        </div>
        <div className="user-info">
          <h4>{person.firstname} {person.lastname}</h4>
          <p>{person.is_online ? "Online" : "Offline"}</p>
        </div>
      </div>
    ));
  };

  return (
    // <div className="chat-container">
    <div id="chat-app-container" className="chat-container">
      {/* Left sidebar */}
      <div id="chat-sidebar" className="chat-sidebar">
        {user.role === 2 && (
          <div className="user-tabs">
            <button
              className={activeTab === "admins" ? "active" : ""}
              onClick={() => setActiveTab("admins")}
            >
              Admins
            </button>
            <button
              className={activeTab === "staff" ? "active" : ""}
              onClick={() => setActiveTab("staff")}
            >
              Staff
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          </div>
        )}

        <div className="user-list">
          {renderUserList()}
        </div>
      </div>

      {/* Right chat area */}
      <div id="chat-main" className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="user-avatar">
                  {getUserInitials(selectedUser)}
                </div>
                <div className="user-details">
                  <h3>{selectedUser.firstname} {selectedUser.lastname}</h3>
                  <p>{selectedUser.is_online ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="chat-box" ref={chatBoxRef}>
              {messages.length === 0 && (
                <div className="no-messages">
                  <p>Start a conversation with {selectedUser.firstname} {selectedUser.lastname}!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                !msg.is_deleted && (
                  <div key={msg._id || i} className={`chat-message ${msg.sender_id === user?._id ? "sent" : "received"}`}>
                    {msg.reply_to && (
                      <div className="reply-preview">
                        {(() => {
                          const originalMsg = messages.find(m => m._id === msg.reply_to);
                          if (!originalMsg) return <p>Original message not found</p>;

                          const att = getFirstAttachment(originalMsg);

                          switch (originalMsg.message_type) {
                            case "text": return <p>{originalMsg.message}</p>;
                            case "image": return (
                              <img
                                src={att?.url}
                                alt={att?.name || ""}
                                className="reply-image"
                                loading="lazy"
                              />
                            );
                            case "video": return (
                              <video
                                src={att?.url}
                                className="reply-video"
                                muted
                                playsInline
                              />
                            );
                            case "audio": return (
                              <div className="reply-audio">
                                🎧 {att?.name || "Audio"}
                              </div>
                            );
                            default: return (
                              <a
                                href={att?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="reply-document"
                                title={att?.name}
                              >
                                📄 {att?.name || "Document"}
                                {att?.size ? ` • ${bytesToKB(att.size)}` : ""}
                              </a>
                            );
                          }
                        })()}
                      </div>
                    )}

                    {msg.message_type === "text" && (
                      <p className="chat-text">
                        {msg.message}
                        {msg.edited && <span className="edited-label"> Edited</span>}
                      </p>
                    )}

                    {msg.message_type === "image" && Array.isArray(msg.attechment_details) && (
                      <img
                        src={msg.attechment_details[0]?.url}
                        alt={msg.attechment_details[0]?.name || "image"}
                        className="chat-image"
                        loading="lazy"
                      />
                    )}

                    {msg.message_type === "video" && Array.isArray(msg.attechment_details) && (
                      <video src={msg.attechment_details[0]?.url} controls className="chat-video" />
                    )}

                    {msg.message_type === "audio" && Array.isArray(msg.attechment_details) && (
                      <audio src={msg.attechment_details[0]?.url} controls className="chat-audio" />
                    )}

                    {msg.message_type === "document" && (() => {
                      const att = getFirstAttachment(msg);
                      return (
                        <a
                          href={att?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-document"
                          title={att?.name}
                        >
                          📄 {att?.name || "Document"}
                          {att?.size ? ` • ${bytesToKB(att.size)}` : ""}
                        </a>
                      );
                    })()}

                    <div className="message-meta">
                      {/* <span className="time">{formatTime(msg.created_at)}</span> */}
                      {msg.sender_id === user?._id && (
                        <button className="menu" onClick={(e) => { e.stopPropagation(); toggleMessageMenu(msg._id); }}>
                          <ChevronDown size={16} />
                        </button>
                      )}
                      <span className="time">{formatTime(msg.created_at)}</span>
                    </div>

                    {activeMessageMenu === msg._id && (
                      <div className="message-menu" ref={messageMenuRef}>
                        {msg.message_type === "text" && (
                          <button onClick={() => startEditingMessage(msg)}>
                            <Edit size={14} /> Edit
                          </button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg._id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                        <button onClick={() => {
                          setReplyingTo(msg);
                          setActiveMessageMenu(null);
                        }}>
                          <CornerUpLeft size={14} /> Reply
                        </button>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>

            {replyingTo && (
              <div className="reply-indicator">
                <div>
                  <span>Replying to {replyingTo.sender_id === user._id ? "yourself" : (replyingTo.firstname || "them")}</span>
                  <p>{replyingTo.message?.substring(0, 30)}{replyingTo.message?.length > 30 ? "..." : ""}</p>
                </div>
                <button onClick={() => setReplyingTo(null)}>
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="chat-input">
              <button className="file-btn" onClick={() => fileInputRef.current.click()}>
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

              {editingMessage ? (
                <div className="edit-actions">
                  <button className="cancel-edit" onClick={cancelEditing}>
                    <X size={18} />
                  </button>
                  <button className="confirm-edit" onClick={sendMessage}>
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <button className="send-btn" onClick={sendMessage}>
                  <Send size={20} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;



