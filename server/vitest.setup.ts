// vitest.setup.ts
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { User } from "./src/models/userModel.js";
import { Log } from "./src/models/logModel.js";
import { Config } from "./src/models/configModel.js";

import "dotenv/config";

const uploadsDir = path.resolve(__dirname, "uploads/users/avatars");
let initialAvatarFiles: string[] = [];

beforeAll(async () => {
  await mongoose.connect(process.env.MONG_URI_TEST as string);
});

beforeEach(async () => {
  // Snapshot des fichiers existants AVANT test
  if (fs.existsSync(uploadsDir)) {
    initialAvatarFiles = fs.readdirSync(uploadsDir);
  } else {
    initialAvatarFiles = [];
  }

  // Reset BDD
  await User.deleteMany({});
  await Log.deleteMany({});
  await Config.deleteMany({});
});

afterEach(() => {
  if (!fs.existsSync(uploadsDir)) return;

  const finalFiles = fs.readdirSync(uploadsDir);
  const newFiles = finalFiles.filter((f) => !initialAvatarFiles.includes(f));

  newFiles.forEach((file) => {
    const fullPath = path.join(uploadsDir, file);
    fs.unlinkSync(fullPath);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
