import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null; // Singleton pour éviter plusieurs connexions

export const useSocket = (userId: string) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket && userId) {
      socket = io("http://localhost:3000", {
        query: { userId },
        withCredentials: true,
      });

      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socket.on("disconnect", () => {
        setOnlineUsers([]);
      });
    }

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId]);

  return { onlineUsers };
};
