import { app } from "./app.js";
import { connectToDatabase } from "./database/connectToDB.js";
import { createServer } from "http";
import { initSockets } from "./sockets/socket.js";

export function initServer() {
  // Connect to DB
  connectToDatabase();

  // Crée un serveur HTTP avec Express
  const httpServer = createServer(app);

  // Initialise les WebSockets
  initSockets(httpServer);

  if (!process.env.PORT) {
    console.error("Please specify the port number for the HTTP server with the environment variable PORT in the .env file.");
    process.exit(1);
  }

  httpServer.listen(process.env.PORT, () => {
    console.log("Server listening on port", process.env.PORT, "🚀");
  });
}

initServer();
