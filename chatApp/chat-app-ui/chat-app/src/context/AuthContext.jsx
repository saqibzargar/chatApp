import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("chat_user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("chat_token") || null
  );

  const login = (userData, tokenData) => {
    setCurrentUser(userData);
    setToken(tokenData);
    localStorage.setItem("chat_user", JSON.stringify(userData));
    localStorage.setItem("chat_token", tokenData);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("chat_user");
    localStorage.removeItem("chat_token");
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
