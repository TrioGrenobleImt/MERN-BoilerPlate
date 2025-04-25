// vitest.setup.ts
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import "dotenv/config";
import { User } from "./src/models/userModel.js";
import { Log } from "./src/models/logModel.js";
import { Config } from "./src/models/configModel.js";

const uploadsDir = path.resolve(__dirname, "uploads/users/avatars");
let filesBeforeTest: string[] = [];

beforeEach(async () => {
  if (fs.existsSync(uploadsDir)) {
    filesBeforeTest = fs.readdirSync(uploadsDir);
  }
  await User.deleteMany({});
  await Log.deleteMany({});
  await Config.deleteMany({});
});

afterEach(async () => {
  if (fs.existsSync(uploadsDir)) {
    const filesAfterTest = fs.readdirSync(uploadsDir);
    const uploadedFiles = filesAfterTest.filter((file) => !filesBeforeTest.includes(file));

    uploadedFiles.forEach((file) => {
      fs.unlinkSync(path.join(uploadsDir, file));
    });
  }
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONG_URI_TEST as string);
});

afterAll(async () => {
  await User.deleteMany({});
  await Log.deleteMany({});
  await Config.deleteMany({});

  await mongoose.disconnect();
});
