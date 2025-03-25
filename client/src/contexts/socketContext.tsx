import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuthContext } from "./authContext";
import { io, Socket } from "socket.io-client";

// Typage de l'utilisateur connecté
type AuthUser = {
  _id: string;
};

// Typage du contexte socket
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: AuthUser[];
}

// Contexte avec valeur initiale
const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Props du provider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContextProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<AuthUser[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io("http://localhost:3000", {
        query: {
          userId: authUser.id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: AuthUser[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
