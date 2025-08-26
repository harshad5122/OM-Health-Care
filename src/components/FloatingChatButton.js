// src/components/FloatingChatButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FloatingChatButton.css";
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
    <button className="floating-chat-btn" onClick={handleChatClick}>
     Talk to Us
    </button>
  );
};

export default FloatingChatButton;
