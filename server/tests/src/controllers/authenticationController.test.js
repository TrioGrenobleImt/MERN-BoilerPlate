import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import { User } from "../../../src/models/userModel.js";
import { logout } from "../../../src/controllers/authenticationController.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import { Log } from "../../../src/models/logModel.js";

//Import server and app
import { app } from "../../../src/app.js";
import {
  badConfirmPasswordRegisterUser,
  badPasswordRegisterUser,
  registerUser,
  regularUser,
  userWithSameEmail,
  userWithSameUsername,
} from "../../fixtures/users.js";

afterAll(async () => {
  await Log.deleteMany();
});

describe("POST /api/auth/register", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("Registered successfully");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 400 status error because the password isnt strong enough", async () => {
    const response = await request(app).post("/api/auth/register").send(badPasswordRegisterUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    );
  });

  it("should return a 400 status error because the passwords do not match", async () => {
    const response = await request(app).post("/api/auth/register").send(badConfirmPasswordRegisterUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Passwords do not match");
  });

  it("should return a 409 status error because the email is already taken", async () => {
    await User.create(userWithSameUsername);
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("This email is already taken");
  });

  it("should return a 409 status error because the username is already taken", async () => {
    await User.create(userWithSameEmail);
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("This username is already taken");
  });

  it("should return a 422 status error because of missing fields", async () => {
    const response = await request(app).post("/api/auth/register").send(regularUser);
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Missing fields");
  });

  it("should return a 500 status error because of an internal error", async () => {
    vitest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).post("/api/auth/register").send(registerUser);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
