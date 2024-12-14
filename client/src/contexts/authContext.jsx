import { createContext, useContext, useEffect, useState } from "react";
import axiosConfig from "../config/axiosConfig";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const response = await axiosConfig.get("/auth/check");
        const isAuthenticated = response.data.authenticated;

        if (isAuthenticated) {
          const userResponse = await axiosConfig.get("/auth/me");
          const userData = userResponse.data;
          setAuthUser(userData);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        setAuthUser(null);
      }
    };
    getAuthUser();
  }, [setAuthUser]);

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
