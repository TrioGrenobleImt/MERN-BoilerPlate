import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  isOnline: boolean;
}

const socketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = (): SocketContextType => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (authUser?._id) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        query: { userId: authUser._id },
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
        setIsOnline(users.includes(authUser._id));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [authUser?._id]);

  return <socketContext.Provider value={{ socket, onlineUsers, isOnline }}>{children}</socketContext.Provider>;
};
