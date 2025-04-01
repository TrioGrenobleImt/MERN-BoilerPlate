import { Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../configuration/corsOptions.js";

let io;
const userSocketMap = {};

export function initSockets(httpServer) {
  io = new SocketIOServer(httpServer, {
    cors: corsOptions,
  });

  console.log("Socket server started 📡");

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
}

export { io };
