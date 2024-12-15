import app from "./app.js";
import { connectToDatabase } from "./database/connectToDB.js";

connectToDatabase();

export const server = app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT, "🚀");
});
