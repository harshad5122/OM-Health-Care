import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { getMessageList } from "../api/messageApi";
import { uploadFile } from "../api/uploadFileApi";
import { Paperclip, Send, Trash2, Edit, CornerUpLeft, Check, X, ChevronDown } from "lucide-react";

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const fileInputRef = useRef(null);
  const adminId = "68ac53cd94d1159bdf9ead68"; //68ac53cd94d1159bdf9ead68,,68a714a16750987af5cc5736
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!user || !user._id) return;

    const socket = initSocket(user._id);

    const fetchMessages = async () => {
      const oldMsgs = await getMessageList(adminId, token);
      setMessages(oldMsgs.reverse());
    };
    fetchMessages();

    const handleIncoming = (msg) => {
      setMessages(prev => [...prev, msg]);
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
  }, [user, token]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const socket = getSocket();
    if (socket && socket.connected) {
      if (editingMessage) {
        // Update existing message
        socket.emit("update_message", {
          messageId: editingMessage._id,
          message: input,
          message_type: "text"
        });
        
        // Optimistic update
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
        receiver_id: adminId,
        message: input,
        message_type: attachment ? attachment.type : 'text',
        created_at: new Date(),
        ...(replyingTo && { reply_to: replyingTo._id })
      };

      console.log("📩 Sending message:", JSON.stringify(msgData, null, 2));

      socket.emit("chat_message", msgData);
      setMessages(prev => [...prev, msgData]);
      setInput("");
      setAttachment(null); 
      setReplyingTo(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file, token);
      //  const firstAttachment = Array.isArray(uploaded) ? uploaded[0] : uploaded;

       setAttachment(uploaded);
      const msgData = {
        sender_id: user._id,
        receiver_id: adminId,
        message_type: uploaded.fileType,
        attechment_id: [uploaded._id],
        attechment_details: [uploaded],
      //   message_type: firstAttachment.fileType,
      // attachment_id: firstAttachment._id,  
      // attechment_details: [firstAttachment],
        created_at: new Date(),
        ...(replyingTo && { reply_to: replyingTo._id })
      };

      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit("chat_message", msgData);
        setMessages(prev => [...prev, msgData]);
        setReplyingTo(null);
        setAttachment(null);
      }
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
      
      // Optimistic update
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, is_deleted: true } : msg
      ));
    }
    setActiveMessageMenu(null);
  };

  const startEditingMessage = (message) => {
    // Only allow editing text messages
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

  const toggleMessageMenu = (messageId) => {
    setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
  };
const getFirstAttachment = (m) =>
  Array.isArray(m?.attechment_details) ? m.attechment_details[0] : null;

const bytesToKB = (b) => (typeof b === "number" ? `${Math.round(b / 1024)} KB` : "");

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">OM</div>
          <div className="user-details">
            <h3>OM Healthcare</h3>
            <p>Online</p>
          </div>
        </div>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          !msg.is_deleted && (
            <div key={i} className={`chat-message ${msg.sender_id === user?._id ? "sent" : "received"}`}>
              
              {msg.reply_to && (
  <div className="reply-preview">
    {(() => {
      const originalMsg = messages.find(m => m._id === msg.reply_to);
      if (!originalMsg) return <p>Original message</p>;

      const att = getFirstAttachment(originalMsg);

      switch (originalMsg.message_type) {
        case "text":
          return <p>{originalMsg.message}</p>;
        case "image":
          return (
           
             <img 
                  // src={msg.attechment_details[0]?.url} 
                  // alt={msg.attechment_details[0]?.name || "image"} 
                  src={att?.url}
              alt={att?.name || ""}
                  className="reply-image" 
                   loading="lazy"
                />
          );
        case "video":
          return (
            <video
              // src={originalMsg.attechment_details?.[0]?.url}
              src={att?.url}
              className="reply-video"
              // controls={false}
              muted
              playsInline
            />
          );
        case "audio":
          return (
            // <audio
            //   src={originalMsg.attechment_details?.[0]?.url}
            //   className="reply-audio"
            //   controls={false}
            // />
            <div className="reply-audio">
              🎧 {att?.name || "Audio"}
            </div>
          );
        // case "document":
        //   return (
        //     <a
        //       href={originalMsg.attechment_details?.[0]?.url}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //       className="reply-document"
        //     >
        //       📄 {originalMsg.attechment_details?.[0]?.name || "Document"}
        //     </a>
        //   );
         // treat everything else as a document
        default:
          return (
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
        // default:
        //   return <p>Unsupported message type</p>;
      }
    })()}
  </div>
)}

              
              {msg.message_type === "text" && (
                <p className="chat-text">
                  {msg.message}
                  {msg.edited && <span className="edited-label"> (edited)</span>}
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
      {/* 📎 */}
      📄 {att?.name || "Document"}   
      {att?.size ? ` • ${bytesToKB(att.size)}` : ""}
    </a>
  );
})()}
              
              <div className="message-meta">
                <span className="time">{formatTime(msg.created_at)}</span>
                {msg.sender_id === user?._id && (
                  <button className="menu-btn" onClick={() => toggleMessageMenu(msg._id)}>
                    <ChevronDown size={16} />
                  </button>
                )}
              </div>
              
              {activeMessageMenu === msg._id && (
                <div className="message-menu">
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
            <span>Replying to {replyingTo.sender_id === user._id ? "yourself" : "them"}</span>
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
          // accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
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
    </div>
  );
};

export default Chat;

