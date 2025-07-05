import mongoose from "mongoose";
import { logLevels } from "../../src/utils/enums/logLevels";
import fs from "fs";
import bcrypt from "bcryptjs";

export const basicLog = {
  message: "Log message",
  userId: new mongoose.Types.ObjectId(),
  level: logLevels.INFO,
};

export const adminUser = {
  name: "Admin User",
  forename: "admin",
  username: "admin",
  email: "admin@gmail.com",
  password: "admin123",
  role: "admin",
};

export const userWithSameEmail = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "admin@gmail.com",
  password: "Abcdef1@",
};

export const userWithSameUsername = {
  name: "Regular User",
  forename: "user",
  username: "admin",
  email: "user@gmail.com",
  password: "Abcdef1@",
};

export const invalidRoleUser = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "user@gmail.com",
  password: "Abcdef1@",
  role: "invalidRole",
};

export const regularUser = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "user@gmail.com",
  password: "Abcdef1@",
};

export const pathAvatarOldTest = "./uploads/users/avatars/_test_hello-world.png";
fs.writeFileSync(pathAvatarOldTest, "Hello, world!");

export const userAdminWithAvatar = {
  username: "test",
  email: "test@gmail.com",
  password: "testPassword",
  role: "admin",
  name: "test",
  forename: "test",
  avatar: pathAvatarOldTest,
};

export const userWithAvatarAndHashPassword = {
  username: "test",
  email: "test@gmail.com",
  password: await bcrypt.hash("Abcdef1@", 10),
  name: "test",
  forename: "Test",
  avatar: pathAvatarOldTest,
};

export const userWithHashPassword = {
  username: "test",
  email: "test@gmail.com",
  password: await bcrypt.hash("Abcdef1@", 10),
  name: "test",
  forename: "Test",
};

export const registerUser = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "user@gmail.com",
  password: "Abcdef1@",
  confirmPassword: "Abcdef1@",
};

export const badPasswordRegisterUser = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "user@gmail.com",
  password: "aa",
  confirmPassword: "aa",
};

export const badConfirmPasswordRegisterUser = {
  name: "Regular User",
  forename: "user",
  username: "user",
  email: "user@gmail.com",
  password: "Abcdef1@",
  confirmPassword: "Abcdef1@f",
};

export const stablePhotoURL = "https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png";
