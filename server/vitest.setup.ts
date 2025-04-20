// vitest.setup.ts
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import "dotenv/config";

const uploadsDir = path.resolve(__dirname, "uploads/users/avatars");
let filesBeforeTest: string[] = [];

beforeEach(() => {
  if (fs.existsSync(uploadsDir)) {
    filesBeforeTest = fs.readdirSync(uploadsDir);
  }
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
  await mongoose.disconnect();
});
