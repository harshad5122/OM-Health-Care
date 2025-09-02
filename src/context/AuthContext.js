import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
   const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);




  const saveAuthData = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userData.role); 
    localStorage.setItem("user", JSON.stringify(userData));  
    setToken(newToken);
    setUser(userData);
  };



  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
