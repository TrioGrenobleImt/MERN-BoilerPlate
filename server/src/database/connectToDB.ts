import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using the URI specified in environment variables.
 * @returns A promise that resolves when the connection is established.
 */
export const connectToDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONG_URI;

  if (!mongoUri) {
    console.error("Please specify the MongoDB URI in the .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to the database 🧰");
  } catch (err: any) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};
