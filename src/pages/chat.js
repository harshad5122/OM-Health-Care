
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
  const inputRef = useRef(null);
  const { getAdminList, getStaffList, getUserList } = useUserApi();
  const { getMessageList } = useMessageApi()
  const { uploadFile } = useUploadFile();

  // Fetch user lists based on role
  useEffect(() => {
    if (!token) return;

    const fetchLists = async () => {
      try {
        const adminList = await getAdminList();
        setAdmins(adminList);

        if (user.role === 2) { // Admin
          const staffList = await getStaffList();
          const userList = await getUserList({ skip: null, limit: null, search: "" });
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
        setMessages(oldMsgs?.reverse());
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
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            inputRef.current.value.length,
            inputRef.current.value.length
          );
        }
      }, 0);
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

  const [menuPosition, setMenuPosition] = React.useState("below");
  const toggleMessageMenu = (messageId, e) => {
    setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
    const messageEl = msgRefs.current[messageId];
    const chatBoxEl = chatBoxRef.current;

    if (messageEl && chatBoxEl) {
      const msgRect = messageEl.getBoundingClientRect();
      const chatRect = chatBoxEl.getBoundingClientRect();

      const spaceAbove = msgRect.top - chatRect.top;
      const menuHeight = 130;
      if (spaceAbove > menuHeight) {
        setMenuPosition("above");
      } else {
        setMenuPosition("below");
      }
    }
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
    if (user?.role === 2) {
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
          <h4 className="text-left">{person.firstname} {person.lastname}</h4>
          <p className="text-left">{person.is_online ? "Online" : "Offline"}</p>
        </div>
      </div>
    ));
  };
  const msgRefs = useRef({});
  return (
    // <div className="chat-container">
    <div id="chat-app-container" className="chat-container">
      {/* Left sidebar */}
      <div id="chat-sidebar" className="chat-sidebar">
        {user?.role === 2 && (
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
              Doctor
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
                  <h3 className="m-0 text-[16px] font-semibold text-[#343a40]">{selectedUser.firstname} {selectedUser.lastname}</h3>
                  <p className="mt-[2px] mb-0 text-[12px] text-[#495057] opacity-80 text-left">{selectedUser.is_online ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="chat-box" ref={chatBoxRef}>

              {(!messages || messages.length === 0) && (
                <div className="no-messages flex items-center justify-center h-full">
                  <p className="text-gray-400 text-[14px]">
                    "Start a conversation with {selectedUser?.firstname} {selectedUser?.lastname} !"
                  </p>
                </div>
              )}
              {messages?.map((msg, i) => (
                !msg?.is_deleted && (
                  <div key={msg?._id || i} className={`chat-message ${msg?.sender_id === user?._id ? "sent" : "received"}`} >
                    {msg?.reply_to && (
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
                      <span className="relative w-full text-left leading-[1.2] pt-0.5" ref={el => msgRefs.current[msg._id] = el}>
                        {msg.message}
                        {msg.edited && <span className="edited-label"> Edited</span>}
                      </span>
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
                        <button className="menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessageMenu(msg._id, e);
                          }}
                        >
                          <ChevronDown size={16} />
                        </button>
                      )}
                      <span className="time" >{formatTime(msg.created_at)}</span>
                    </div>

                    {activeMessageMenu === msg._id && (
                      <div className={`message-menu absolute right-[10px] bg-white rounded shadow-md z-10 min-w-[120px] py-[5px]`}
                        style={
                          menuPosition === "below"
                            ? {
                              top: msgRefs.current[msg._id]?.offsetHeight
                                ? msgRefs.current[msg._id].offsetHeight + 8
                                : 30,
                            }
                            : {
                              bottom: msgRefs.current[msg._id]?.offsetHeight
                                ? msgRefs.current[msg._id].offsetHeight + 38
                                : 30,
                            }
                        }
                        ref={messageMenuRef}
                      >
                        {msg.message_type === "text" && (
                          <button onClick={() => startEditingMessage(msg)}>
                            <Edit size={14} /> Edit
                          </button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg._id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                        {/* <button onClick={() => {
                          setReplyingTo(msg);
                          setActiveMessageMenu(null);
                        }}>
                          <CornerUpLeft size={14} /> Reply
                        </button> */}
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
                ref={inputRef}
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



