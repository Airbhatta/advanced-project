import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const navigate = useNavigate();

  const login = (userData) => {
    if (!userData) {
      console.error("User data is undefined");
      return;
    }
    setIsLoggedIn(true);
    setUser(userData); // Set user data on login
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // Clear user data on logout
    navigate("/"); // Redirect to home page
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);