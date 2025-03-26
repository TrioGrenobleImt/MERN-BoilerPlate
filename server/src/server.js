import app from "./app.js";
import { connectToDatabase } from "./database/connectToDB.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Connect to DB
connectToDatabase();

// Crée un serveur HTTP avec Express
const httpServer = createServer(app);

// Initialise Socket.io sur ce serveur
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT, "🚀");
});
