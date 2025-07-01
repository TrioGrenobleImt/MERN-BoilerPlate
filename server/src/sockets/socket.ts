import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import { corsOptions } from "../configuration/corsOptions.js";

let io: SocketIOServer | undefined;

const userSocketMap: Record<string, string> = {};

/**
 * Initializes the Socket.IO server, manages user connections, and tracks online users.
 * @param httpServer - The HTTP server to integrate with Socket.IO.
 * @returns The initialized Socket.IO server instance.
 */
export function initSockets(httpServer: http.Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: corsOptions,
  });

  io.on("connection", (socket: Socket) => {
    // userId passed as query string (string | undefined)
    const userId = socket.handshake.query.userId;

    if (typeof userId === "string") {
      userSocketMap[userId] = socket.id;
      io?.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast updated online users
    }

    socket.on("disconnect", () => {
      if (typeof userId === "string") {
        delete userSocketMap[userId];
        io?.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
}
