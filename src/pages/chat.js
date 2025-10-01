import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Chat.css";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import {
  Paperclip,
  Send,
  Trash2,
  Edit,
  CornerUpLeft,
  Check,
  X,
  ChevronDown,
  Search,
  MoreVertical,
  MessageSquare,
  CheckCheck,
  ArrowLeft,
  Megaphone
} from "lucide-react";
import { useUserApi } from "../api/userApi";
import { useMessageApi } from "../api/messageApi";
import { useUploadFile } from "../api/uploadFileApi";

// --- Helper Functions ---

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDateHeader = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Clear time part for accurate date comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Today";
  }

  if (date.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Check if the date is within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  if (date > sevenDaysAgo) {
    return date.toLocaleDateString("en-US", { weekday: 'long' });
  }

  // For anything older, return the numerical date
  return date.toLocaleDateString("en-US"); // e.g., "9/25/2025"
};

const formatChatListTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is today
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit", 
      hour12: true 
    });
  }

  // Check if the date is yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Check if the date is within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  if (date > sevenDaysAgo) {
    return date.toLocaleDateString("en-US", { weekday: 'long' });
  }

  // For anything older, return the numerical date
  return date.toLocaleDateString("en-US");
};

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("admins");
  const [selectedChat, setSelectedChat] = useState(null); // Can be a user or a broadcast
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBroadcastMenu, setShowBroadcastMenu] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

   // --- NEW state for Broadcast functionality ---
  const [sidebarView, setSidebarView] = useState("list"); // 'list' or 'new-broadcast'
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [allPotentialRecipients, setAllPotentialRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [recipientSearch, setRecipientSearch] = useState("");

  const fileInputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const broadcastMenuRef = useRef(null);
  const messageMenuRef = useRef(null);
  const msgRefs = useRef({});

  const { getChatUsers, getUserList, getStaffList } = useUserApi();
  const { getMessageList, getBroadcastList  } = useMessageApi();
  const { uploadFile } = useUploadFile();

  // --- Main Socket Connection and Global Listeners ---
  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket(user._id);

    // Emit that the current user is online
    socket.emit("user_online", user._id);

    const handlePresenceUpdate = ({ userId, isOnline }) => {
      setOnlineUsers((prev) => new Map(prev).set(userId, isOnline));
      setChatUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, is_online: isOnline } : u))
      );
    };

    const handleMessageDelivered = ({ _id, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === _id ? { ...msg, message_status: status } : msg))
      );
    };

    const handleMessageSeenByReceiver = ({ messageId, message_status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, message_status } : msg))
      );
    };
    
    socket.on("presence_update", handlePresenceUpdate);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_seen", handleMessageSeenByReceiver);

    return () => {
      socket.emit("user_left_message_page", user._id);
      socket.off("presence_update", handlePresenceUpdate);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_seen", handleMessageSeenByReceiver);
    };
  }, [user?._id]);

  // --- Fetch Initial User List ---
  useEffect(() => {
    if ( !token) return;

    const fetchUsers = async () => {
      try {
        const usersFromServer = await getChatUsers(token);
     
        const processedUsers = usersFromServer.map(u => ({
          ...u,
          _id: u.user_id, // Standardize the ID property
          unreadCount: u.unreadCount || 0,
          is_online: false
        }));

         // <<< CHANGE #1: Sort the list right after fetching
      const sortedUsers = processedUsers.sort((a, b) => 
        new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0)
      );
        
        setChatUsers(sortedUsers || []);

        if (!selectedUser && sortedUsers.length > 0) {
          setSelectedUser(sortedUsers[0]);
        }
      } catch (err) {
        console.error("Error fetching chat users:", err);
      }
    };

    fetchUsers();

    if (user.role === 2) {
      const fetchBroadcasts = async () => {
        try {
          const broadcastList = await getBroadcastList(token);
          setBroadcasts(broadcastList || []);
        } catch (err) {
          console.error("Error fetching broadcasts:", err);
        }
      };
      fetchBroadcasts();
    }
    const socket = getSocket();
    const handleBroadcastCreated = ({ broadcast }) => {
      setBroadcasts(prev => [broadcast, ...prev]);
      setSidebarView("list"); // Switch back to the list view
    };
    socket.on("broadcast_created", handleBroadcastCreated);

    return () => {
      socket.off("broadcast_created", handleBroadcastCreated);
    };
  }, [token, user]);

  // --- Fetch Messages and Handle Chat-Specific Logic when a User is Selected ---
  useEffect(() => {
    if (!user?._id || !token || !selectedUser?._id) {
      setMessages([]);
      return;
    }

    const socket = getSocket();

    const fetchMessages = async () => {
      try {
        const oldMsgs = await getMessageList(selectedUser._id, token);
        setMessages(oldMsgs?.reverse() || []);
        // Once messages are loaded, mark them as seen
        markMessagesAsSeen(oldMsgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };
    fetchMessages();

    // Reset unread count for the selected user
    setChatUsers((prev) =>
      prev.map((u) => (u._id === selectedUser._id ? { ...u, unreadCount: 0 } : u))
    );

    const handleIncomingMessage = (msg) => {
        // Only process if it's part of the active chat
      if (
        (msg.sender_id === selectedUser._id && msg.receiver_id === user._id) ||
        (msg.sender_id === user._id && msg.receiver_id === selectedUser._id)
      ) {
        setMessages((prev) => {
          // Replace temp message with actual message from server
          const tempId = `temp-${msg.created_at}`;
          const finalMessages = prev.filter(m => m._id !== tempId);
          return [...finalMessages, msg];
        });
        // Mark as seen immediately since the chat is open
        socket.emit("message_seen", { messageId: msg._id, user_id: user._id });
        updateAndSortChatList(msg);
      } else {
        // If message is for another chat, update sidebar
        setChatUsers(prev => prev.map(u => {
          if (u._id === msg.sender_id) {
            return {
              ...u,
              unreadCount: (u.unreadCount || 0) + 1,
              messagePreview: msg.message || "Attachment",
              last_message: { created_at: msg.created_at }
            };
          }
          return u;
        }).sort((a, b) => new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0)));
      }
    };

    const handleMessageUpdated = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? { ...updatedMsg, edited: true } : msg))
      );
    };

    const handleMessageDeleted = (deletedMsg) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === deletedMsg.messageId ? { ...msg, is_deleted: true, message: "This message was deleted" } : msg
        )
      );
    };

    socket.on("chat_message", handleIncomingMessage);
    socket.on("new_message", handleIncomingMessage); // Listen to both
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("chat_message", handleIncomingMessage);
      socket.off("new_message", handleIncomingMessage);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [selectedUser?._id, user?._id, token]);


  // --- Mark Messages as Seen ---
  const markMessagesAsSeen = (msgs) => {
    // if (!user || !msgs) return;
    const socket = getSocket();
    msgs.forEach(msg => {
      if (msg.sender_id !== user._id && msg.message_status !== 'seen') {
        socket.emit("message_seen", { messageId: msg._id, user_id: user._id });
      }
    });
  };

  // --- Add this new helper function inside your Chat component ---

const updateAndSortChatList = (message) => {
  setChatUsers(prevChatUsers => {
    // Determine which user in the list to update (the other person in the chat)
    const chatPartnerId = message.sender_id === user._id ? message.receiver_id : message.sender_id;

    let userExists = false;
    const updatedList = prevChatUsers.map(u => {
      if (u._id === chatPartnerId) {
        userExists = true;
        return {
          ...u,
          // Don't increase unread count if the chat is already open with that user
          unreadCount: u._id === selectedUser?._id ? 0 : (u.unreadCount || 0) + 1,
          messagePreview: message.message || "Attachment",
          last_message: { created_at: message.created_at }
        };
      }
      return u;
    });

    // Return the newly sorted list
    return updatedList.sort((a, b) => 
      new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0)
    );
  });
};


  // --- Scroll to Bottom ---
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

      // --- Start Reply Function ---
  const startReplying = (message) => {
    setReplyingTo(message);
    setActiveMessageMenu(null);
    inputRef.current?.focus();
  };

  // --- Send/Edit Message Logic ---
  // const sendMessage = async () => {
  //   if ((!input.trim() && !fileInputRef.current?.files?.[0]) || !selectedUser) return;
  
  //   const socket = getSocket();
  //   if (!socket || !socket.connected) return;
  
  //   // Handle Editing
  //   if (editingMessage) {
  //     socket.emit("update_message", { messageId: editingMessage._id, message: input });
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg._id === editingMessage._id ? { ...msg, message: input, edited: true } : msg
  //       )
  //     );
  //     setEditingMessage(null);
  //     setInput("");
  //     return;
  //   }
  
  //   // Handle Sending New Message (Text or File)
  //   const tempCreatedAt = new Date().toISOString();
  //   const tempId = `temp-${tempCreatedAt}`;
  
  //   let msgData = {
  //     sender_id: user._id,
  //     receiver_id: selectedUser._id,
  //     message: input,
  //     message_type: "text",
  //     created_at: tempCreatedAt,
  //     ...(replyingTo && { reply_to: replyingTo._id }),
  //   };
  
  //   // Add temporary message to UI immediately
  //   setMessages((prev) => [...prev, { ...msgData, _id: tempId, message_status: "sent" }]);
    
  //   // Clear inputs
  //   setInput("");
  //   setReplyingTo(null);
  
  //   socket.emit("chat_message", msgData);
  // };

  // --- NEW: Open "New Broadcast" screen ---
  const openNewBroadcastScreen = async () => {
    setSidebarView("new-broadcast");
    // Fetch all doctors and users to select from
    try {
      const doctors = await getStaffList(token);
      // const users = await getUserList({ skip: null, limit: null, search: "" });
      // const allRecipients = [...doctors, ...users].map(u => ({...u, _id: u.user_id || u._id}));
      const usersResponse = await getUserList({ skip: null, limit: null, search: "" });
        const users = usersResponse.body || []; // Assuming users are in the 'body' property

        // Normalize both lists to ensure they have `_id` and `name`
        const normalizedDoctors = doctors.map(doc => ({
            _id: doc.user_id, // Staff list seems to use user_id
            name: doc.name,
        }));

        const normalizedUsers = users.map(usr => ({
            _id: usr._id, // User list uses _id
            name: usr.name,
        }));
        
        // Remove duplicates and the current admin from the list
        const allRecipientsMap = new Map();
        [...normalizedDoctors, ...normalizedUsers].forEach(p => {
            if (p._id !== user._id) { // Don't add yourself to the recipient list
               allRecipientsMap.set(p._id, p);
            }
        });

        const finalRecipients = Array.from(allRecipientsMap.values());
        setAllPotentialRecipients(finalRecipients);
        setAvailableRecipients(finalRecipients);
      // setAllPotentialRecipients(allRecipients);
      // setAvailableRecipients(allRecipients);
    } catch (err) {
      console.error("Failed to fetch recipients for broadcast", err);
      setAllPotentialRecipients([]);
        setAvailableRecipients([]);
    }
  };

  // --- NEW: Handle Recipient Selection ---
  const handleSelectRecipient = (recipient) => {
    setSelectedRecipients(prev => [...prev, recipient]);
    setAvailableRecipients(prev => prev.filter(r => r._id !== recipient._id));
    setRecipientSearch("");
  };

  const handleDeselectRecipient = (recipient) => {
    setSelectedRecipients(prev => prev.filter(r => r._id !== recipient._id));
    setAvailableRecipients(prev => [recipient, ...prev]);
  };
  
  // --- NEW: Create Broadcast Socket Emitter ---
  const handleCreateBroadcast = () => {
    if (!broadcastTitle.trim() || selectedRecipients.length === 0) {
      alert("Please provide a title and select at least one recipient.");
      return;
    }
    const socket = getSocket();
    socket.emit("create_broadcast", {
      admin_id: user._id,
      title: broadcastTitle,
      recipients: selectedRecipients.map(r => r._id),
    });
    // Reset state after emitting
    setBroadcastTitle("");
    setSelectedRecipients([]);
  };


  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const socket = getSocket();

    const isBroadcast = selectedChat.recipients; // Check if it's a broadcast object

    if (!socket?.connected) return;
 if (isBroadcast) {
      socket.emit("broadcast_message", {
        sender_id: user._id,
        broadcast_id: selectedChat.id,
        message: input,
      });
    } else {
    if (editingMessage) {
      socket.emit("update_message", { messageId: editingMessage._id, message: input });
      setEditingMessage(null);
    } else {
      const tempId = `temp-${Date.now()}`;
      const msgData = {
        _id: tempId,
        sender_id: user._id,
        receiver_id: selectedUser._id,
        message: input,
        message_type: "text",
        created_at: new Date().toISOString(),
        message_status: "sent",
        ...(replyingTo && { reply_to: replyingTo._id }), // Add reply_to field
      };
      setMessages((prev) => [...prev, msgData]);
      socket.emit("chat_message", { ...msgData, _id: undefined }); // Don't send temp ID to backend
    }

  }
    setInput("");
    setReplyingTo(null); // Clear reply state after sending
  };
  
  // --- File Upload Logic ---
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !selectedUser) return;
  
  //   try {
  //     const uploadedFileDetails = await uploadFile(file, token);
      
  //     const socket = getSocket();
  //     if (!socket || !socket.connected) {
  //         console.error("Socket not connected for file upload");
  //         return;
  //     }
  
  //     const msgData = {
  //       sender_id: user._id,
  //       receiver_id: selectedUser._id,
  //       message_type: uploadedFileDetails.fileType,
  //       attechment_id: [uploadedFileDetails._id],
  //       message: file.name, // Use filename as message preview
  //       created_at: new Date().toISOString(),
  //       ...(replyingTo && { reply_to: replyingTo._id }),
  //     };
      
  //     // Emit the message with attachment details
  //     socket.emit("chat_message", msgData);
  
  //     // Add a temporary message to the UI with local file URL for preview
  //     const tempId = `temp-${msgData.created_at}`;
  //     setMessages(prev => [
  //       ...prev,
  //       {
  //         ...msgData,
  //         _id: tempId,
  //         attechment_details: [{...uploadedFileDetails, url: URL.createObjectURL(file)}],
  //         message_status: 'sent'
  //       }
  //     ]);
  
  //   } catch (err) {
  //     console.error("File upload and message sending failed:", err);
  //   } finally {
  //     if(fileInputRef.current) fileInputRef.current.value = null;
  //     setReplyingTo(null);
  //   }
  // };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;
    try {
      const uploadedFileDetails = await uploadFile(file, token);
      const socket = getSocket();
      const msgData = {
        sender_id: user._id,
        receiver_id: selectedUser._id,
        message_type: uploadedFileDetails.fileType,
        attechment_id: [uploadedFileDetails._id],
        message: file.name,
        created_at: new Date().toISOString(),
        ...(replyingTo && { reply_to: replyingTo._id }), // Add reply_to field
      };
      socket.emit("chat_message", msgData);
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = null;
      setReplyingTo(null); // Clear reply state after sending
    }
  };

   // --- Scroll to Replied Message ---
  const scrollToMessage = (messageId) => {
    const element = msgRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 1500); // Highlight for 1.5s
    }
  };


  // --- Delete Message ---
  const handleDeleteMessage = (messageId) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("delete_message", { messageId });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, is_deleted: true, message: "This message was deleted" } : msg))
      );
    }
    setActiveMessageMenu(null);
  };
  
  // --- Edit Message ---
  const startEditingMessage = (message) => {
    if (message.message_type === "text") {
      setEditingMessage(message);
      setInput(message.message);
      setActiveMessageMenu(null);
      inputRef.current?.focus();
    }
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setInput("");
  };

  // --- Menu Handling ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target)) {
        setActiveMessageMenu(null);
      }
      // if (broadcastMenuRef.current && !broadcastMenuRef.current.contains(event.target)) {
      //   setShowBroadcastMenu(false);
      // }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMessageMenu = (messageId) => {
    setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
  };
  
  // --- Render Functions ---
  
  const getUserInitials = (person) => {
    if (!person?.name) return "?";
    const parts = person.name.trim().split(" ");
    const firstInitial = parts[0]?.[0] || "";
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

    // NEW: Renders the "Create Broadcast" screen
  const renderNewBroadcastView = () => {
    const filteredAvailable = recipientSearch
      ? availableRecipients.filter(r => r.name.toLowerCase().includes(recipientSearch.toLowerCase()))
      : availableRecipients;

    return (
      <div className="new-broadcast-container">
        <div className="new-broadcast-header">
          <button onClick={() => setSidebarView('list')}><ArrowLeft size={20} /></button>
          <h3>New Broadcast</h3>
        </div>
        <div className="broadcast-setup">
          <input 
            type="text" 
            placeholder="Broadcast list title..." 
            className="broadcast-title-input"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
          />
          <div className="recipient-selection">
            {selectedRecipients.length > 0 && (
              <div className="selected-recipients-container">
                {selectedRecipients.map(r => (
                  <div key={r._id} className="recipient-pill">
                    {r.name}
                    <button onClick={() => handleDeselectRecipient(r)}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <input 
              type="text" 
              placeholder="Search for doctors or users..." 
              className="recipient-search-input"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="available-recipients-list">
          {filteredAvailable.map(r => (
            <div key={r._id} className="user-list-item" onClick={() => handleSelectRecipient(r)}>
              {/* ... user avatar and info ... */}
              <div className="user-info"><h4>{r.name}</h4></div>
            </div>
          ))}
        </div>
        <button className="fab-create-broadcast" onClick={handleCreateBroadcast}>
          <Check size={24} />
        </button>
      </div>
    );
  };
  
  // NEW: Renders the list of existing broadcast channels
  const renderBroadcastList = () => {
    if (broadcasts.length === 0) return <p className="no-users-message">No broadcast lists found.</p>;
    
    return broadcasts.map((bc) => (
      <div
        key={bc.id}
        className={`user-list-item ${selectedChat?._id === bc.id && selectedChat?.isBroadcast ? "active" : ""}`}
        // onClick={() => setSelectedChat(bc)}
        onClick={() => setSelectedChat({ ...bc, _id: bc.id, isBroadcast: true })}
      >
        <div className="user-avatar"><Megaphone size={24} /></div>
        <div className="user-info">
          <h4>{bc.title}</h4>
          <p>{bc.lastMessage || `${bc.recipients.length} recipients`}</p>
        </div>
        <span className="time">{formatChatListTime(bc.createdAt)}</span>
      </div>
    ));
  };
  

  const renderUserList = () => {
    let listToRender;
    let filtered = chatUsers;
    if (user?.role === 2) { // Admin view
      if (activeTab === "admins") filtered = chatUsers.filter((u) => u.role === 2);
      else if (activeTab === "staff") filtered = chatUsers.filter((u) => u.role === 3);
      else if (activeTab === "users") filtered = chatUsers.filter((u) => u.role === 1);
    } else { // Normal user view
      filtered = chatUsers.filter((u) => u.role === 2);
    }
  
    if (searchTerm) {
        filtered = filtered.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    if (filtered.length === 0) {
      return <p className="no-users-message">No users found.</p>;
    }
  
    return filtered.map((person) => (
      <div
        key={person._id}
        className={`user-list-item ${selectedChat?._id === person._id && !selectedChat?.isBroadcast ? "active" : ""}`}
        onClick={() => setSelectedUser({ ...person, isBroadcast: false })}
      >
        <div className="flex items-center gap-3">
          <div className="user-avatar">{getUserInitials(person)}</div>
          <div className="user-info">
            <h4 className="text-left font-semibold">{person.name}</h4>
            <p className="text-left text-sm text-gray-500 truncate w-[160px]">
              {person.messagePreview || "No messages yet"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-gray-400">
            {person.last_message?.created_at ? formatChatListTime(person.last_message.created_at) : ""}
          </span>
          {person.unreadCount > 0 && (
            <span className="unread-badge">{person.unreadCount}</span>
          )}
        </div>
      </div>
    ));
    return listToRender;
  };

  const renderMessageContent = (msg) => {
    if (msg.is_deleted) {
      return <span className="deleted-message">{msg.message}</span>;
    }
    const attachment = Array.isArray(msg.attechment_details) ? msg.attechment_details[0] : null;

    switch (msg.message_type) {
      case "image":
        return <img src={attachment?.url} alt={attachment?.name || "image"} className="chat-image" loading="lazy" />;
      case "video":
        return <video src={attachment?.url} controls className="chat-video" />;
      case "audio":
        return <audio src={attachment?.url} controls className="chat-audio" />;
      case "document":
        return <a href={attachment?.url} target="_blank" rel="noopener noreferrer" className="chat-document">📄 {attachment?.name}</a>;
      default: // text
        return (
          <>
            {msg.message}
            {/* {msg.edited && <span className="edited-label">Edited</span>} */}
          </>
        );
    }
  };
  
  const MessageStatusIcon = ({ status }) => {
    if (status === 'seen') return <CheckCheck size={16} className="text-blue-500" />;
    if (status === 'delivered') return <CheckCheck size={16} className="text-gray-500" />;
    return <Check size={16} className="text-gray-500" />; // Sent
  };

  const renderMessagesWithDateHeaders = () => {
    const elements = [];
    let lastDate = null;

    messages.forEach((msg, index) => {
      const msgDate = new Date(msg.created_at);
      if (!lastDate || msgDate.toDateString() !== lastDate.toDateString()) {
        elements.push(
          <div key={`date-${msg.created_at}`} className="date-header">
            <span>{formatDateHeader(msgDate)}</span>
          </div>
        );
        lastDate = msgDate;
      }

       const originalMsg = msg.reply_to ? messages.find(m => m._id === msg.reply_to) : null;
      const originalSenderName = originalMsg ? (originalMsg.sender_id === user._id ? "You" : selectedUser.name) : "";


      elements.push(
        <div
          key={msg._id || `msg-${index}`}
          className={`chat-message ${msg.sender_id === user._id ? "sent" : "received"}`}
          ref={el => (msgRefs.current[msg._id] = el)}
        >
           {/* NEW: Render Reply Preview inside bubble */}
          {originalMsg && (
            <div className="reply-context" onClick={() => scrollToMessage(originalMsg._id)}>
              <p className="reply-context-sender">{originalSenderName}</p>
              <p className="reply-context-message">{originalMsg.message_type === 'text' ? originalMsg.message : "Attachment"}</p>
            </div>
          )}

          <div className="message-content">
{renderMessageContent(msg)}
          </div>
          
          <div className="message-meta">
             {/* "Edited" label is now here, it will only show if msg.edited is true */}
          {msg.edited && <span className="edited-label">Edited</span>}
            <span className="time">{formatTime(msg.created_at)}</span>
            {msg.sender_id === user._id && !msg.is_deleted && <MessageStatusIcon status={msg.message_status} />}
          </div>

          
          {/* {msg.sender_id === user._id && !msg.is_deleted && (
              <button className="menu-toggle" onClick={() => toggleMessageMenu(msg._id)}>
                  <ChevronDown size={16} />
              </button>
          )} */}

          {/* MODIFIED: Show menu button on ALL messages, not just sent */}
          {!msg.is_deleted && (
            <button className="menu-toggle" onClick={() => setActiveMessageMenu(activeMessageMenu === msg._id ? null : msg._id)}>
              <ChevronDown size={16} />
            </button>
          )}

          {activeMessageMenu === msg._id && (
            <div className="message-menu" ref={messageMenuRef}>
               <button onClick={() => startReplying(msg)}><CornerUpLeft size={14} /> Reply</button>
              {/* Show Edit/Delete only for sent messages */}
              {/* {msg.sender_id === user._id && (
                <> */}
              {msg.sender_id === user._id && msg.message_type === "text" && (
                <button onClick={() => startEditingMessage(msg)}><Edit size={14} /> Edit</button>
              )}
              <button onClick={() => handleDeleteMessage(msg._id)}><Trash2 size={14} /> Delete</button>
               {/* </>
              )} */}
            </div>
        
          )}
        </div>
      );
    });

    return elements;
  };
  
  // --- Component Return (JSX) ---
  return (
    <div id="chat-app-container" className="chat-container">
      {/* --- Left Sidebar --- */}
      <div id="chat-sidebar" className="chat-sidebar">
         {sidebarView === 'new-broadcast' ? (
          renderNewBroadcastView()
        ) : (
          <>
        <div className="sidebar-header">
          <div className="search-bar-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user?.role === 2 && (
            <div className="broadcast-menu-wrapper">
              <button className="broadcast-toggle" onClick={() => setShowBroadcastMenu(!showBroadcastMenu)}>
                <MoreVertical size={20} />
              </button>
              {showBroadcastMenu && (
                <div className="broadcast-menu" ref={broadcastMenuRef}>
                  <button onClick={openNewBroadcastScreen}>
                    <MessageSquare size={16} /> Create Broadcast
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {user?.role === 2 && (
          <div className="user-tabs">
            <button className={activeTab === "admins" ? "active" : ""} onClick={() => setActiveTab("admins")}>Admins</button>
            <button className={activeTab === "staff" ? "active" : ""} onClick={() => setActiveTab("staff")}>Doctor</button>
            <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
            <button className={activeTab === "broadcast" ? "active" : ""} onClick={() => setActiveTab("broadcast")}>Broadcast</button>
          </div>
        )}

        <div className="user-list">
           {activeTab === 'broadcast' ? renderBroadcastList() : renderUserList()}
          {/* {renderUserList()} */}
          </div>
           </>
        )}
      </div>

      {/* --- Right Chat Area --- */}
      <div id="chat-main" className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="user-avatar">{getUserInitials(selectedUser)}</div>
                <div className="user-details">
                  <h3 className="m-0 text-[16px] font-semibold text-[#343a40]">{selectedChat?.title || selectedUser.name}</h3>
                  {/* <p className="mt-[2px] mb-0 text-[12px] text-[#495057] opacity-80 text-left">
                    {onlineUsers.get(selectedUser._id) ? "Online" : "Offline"}
                  </p> */}
                  <p>{selectedChat?.recipients ? `${selectedChat?.recipients.length} recipients` : (onlineUsers.get(selectedChat?._id) ? "Online" : "Offline")}</p>
                </div>
              </div>
            </div>

            <div className="chat-box" ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>Start a conversation with {selectedUser.name}!</p>
                </div>
              ) : (
                renderMessagesWithDateHeaders()
              )}
            </div>

            <div className="chat-input-area">
                {replyingTo && (
                <div className="reply-preview-bar">
                  <div className="reply-preview-content">
                    <p className="reply-preview-sender">Replying to {replyingTo.sender_id === user._id ? "yourself" : selectedUser.name}</p>
                    <p className="reply-preview-message">{replyingTo.message_type === 'text' ? replyingTo.message : "Attachment"}</p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="reply-preview-close"><X size={16} /></button>
                </div>
              )}
              <div className="chat-input">
                <button className="file-btn" onClick={() => fileInputRef.current.click()}>
                  <Paperclip size={20} />
                </button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  ref={inputRef}
                />
                {editingMessage ? (
                  <div className="edit-actions">
                    <button className="cancel-edit" onClick={cancelEditing}><X size={18} /></button>
                    <button className="confirm-edit" onClick={sendMessage}><Check size={18} /></button>
                  </div>
                ) : (
                  <button className="send-btn" onClick={sendMessage}><Send size={20} /></button>
                )}
              </div>
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