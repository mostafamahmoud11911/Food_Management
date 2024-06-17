import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = "https://upskilling-egypt.com:3006/api/v1";
const requestHeaders = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthContextProvider({ children }) {
  const [loginUser, setLoginUser] = useState(null);
  const getUserData = () => {
    const encoded = localStorage.getItem("token");
    const decoded = jwtDecode(encoded);
    setLoginUser(decoded);
  };

  useEffect(() => {
    if (localStorage.getItem("token") || loginUser) {
      getUserData();
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{ BASE_URL, requestHeaders, getUserData, loginUser, setLoginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
