import app from "./app.js";
import { connectToDatabase } from "./database/connectToDB.js";

// Connects to the database
connectToDatabase();

/**
 * @function startServer
 * @description Starts the Express server and listens on the specified port from the environment variables.
 * It also connects to the database before starting the server.
 */
export const server = app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT, "🚀");
});
