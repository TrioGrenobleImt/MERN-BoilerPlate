import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, vi, beforeEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import { User } from "../../../src/models/userModel.js";
import { Log } from "../../../src/models/logModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import fs from "fs";
import bcrypt from "bcryptjs";

//Import server and app
import { app } from "../../../src/app.js";
import {
  adminUser,
  invalidRoleUser,
  pathAvatarOldTest,
  regularUser,
  userAdminWithAvatar,
  userWithAvatarAndHashPassword,
  userWithHashPassword,
  userWithSameEmail,
  userWithSameUsername,
} from "../../fixtures/users.js";
import path from "path";

beforeAll(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await Log.deleteMany();
});

describe("GET /api/users/", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 200 status and list all the users, ", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .get("/api/users/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].username).toBe(user.username);
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create(adminUser);

    vitest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get("/api/users/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
