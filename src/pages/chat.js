import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  Megaphone,
  Info
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
  // const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBroadcastMenu, setShowBroadcastMenu] = useState(false);
  const [allMessages, setAllMessages] = useState({}); // Stores all messages, keyed by chatId
  const [chatUsers, setChatUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  // --- NEW state for Broadcast functionality ---
  const [sidebarView, setSidebarView] = useState("list");
  const [broadcastRecipients, setBroadcastRecipients] = useState([]);
  const [editingBroadcast, setEditingBroadcast] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [allPotentialRecipients, setAllPotentialRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [recipientSearch, setRecipientSearch] = useState("");

  const [recipientTab, setRecipientTab] = useState('doctor'); // 'all', 'doctor', or 'patient'

  const fileInputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const broadcastMenuRef = useRef(null);
  const messageMenuRef = useRef(null);
  const msgRefs = useRef({});
  const socketRef = useRef(null); 

  const { getChatUsers, getUserList, getStaffList } = useUserApi();
  const { getMessageList, getBroadcastList, getBroadcastRecipients } = useMessageApi();
  const { uploadFile } = useUploadFile();



  // --- Derived State ---
  const currentMessages = useMemo(() => {
    return allMessages[selectedChat?._id] || [];
  }, [allMessages, selectedChat]);

  // --- Update Chat List Helper ---
  const updateChatListWithNewMessage = useCallback((message) => {
    const isBroadcast = !!message.broadcast_id;
    if (isBroadcast) {
      setBroadcasts(prev => {
        const list = prev.map(b =>
          b._id === message.broadcast_id
            ? { ...b, lastMessage: message.message || "Attachment", createdAt: message.created_at }
            : b
        );
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      });
    } else {
      const chatPartnerId = message.sender_id === user._id ? message.receiver_id : message.sender_id;
      setChatUsers(prev => {
        const list = prev.map(u => {
          if (u._id === chatPartnerId) {
            return {
              ...u,
              messagePreview: message.message || "Attachment",
              last_message: { created_at: message.created_at },
              unreadCount: (selectedChat?._id === chatPartnerId) ? 0 : (u.unreadCount || 0) + 1
            };
          }
          return u;
        });
        return list.sort((a, b) => new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0));
      });
    }
  }, [user?._id, selectedChat?._id]);

  // --- SINGLE SOCKET CONNECTION - FIXED: Only one socket connection and all listeners ---
  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket(user._id);
    socketRef.current = socket;

    // Emit that the current user is online
    socket.emit("user_online", user._id);

    // --- Socket Event Handlers ---
    const handlePresenceUpdate = ({ userId, isOnline }) => {
      setOnlineUsers((prev) => new Map(prev).set(userId, isOnline));
      setChatUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, is_online: isOnline } : u))
      );
    };

    const handleIncomingMessage = (message) => {
      console.log("📨 Received message:", message); // Debug log

      const chatId = message.broadcast_id ||
        (message.sender_id === user._id ? message.receiver_id : message.sender_id);

      // Update all messages state
      setAllMessages(prev => {
        const chatMessages = prev[chatId] || [];
        // Avoid adding duplicate messages
        if (chatMessages.some(m => m._id === message._id)) return prev;

        const updatedMessages = [...chatMessages, message];
        return { ...prev, [chatId]: updatedMessages };
      });

      // If this is the active chat, mark as seen
      if (selectedChat?._id === chatId && message.sender_id !== user._id) {
        socket.emit("message_seen", { messageId: message._id, user_id: user._id });
      }

      // Update chat list
      updateChatListWithNewMessage(message);
    };

    const handleMessageUpdated = (updatedMsg) => {
      console.log("✏️ Message updated:", updatedMsg);
      const chatId = updatedMsg.broadcast_id ||
        (updatedMsg.sender_id === user._id ? updatedMsg.receiver_id : updatedMsg.sender_id);

      setAllMessages(prev => {
        const chatMessages = (prev[chatId] || []).map(msg =>
          msg._id === updatedMsg._id ? updatedMsg : msg
        );
        return { ...prev, [chatId]: chatMessages };
      });
    };

    const handleMessageDeleted = (deletedMsg) => {
      console.log("🗑️ Message deleted:", deletedMsg);
      const chatId = selectedChat?._id; // Use current chat since we know it's active

      if (chatId) {
        setAllMessages(prev => {
          const chatMessages = (prev[chatId] || []).map(msg =>
            msg._id === deletedMsg.messageId
              ? { ...msg, is_deleted: true, message: "This message was deleted" }
              : msg
          );
          return { ...prev, [chatId]: chatMessages };
        });
      }
    };

    const handleMessageStatusUpdate = ({ messageId, status, is_read }) => {
      console.log("📊 Message status updated:", { messageId, status, is_read });

      // Only update for sender's messages
      setAllMessages(prev => {
        let updated = { ...prev };
        for (const chatId in updated) {
          updated[chatId] = updated[chatId].map(msg => {
            if (msg._id === messageId && msg.sender_id === user._id) {
              return { ...msg, message_status: status, is_read };
            }
            return msg;
          });
        }
        return updated;
      });
    };

    const handleBroadcastCreated = (data) => {
      console.log("📢 Broadcast created:", data);
      if (!data || !data.broadcast) {
        console.error("Invalid broadcast_created event:", data);
        return;
      }

      const newBroadcast = {
        ...data.broadcast,
        _id: data.broadcast._id,
        id: data.broadcast._id,
        isBroadcast: true
      };
      setBroadcasts(prev => [newBroadcast, ...prev]);
      setSidebarView("list");
      setSelectedChat(newBroadcast);
    };

    const handleBroadcastUpdated = (data) => {
      console.log("📢 Broadcast updated:", data);
      if (!data || !data.broadcast) return;

      const updated = data.broadcast;
      setBroadcasts(prev => prev.map(b =>
        b._id === updated._id ? { ...b, ...updated } : b
      ));

      if (selectedChat?._id === updated._id) {
        setSelectedChat(prev => ({ ...prev, ...updated }));
      }
    };

    const handleBroadcastAck = (data) => {
      console.log("📢 Broadcast acknowledged:", data);
      // Handle broadcast send confirmation if needed
    };

    // --- Register all listeners ---
    socket.on("presence_update", handlePresenceUpdate);
    socket.on("chat_message", handleIncomingMessage);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_seen", handleMessageStatusUpdate);
    socket.on("message_delivered", handleMessageStatusUpdate);
    socket.on("broadcast_created", handleBroadcastCreated);
    socket.on("broadcast_updated", handleBroadcastUpdated);
    socket.on("broadcast_ack", handleBroadcastAck);

    // Cleanup function
    return () => {
      socket.emit("user_left_message_page", user._id);
      // Unregister all listeners
      socket.off("presence_update");
      socket.off("chat_message");
      socket.off("message_updated");
      socket.off("message_deleted");
      socket.off("message_seen");
      socket.off("message_delivered");
      socket.off("broadcast_created");
      socket.off("broadcast_updated");
      socket.off("broadcast_ack");
      socketRef.current = null; 
    };
  }, [user?._id, selectedChat?._id, updateChatListWithNewMessage]);


  // --- Fetch Initial Data (Users & Broadcasts) ---
  useEffect(() => {
    if (!token || !user) return;

    const fetchInitialData = async () => {
      try {
        // Fetch users
        const usersFromServer = await getChatUsers(token);
        const processedUsers = usersFromServer.map(u => ({
          ...u,
          _id: u.user_id,
          unreadCount: u.unreadCount || 0,
          is_online: false,
        }));
        const sortedUsers = processedUsers.sort((a, b) =>
          new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0)
        );
        setChatUsers(sortedUsers || []);

        // Auto-select first user if none selected
        if (!selectedChat && sortedUsers.length > 0) {
          setSelectedChat({ ...sortedUsers[0], isBroadcast: false });
        }

        // Fetch broadcasts for admin
        // if (user.role === 2) {
        //   const broadcastList = await getBroadcastList(token);
        //   setBroadcasts(broadcastList.map(b => ({ ...b, isBroadcast: true })) || []);
        // }


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
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();

    const socket = getSocket();
    const handleBroadcastCreated = (data) => {

      if (!data || !data.broadcast) {
        console.error("Received invalid 'broadcast_created' event from server:", data);
        return; // Exit the function to prevent the crash.
      }

      // const newBroadcast = newBroadcastData.broadcast;
      const newBroadcast = data.broadcast;

      const formattedBroadcast = {
        id: newBroadcast._id,
        _id: newBroadcast._id,
        title: newBroadcast.title,
        createdAt: newBroadcast.createdAt,
        recipients: newBroadcast.recipients,
        lastMessage: "Broadcast created",
        isBroadcast: true
      };

      setBroadcasts(prev => [formattedBroadcast, ...prev]);
      setSidebarView("list"); // Switch back to the list view
      setSelectedChat(formattedBroadcast); // Automatically select the new broadcast
    };
    socket.on("broadcast_created", handleBroadcastCreated);

    return () => {
      socket.off("broadcast_created", handleBroadcastCreated);
    };
  }, [token, user]);

  // --- Scroll to Bottom ---
  useEffect(() => {
    if (chatBoxRef.current && currentMessages.length > 0) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [currentMessages]);








  // --- Main Socket Connection and Global Listeners ---
  // useEffect(() => {
  //   if (!user?._id) return;

  //   const socket = initSocket(user._id);

  //   // Emit that the current user is online
  //   socket.emit("user_online", user._id);

  //   const handlePresenceUpdate = ({ userId, isOnline }) => {
  //     setOnlineUsers((prev) => new Map(prev).set(userId, isOnline));
  //     setChatUsers((prev) =>
  //       prev.map((u) => (u._id === userId ? { ...u, is_online: isOnline } : u))
  //     );
  //   };

  //   const handleMessageDelivered = ({ _id, status }) => {
  //     setMessages((prev) =>
  //       prev.map((msg) => (msg._id === _id ? { ...msg, message_status: status } : msg))
  //     );
  //   };

  //   const handleMessageSeenByReceiver = ({ messageId, message_status }) => {
  //     setMessages((prev) =>
  //       prev.map((msg) => (msg._id === messageId ? { ...msg, message_status } : msg))
  //     );
  //   };

  //   socket.on("presence_update", handlePresenceUpdate);
  //   socket.on("message_delivered", handleMessageDelivered);
  //   socket.on("message_seen", handleMessageSeenByReceiver);

  //   return () => {
  //     socket.emit("user_left_message_page", user._id);
  //     socket.off("presence_update", handlePresenceUpdate);
  //     socket.off("message_delivered", handleMessageDelivered);
  //     socket.off("message_seen", handleMessageSeenByReceiver);
  //   };
  // }, [user?._id]);




  // --- Fetch Initial User List ---
  // useEffect(() => {
  //   if ( !token || !user) return;

  //   const fetchUsers = async () => {
  //     try {
  //       const usersFromServer = await getChatUsers(token);

  //       const processedUsers = usersFromServer.map(u => ({
  //         ...u,
  //         _id: u.user_id, // Standardize the ID property
  //         unreadCount: u.unreadCount || 0,
  //         is_online: false,

  //       }));

  //        // <<< CHANGE #1: Sort the list right after fetching
  //     const sortedUsers = processedUsers.sort((a, b) => 
  //       new Date(b.last_message?.created_at || 0) - new Date(a.last_message?.created_at || 0)
  //     );

  //       setChatUsers(sortedUsers || []);

  //       if (!selectedChat && sortedUsers.length > 0) {
  //         // setSelectedUser(sortedUsers[0]);
  //          setSelectedChat({ ...sortedUsers[0], isBroadcast: false });
  //       }
  //     } catch (err) {
  //       console.error("Error fetching chat users:", err);
  //     }
  //   };

  //   fetchUsers();

  //   if (user.role === 2) {
  //     const fetchBroadcasts = async () => {
  //       try {
  //         const broadcastList = await getBroadcastList(token);
  //         setBroadcasts(broadcastList || []);
  //       } catch (err) {
  //         console.error("Error fetching broadcasts:", err);
  //       }
  //     };
  //     fetchBroadcasts();
  //   }
  //   const socket = getSocket();
  //   const handleBroadcastCreated = (data) => {

  //      if (!data || !data.broadcast) {
  //           console.error("Received invalid 'broadcast_created' event from server:", data);
  //           return; // Exit the function to prevent the crash.
  //       }

  //     // const newBroadcast = newBroadcastData.broadcast;
  //     const newBroadcast = data.broadcast;

  //        const formattedBroadcast = {
  //           id: newBroadcast._id,
  //           _id: newBroadcast._id,
  //           title: newBroadcast.title,
  //           createdAt: newBroadcast.createdAt,
  //           recipients: newBroadcast.recipients,
  //           lastMessage: "Broadcast created",
  //           isBroadcast: true
  //       };

  //     setBroadcasts(prev => [formattedBroadcast, ...prev]);
  //     setSidebarView("list"); // Switch back to the list view
  //     setSelectedChat(formattedBroadcast); // Automatically select the new broadcast
  //   };
  //   socket.on("broadcast_created", handleBroadcastCreated);

  //   return () => {
  //     socket.off("broadcast_created", handleBroadcastCreated);
  //   };
  // }, [token, user]);




  // --- Fetch Messages and Handle Chat-Specific Logic when a User is Selected ---
    useEffect(() => {
      if ( !token || !selectedChat?._id) {
        setMessages([]);
        return;
      }

      // const socket = getSocket();

      const fetchMessages = async () => {
        try {
           const payload = {
              id: selectedChat._id,
              type: selectedChat.isBroadcast ? 'broadcast' : 'user'
          };
          const oldMsgs = await getMessageList(payload, token);
          setMessages(oldMsgs?.reverse() || []);
          // Once messages are loaded, mark them as seen
          if (!selectedChat.isBroadcast) {
              markMessagesAsSeen(oldMsgs);
              // Reset unread count for the selected user chat
              setChatUsers((prev) =>
                prev.map((u) => (u._id === selectedChat._id ? { ...u, unreadCount: 0 } : u))
              );
          }
          // markMessagesAsSeen(oldMsgs);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessages([]);
        }
      };
      fetchMessages();
   const socket = getSocket();
      // Reset unread count for the selected user
      setChatUsers((prev) =>
        prev.map((u) => (u._id === selectedChat._id ? { ...u, unreadCount: 0 } : u))
      );

      const handleIncomingMessage = (msg) => {
          // Only process if it's part of the active chat
        if (
          (msg.sender_id === selectedChat._id && msg.receiver_id === user._id) ||
          (msg.sender_id === user._id && msg.receiver_id === selectedChat._id)
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
      }, [selectedChat, token]); 
  // }, [selectedChat?._id, user?._id, token]);



  // --- Add a listener for when a broadcast is updated ---
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleBroadcastUpdated = (updatedData) => {
      if (!updatedData || !updatedData.broadcast) return;
      const updatedBroadcast = updatedData.broadcast;

      // Update the list of broadcasts
      setBroadcasts(prev => prev.map(bc =>
        bc.id === updatedBroadcast._id
          ? { ...bc, title: updatedBroadcast.title, recipients: updatedBroadcast.recipients }
          : bc
      ));

      // If the updated broadcast is the currently selected one, update it
      if (selectedChat && selectedChat.id === updatedBroadcast._id) {
        setSelectedChat(prev => ({
          ...prev,
          title: updatedBroadcast.title,
          recipients: updatedBroadcast.recipients
        }));
      }
    };

    socket.on("broadcast_updated", handleBroadcastUpdated);

    return () => {
      socket.off("broadcast_updated", handleBroadcastUpdated);
    };
  }, [selectedChat]);


  const showBroadcastInfo = async (broadcast) => {
    setSidebarView('broadcast-info');
    const recipients = await getBroadcastRecipients(broadcast.id, token);
    setBroadcastRecipients(recipients);
  };

  // ✅ --- REFACTORED: This function now handles opening the screen for both "new" and "edit" modes ---
  const openBroadcastEditScreen = async (broadcastToEdit = null) => {
    // Determine if we are editing or creating
    const isEditing = broadcastToEdit !== null;
    setSidebarView(isEditing ? 'edit-broadcast' : 'new-broadcast');
    setEditingBroadcast(broadcastToEdit); // Store the broadcast if we are editing

    try {
      // Fetch all potential recipients
      const doctors = await getStaffList(token);
      const usersResponse = await getUserList({ skip: null, limit: null, search: "" });
      const doctorList = doctors || [];
      const userList = usersResponse || [];

      const normalizedDoctors = doctorList.map(doc => ({ _id: doc._id, name: `${doc.firstname} ${doc.lastname}`, type: 'doctor' }));
      const normalizedUsers = userList.map(usr => ({ _id: usr._id, name: `${usr.firstname} ${usr.lastname}`, type: 'patient' }));

      const allRecipientsMap = new Map();
      [...normalizedDoctors, ...normalizedUsers].forEach(p => {
        if (p._id && p.name && p._id !== user._id) {
          allRecipientsMap.set(p._id, p);
        }
      });
      const finalRecipients = Array.from(allRecipientsMap.values());
      setAllPotentialRecipients(finalRecipients);

      // Pre-populate fields if we are in "edit" mode
      if (isEditing) {
        setBroadcastTitle(broadcastToEdit.title);
        // Pre-select recipients
        const currentRecipientIds = new Set(broadcastToEdit.recipients);
        const selected = finalRecipients.filter(p => currentRecipientIds.has(p._id));
        const available = finalRecipients.filter(p => !currentRecipientIds.has(p._id));
        setSelectedRecipients(selected);
        setAvailableRecipients(available);
      } else {
        // Reset fields for "new" mode
        setBroadcastTitle("");
        setSelectedRecipients([]);
        setAvailableRecipients(finalRecipients);
      }

    } catch (err) {
      console.error("Failed to fetch recipients for broadcast", err);
    }
  };

  // ✅ --- REFACTORED: This function now handles both creating and editing a broadcast ---
  const handleSaveBroadcast = () => {
    const isEditing = sidebarView === 'edit-broadcast';

    if (!broadcastTitle.trim() || selectedRecipients.length === 0) {
      alert("Please provide a title and select at least one recipient.");
      return;
    }

    const socket = getSocket();
    const recipientIds = selectedRecipients.map(r => r._id);

    if (isEditing) {
      // Emit the "edit" event
      socket.emit("edit_broadcast", {
        admin_id: user._id,
        broadcast_id: editingBroadcast.id,
        title: broadcastTitle,
        recipients: recipientIds,
      });
    } else {
      // Emit the "create" event
      socket.emit("create_broadcast", {
        admin_id: user._id,
        title: broadcastTitle,
        recipients: recipientIds,
      });
    }

    // Reset state and switch view
    setBroadcastTitle("");
    setSelectedRecipients([]);
    setEditingBroadcast(null);
    setSidebarView("list");
  };

  // --- Mark Messages as Seen Helper ---
  const markMessagesAsSeen = useCallback((msgs) => {
    const socket = getSocket();
    if (!socket) return;
    
    msgs.forEach(msg => {
      if (msg.sender_id !== user._id && msg.message_status !== 'seen') {
        socket.emit("message_seen", { messageId: msg._id, user_id: user._id });
      }
    });
  }, [user._id]);

  // --- Mark Messages as Seen ---
  // const markMessagesAsSeen = (msgs) => {
  //   // if (!user || !msgs) return;
  //   const socket = getSocket();
  //    if (!socket) return;
  //   msgs.forEach(msg => {
  //     if (msg.sender_id !== user._id && msg.message_status !== 'seen') {
  //       socket.emit("message_seen", { messageId: msg._id, user_id: user._id });
  //     }
  //   });
  // };

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
            unreadCount: u._id === selectedChat?._id ? 0 : (u.unreadCount || 0) + 1,
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
      const usersResponse = await getUserList({ skip: null, limit: null, search: "" });
      // const users = usersResponse || []; 
      const doctorList = doctors || [];
      const userList = usersResponse || [];


      // Normalize both lists to ensure they have `_id` and `name`
      const normalizedDoctors = doctorList.map(doc => ({
        _id: doc._id, // Staff list seems to use user_id
        // name: doc.name,
        name: `${doc.firstname} ${doc.lastname}`,
        type: 'doctor'
      }));

      const normalizedUsers = userList.map(usr => ({
        _id: usr._id, // User list uses _id
        name: `${usr.firstname} ${usr.lastname}`,
        type: 'patient'
      }));

      // Remove duplicates and the current admin from the list
      const allRecipientsMap = new Map();
      [...normalizedDoctors, ...normalizedUsers].forEach(p => {
        if (p._id && p.name && p._id !== user._id) {
          allRecipientsMap.set(p._id, p);
        }
        // if (p._id !== user._id) { // Don't add yourself to the recipient list
        //    allRecipientsMap.set(p._id, p);
        // }
      });

      const finalRecipients = Array.from(allRecipientsMap.values());
      setAllPotentialRecipients(finalRecipients);
      setAvailableRecipients(finalRecipients);
      setRecipientTab('doctor');
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


  //   const sendMessage = async () => {
  //     if (!input.trim() || !selectedChat) return;
  //     const socket = getSocket();
  //      if (!socket?.connected) return;

  //     const isBroadcast = selectedChat.recipients; // Check if it's a broadcast object

  //     if (!socket?.connected) return;
  //  if (isBroadcast) {
  //       socket.emit("broadcast_message", {
  //         sender_id: user._id,
  //         broadcast_id: selectedChat.id,
  //         message: input,
  //       });
  //     } else {
  //     if (editingMessage) {
  //       socket.emit("update_message", { messageId: editingMessage._id, message: input });
  //       setEditingMessage(null);
  //     } else {
  //       const tempId = `temp-${Date.now()}`;
  //       const msgData = {
  //         _id: tempId,
  //         sender_id: user._id,
  //         receiver_id: selectedUser._id,
  //         message: input,
  //         message_type: "text",
  //         created_at: new Date().toISOString(),
  //         message_status: "sent",
  //         ...(replyingTo && { reply_to: replyingTo._id }), // Add reply_to field
  //       };
  //       setMessages((prev) => [...prev, msgData]);
  //       socket.emit("chat_message", { ...msgData, _id: undefined }); // Don't send temp ID to backend
  //     }

  //   }
  //     setInput("");
  //     setReplyingTo(null); // Clear reply state after sending
  //   };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    // const socket = getSocket();
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    const currentTime = new Date().toISOString();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    if (editingMessage) {
      // Handle editing
      socket.emit("update_message", {
        messageId: editingMessage._id,
        message: input,
      });

      // Optimistic update
      const chatId = editingMessage.broadcast_id || 
        (editingMessage.sender_id === user._id ? editingMessage.receiver_id : editingMessage.sender_id);
      
      setAllMessages(prev => {
        const chatMessages = (prev[chatId] || []).map(msg => 
          msg._id === editingMessage._id 
            ? { ...msg, message: input, edited: true } 
            : msg
        );
        return { ...prev, [chatId]: chatMessages };
      });

      setEditingMessage(null);
      setInput("");

    } else if (selectedChat.isBroadcast) {
      // Handle broadcast message
      const msgData = {
        sender_id: user._id,
        broadcast_id: selectedChat._id,
        message: input,
        message_type: "text",
        attachments: [],
      };

      // Optimistic update for sender
      const optimisticMessage = {
        ...msgData,
        _id: tempId,
        created_at: currentTime,
        message_status: 'sent',
        attechment_details: [],
        sender_id: user._id,
      };

      setAllMessages(prev => {
        const chatMessages = prev[selectedChat._id] || [];
        return { ...prev, [selectedChat._id]: [...chatMessages, optimisticMessage] };
      });

      socket.emit("broadcast_message", msgData);

    } else {
      // Handle one-to-one message
      const msgData = {
        sender_id: user._id,
        receiver_id: selectedChat._id,
        message: input,
        message_type: "text",
        ...(replyingTo && { reply_to: replyingTo._id }),
      };

      // Optimistic update for sender
      const optimisticMessage = {
        ...msgData,
        _id: tempId,
        created_at: currentTime,
        message_status: 'sent',
        attechment_details: [],
        sender_id: user._id,
      };

      setAllMessages(prev => {
        const chatMessages = prev[selectedChat._id] || [];
        return { ...prev, [selectedChat._id]: [...chatMessages, optimisticMessage] };
      });

      socket.emit("chat_message", msgData);
    }

    setInput("");
    setReplyingTo(null);
    inputRef.current?.focus();
  };


  // const sendMessage = async () => {
  //   if (!input.trim() || !selectedChat) return;
  //   const socket = getSocket();
  //   if (!socket?.connected) return;

  //   if (selectedChat.isBroadcast) {
  //     socket.emit("chat_message", {
  //       sender_id: user._id,
  //       broadcast_id: selectedChat._id,
  //       message: input,
  //     });
  //   } else { // It's a one-on-one chat
  //     if (editingMessage) {
  //       socket.emit("update_message", { messageId: editingMessage._id, message: input });
  //       setEditingMessage(null);
  //     } else {
  //       const tempId = `temp-${Date.now()}`;
  //       const msgData = {
  //         _id: tempId,
  //         sender_id: user._id,
  //         receiver_id: selectedChat._id, // Use selectedChat._id
  //         message: input,
  //         message_type: "text",
  //         created_at: new Date().toISOString(),
  //         message_status: "sent",
  //         ...(replyingTo && { reply_to: replyingTo._id }),
  //       };
  //       setMessages((prev) => [...prev, msgData]);
  //       socket.emit("chat_message", { ...msgData, _id: undefined });
  //     }
  //   }
  //   setInput("");
  //   setReplyingTo(null);
  // };


  // --- File Upload Logic ---
  
  
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !selectedChat) return;

  //   try {
  //     const uploadedFileDetails = await uploadFile(file, token);

  //     const socket = getSocket();
  //     if (!socket || !socket.connected) {
  //       console.error("Socket not connected for file upload");
  //       return;
  //     }

  //     const msgData = {
  //       sender_id: user._id,
  //       receiver_id: selectedChat._id,
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
  //         attechment_details: [{ ...uploadedFileDetails, url: URL.createObjectURL(file) }],
  //         message_status: 'sent'
  //       }
  //     ]);

  //   } catch (err) {
  //     console.error("File upload and message sending failed:", err);
  //   } finally {
  //     if (fileInputRef.current) fileInputRef.current.value = null;
  //     setReplyingTo(null);
  //   }
  // };


   const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    try {
      const uploadedFileDetails = await uploadFile(file, token);
      const currentTime = new Date().toISOString();
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      // const socket = getSocket();
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        console.error("Socket not connected for file upload");
        return;
      }

      const msgData = {
        sender_id: user._id,
        receiver_id: selectedChat._id,
        message_type: uploadedFileDetails.fileType,
        attechment_id: [uploadedFileDetails._id],
        message: file.name,
        ...(replyingTo && { reply_to: replyingTo._id }),
      };

      // Optimistic update with local file URL
      const optimisticMessage = {
        ...msgData,
        _id: tempId,
        created_at: currentTime,
        message_status: 'sent',
        attechment_details: [{
          ...uploadedFileDetails,
          url: URL.createObjectURL(file),
          local: true
        }],
        sender_id: user._id,
      };

      setAllMessages(prev => {
        const chatMessages = prev[selectedChat._id] || [];
        return { ...prev, [selectedChat._id]: [...chatMessages, optimisticMessage] };
      });

      socket.emit("chat_message", msgData);

    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = null;
      setReplyingTo(null);
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !selectedChat) return; // Use selectedChat
  //   // Broadcasting files is not implemented in your socket, so we restrict it to 1-on-1
  //   if (selectedChat.isBroadcast) {
  //       alert("File uploads are not supported in broadcasts yet.");
  //       return;
  //   }
  //   try {
  //     const uploadedFileDetails = await uploadFile(file, token);
  //     const socket = getSocket();
  //     const msgData = {
  //       sender_id: user._id,
  //       receiver_id: selectedChat._id, // Use selectedChat._id
  //       message_type: uploadedFileDetails.fileType,
  //       attechment_id: [uploadedFileDetails._id],
  //       message: file.name,
  //       created_at: new Date().toISOString(),
  //       ...(replyingTo && { reply_to: replyingTo._id }),
  //     };
  //     socket.emit("chat_message", msgData);
  //   } catch (err) {
  //     console.error("File upload failed:", err);
  //   } finally {
  //     if (fileInputRef.current) fileInputRef.current.value = null;
  //     setReplyingTo(null);
  //   }
  // };







  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !selectedUser) return;
  //   try {
  //     const uploadedFileDetails = await uploadFile(file, token);
  //     const socket = getSocket();
  //     const msgData = {
  //       sender_id: user._id,
  //       receiver_id: selectedUser._id,
  //       message_type: uploadedFileDetails.fileType,
  //       attechment_id: [uploadedFileDetails._id],
  //       message: file.name,
  //       created_at: new Date().toISOString(),
  //       ...(replyingTo && { reply_to: replyingTo._id }), // Add reply_to field
  //     };
  //     socket.emit("chat_message", msgData);
  //   } catch (err) {
  //     console.error("File upload failed:", err);
  //   } finally {
  //     if (fileInputRef.current) fileInputRef.current.value = null;
  //     setReplyingTo(null); // Clear reply state after sending
  //   }
  // };

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

  // --- NEW: Renders the "Broadcast Info" screen ---
  const renderBroadcastInfoView = () => {
    if (!selectedChat) return null;
    return (
      <div className="broadcast-info-container">
        <div className="broadcast-info-header">
          <button onClick={() => setSidebarView('list')}><ArrowLeft size={20} /></button>
          <h3>Broadcast Info</h3>
          {/* Show Edit button only if the current user is the creator */}
          {(
            <button className="edit-button" onClick={() => openBroadcastEditScreen(selectedChat)}>
              <Edit size={20} />
            </button>
          )}
        </div>
        <div className="broadcast-info-body">
          <h4>{selectedChat.title}</h4>
          <p className="recipient-count">{broadcastRecipients.length} Recipients</p>
          <div className="recipients-list">
            {broadcastRecipients.map(r => (
              <div key={r.id} className="recipient-item">
                {r.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- MODIFIED: Renders the "Create/Edit Broadcast" screen ---
  const renderBroadcastEditView = () => {
    const isEditing = sidebarView === 'edit-broadcast';
    const filteredBySearch = recipientSearch
      ? availableRecipients.filter(r => r.name.toLowerCase().includes(recipientSearch.toLowerCase()))
      : availableRecipients;

    const filteredAvailable = filteredBySearch.filter(
      r => r.type === recipientTab
      //     r => {
      //     if (recipientTab === 'all') return true;
      //     if (recipientTab === 'doctor') return r.type === 'doctor';
      //     if (recipientTab === 'patient') return r.type === 'patient';
      //     return true;
      // }
    );

    return (
      <div className="new-broadcast-container">
        <div className="new-broadcast-header">
          <button onClick={() => setSidebarView('list')}><ArrowLeft size={20} /></button>
          {/* Change title based on mode */}
          <h3>{isEditing ? 'Edit Broadcast' : 'Create Broadcast'}</h3>
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
        <div className="recipient-tabs">
          {/* <button className={recipientTab === 'all' ? 'active' : ''} onClick={() => setRecipientTab('all')}>All</button> */}
          <button className={recipientTab === 'doctor' ? 'active' : ''} onClick={() => setRecipientTab('doctor')}>Doctors</button>
          <button className={recipientTab === 'patient' ? 'active' : ''} onClick={() => setRecipientTab('patient')}>Patients</button>
        </div>
        <div className="available-recipients-list">
          {/* {filteredAvailable.map(r => (
            <div key={r._id} className="user-list-item" onClick={() => handleSelectRecipient(r)}>
              
              <div className="user-info"><h4>{r.name}</h4></div>
            </div>
          ))} */}
          {filteredAvailable.length > 0 ? (
            filteredAvailable.map(r => (
              <div key={r._id} className="user-list-item" onClick={() => handleSelectRecipient(r)}>
                <div className="user-info">
                  <h4>{r.name}</h4>
                  <p className="recipient-type">{r.type}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-users-message">No {recipientTab}s found.</p>
          )}
        </div>

        {/* Change button to call the new save function */}
        <button className="fab-create-broadcast" onClick={handleSaveBroadcast}>
          <Check size={24} />
        </button>
      </div>
    );
  };


  // NEW: Renders the "Create Broadcast" screen
  // const renderNewBroadcastView = () => {
  //   const filteredBySearch  = recipientSearch
  //     ? availableRecipients.filter(r => r.name.toLowerCase().includes(recipientSearch.toLowerCase()))
  //     : availableRecipients;

  //     const filteredAvailable = filteredBySearch.filter(
  //       r => r.type === recipientTab
  //   //     r => {
  //   //     if (recipientTab === 'all') return true;
  //   //     if (recipientTab === 'doctor') return r.type === 'doctor';
  //   //     if (recipientTab === 'patient') return r.type === 'patient';
  //   //     return true;
  //   // }
  // );

  //   return (
  //     <div className="new-broadcast-container">
  //       <div className="new-broadcast-header">
  //         <button onClick={() => setSidebarView('list')}><ArrowLeft size={20} /></button>
  //         <h3>Create Broadcast</h3>
  //       </div>
  //       <div className="broadcast-setup">
  //         <input 
  //           type="text" 
  //           placeholder="Broadcast list title..." 
  //           className="broadcast-title-input"
  //           value={broadcastTitle}
  //           onChange={(e) => setBroadcastTitle(e.target.value)}
  //         />
  //         <div className="recipient-selection">
  //           {selectedRecipients.length > 0 && (
  //             <div className="selected-recipients-container">
  //               {selectedRecipients.map(r => (
  //                 <div key={r._id} className="recipient-pill">
  //                   {r.name}
  //                   <button onClick={() => handleDeselectRecipient(r)}><X size={14} /></button>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //           <input 
  //             type="text" 
  //             placeholder="Search for doctors or users..." 
  //             className="recipient-search-input"
  //             value={recipientSearch}
  //             onChange={(e) => setRecipientSearch(e.target.value)}
  //           />
  //         </div>
  //       </div>
  //       <div className="recipient-tabs">
  //               {/* <button className={recipientTab === 'all' ? 'active' : ''} onClick={() => setRecipientTab('all')}>All</button> */}
  //               <button className={recipientTab === 'doctor' ? 'active' : ''} onClick={() => setRecipientTab('doctor')}>Doctors</button>
  //               <button className={recipientTab === 'patient' ? 'active' : ''} onClick={() => setRecipientTab('patient')}>Patients</button>
  //           </div>
  //       <div className="available-recipients-list">
  //         {/* {filteredAvailable.map(r => (
  //           <div key={r._id} className="user-list-item" onClick={() => handleSelectRecipient(r)}>

  //             <div className="user-info"><h4>{r.name}</h4></div>
  //           </div>
  //         ))} */}
  //         {filteredAvailable.length > 0 ? (
  //                   filteredAvailable.map(r => (
  //                       <div key={r._id} className="user-list-item" onClick={() => handleSelectRecipient(r)}>
  //                           <div className="user-info">
  //                               <h4>{r.name}</h4>
  //                               <p className="recipient-type">{r.type}</p> 
  //                           </div>
  //                       </div>
  //                   ))
  //               ) : (
  //                   <p className="no-users-message">No {recipientTab}s found.</p>
  //               )}
  //       </div>
  //       <button className="fab-create-broadcast" onClick={handleCreateBroadcast}>
  //         <Check size={24} />
  //       </button>
  //     </div>
  //   );
  // };

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
          {/* <h4>{bc.title}</h4>
          <p>{bc.lastMessage || `${bc.recipients.length} recipients`}</p> */}
          <h4 className="text-left font-semibold">{bc.title}</h4>
          <p className="text-left text-sm text-gray-500 truncate w-[160px]">
            {bc.lastMessage || `${bc.recipients.length} recipients`}
          </p>
        </div>
        <span className="text-[11px] text-gray-400">{formatChatListTime(bc.createdAt)}</span>
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
        onClick={() => setSelectedChat({ ...person, isBroadcast: false })}
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
      const originalSenderName = originalMsg ? (originalMsg.sender_id === user._id ? "You" : selectedChat.name) : "";


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
        {/* {sidebarView === 'new-broadcast' ? (
          renderNewBroadcastView()
        ) :  */}
        {sidebarView === 'list' &&
          (
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
        {(sidebarView === 'new-broadcast' || sidebarView === 'edit-broadcast') && renderBroadcastEditView()}
        {sidebarView === 'broadcast-info' && renderBroadcastInfoView()}
      </div>

      {/* --- Right Chat Area --- */}
      <div id="chat-main" className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              {selectedChat.isBroadcast ? (
                <div className="chat-user-info clickable" onClick={() => showBroadcastInfo(selectedChat)}>
                  <div className="user-avatar"><Megaphone /></div>
                  <div className="user-details">
                    <h3 className="m-0 text-[16px] font-semibold text-[#343a40]">{selectedChat.title}</h3>
                    <p>{selectedChat.recipients.length} recipients</p>
                  </div>
                  <Info size={18} className="info-icon" />
                </div>
              ) : (
                <div className="chat-user-info">
                  <div className="user-avatar">
                    {/* {getUserInitials(selectedUser)} */}
                    {selectedChat.isBroadcast ? <Megaphone /> : getUserInitials(selectedChat)}
                  </div>
                  <div className="user-details">
                    <h3 className="m-0 text-[16px] font-semibold text-[#343a40]">{selectedChat?.title || selectedChat.name}</h3>
                    {/* <p className="mt-[2px] mb-0 text-[12px] text-[#495057] opacity-80 text-left">
                    {onlineUsers.get(selectedUser._id) ? "Online" : "Offline"}
                  </p> */}
                    <p>{selectedChat.isBroadcast ? `${selectedChat?.recipients.length} recipients` : (onlineUsers.get(selectedChat?._id) ? "Online" : "Offline")}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-box" ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>
                    {selectedChat.isBroadcast
                      ? `This is the beginning of the "${selectedChat.title}" broadcast.`
                      : `Start a conversation with ${selectedChat.name}!`
                    }
                    {/* Start a conversation with {selectedUser.name}! */}
                  </p>
                </div>
              ) : (
                renderMessagesWithDateHeaders()
              )}
            </div>

            <div className="chat-input-area">
              {replyingTo && (
                <div className="reply-preview-bar">
                  <div className="reply-preview-content">
                    <p className="reply-preview-sender">Replying to {replyingTo.sender_id === user._id ? "yourself" : selectedChat.name}</p>
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
                   disabled={!socketRef.current || !socketRef.current.connected}
                />
                {editingMessage ? (
                  <div className="edit-actions">
                    <button className="cancel-edit" onClick={cancelEditing}><X size={18} /></button>
                    <button className="confirm-edit" onClick={sendMessage}><Check size={18} /></button>
                  </div>
                ) : (
                  <button className="send-btn" onClick={sendMessage}
                 disabled={!input.trim() || !socketRef.current || !socketRef.current.connected} 
                  ><Send size={20} /></button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            {/* <p>Select a conversation to start chatting.</p> */}
            <MessageSquare size={80} className="text-gray-300" />
            <h2>Select a conversation</h2>
            <p>Choose a user or broadcast from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;