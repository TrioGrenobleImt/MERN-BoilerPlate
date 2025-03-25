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
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  //Send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //used to listen to the events,can be used both on the server and client side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT, "🚀");
});
