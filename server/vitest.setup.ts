// vitest.setup.ts
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { afterAll, beforeAll } from "vitest";
import "dotenv/config";

// Utiliser un chemin absolu basé sur __dirname
const uploadsDir = path.resolve(__dirname, "uploads/users/avatars");

beforeAll(async () => {
  await mongoose.connect(process.env.MONG_URI_TEST as string);
});

afterAll(async () => {
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach((file) => {
      if (file !== ".gitkeep") {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
    });
  }

  await mongoose.disconnect();
});
