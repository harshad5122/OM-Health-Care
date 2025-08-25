import { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem("authData");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    setAuth(data);
    localStorage.setItem("authData", JSON.stringify(data)); 
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth data easily
export const useAuth = () => useContext(AuthContext);
