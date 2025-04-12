import { Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../configuration/corsOptions.js";

let io;
const userSocketMap = {};

/**
 * @function initSockets
 * @description Initializes the Socket.IO server, manages user connections, and handles the tracking of online users.
 * @param {http.Server} httpServer - The HTTP server to integrate with the Socket.IO server.
 * @returns {SocketIOServer} The initialized Socket.IO server instance.
 */
export function initSockets(httpServer) {
  io = new SocketIOServer(httpServer, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    // Map userId to socket.id if available
    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated list of online users
    }

    // Handle user disconnection
    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId]; // Remove user from the map
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated list of online users
      }
    });
  });

  return io; // Return the Socket.IO server instance
}
