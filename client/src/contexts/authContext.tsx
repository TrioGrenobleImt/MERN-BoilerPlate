import { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { axiosConfig } from "../config/axiosConfig";
import { UserInterface } from "@/interfaces/User";

const AuthContext = createContext<{
  authUser: UserInterface;
  setAuthUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}>({
  authUser: {} as UserInterface,
  setAuthUser: () => {},
  loading: true,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<UserInterface>({} as UserInterface);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuthUser = async () => {
      setLoading(true);
      try {
        const userResponse = await axiosConfig.get("/auth/me");
        const userData = userResponse.data;
        setAuthUser(userData);
      } catch (error) {
        setAuthUser({} as UserInterface);
      } finally {
        setLoading(false);
      }
    };

    getAuthUser();
  }, []);
  return <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>{children}</AuthContext.Provider>;
};
