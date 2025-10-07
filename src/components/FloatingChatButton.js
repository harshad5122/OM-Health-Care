// src/components/FloatingChatButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FloatingChatButton = () => {
    const { token } = useAuth();
  const navigate = useNavigate();


  const handleChatClick = () => {
    console.log(" Token:", token); 
    if (!token) {
      // if not logged in, go to login
      navigate("/auth/login");
    } else {
      // if logged in, go to chat
      navigate("/chat");
    }
  };

  return (
    <button 
      // className="floating-chat-btn" 
       className="fixed bottom-[30%] right-0 bg-[var(--secondary-color)] text-white rounded-tl-[10px] rounded-tr-[10px] rounded-bl-0 rounded-br-0 px-5 py-3 text-base font-medium shadow-lg z-[1000] cursor-pointer transition-all duration-300 ease-in-out transform translate-y-1/2 -rotate-90 origin-bottom-right"
      onClick={handleChatClick}
    >
     Talk to Us
    </button>
  );
};

export default FloatingChatButton;
