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

describe("POST /api/auth/register", () => {
  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("server.auth.messages.register_success");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 400 status error because the password isnt strong enough", async () => {
    const response = await request(app).post("/api/auth/register").send(badPasswordRegisterUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.auth.errors.regex");
  });

  it("should return a 400 status error because the passwords do not match", async () => {
    const response = await request(app).post("/api/auth/register").send(badConfirmPasswordRegisterUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.auth.errors.password_no_match");
  });

  it("should return a 409 status error because the email is already taken", async () => {
    await User.create(userWithSameUsername);
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("server.auth.errors.email_taken");
  });

  it("should return a 409 status error because the username is already taken", async () => {
    await User.create(userWithSameEmail);
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("server.auth.errors.username_taken");
  });

  it("should return a 422 status error because of missing fields", async () => {
    const response = await request(app).post("/api/auth/register").send(regularUser);
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
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

describe("POST /api/auth/login", () => {
  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    await request(app).post("/api/auth/register").send(registerUser);
    const response = await request(app).post("/api/auth/login").send({
      username: "user",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 201 status when logging in with email", async () => {
    await request(app).post("/api/auth/register").send(registerUser);

    const response = await request(app).post("/api/auth/login").send({
      email: "user@gmail.com",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 201 status when logging in with username", async () => {
    await request(app).post("/api/auth/register").send(registerUser);

    const response = await request(app).post("/api/auth/login").send({
      username: "user",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 422 error status because one of the fields is missing", async () => {
    const user = new User(regularUser);
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
  });
  it("should return a 422 error status because one of the fields is missing", async () => {
    const user = new User(regularUser);
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      password: "test",
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
  });
  it("should return a 400 error status because there is no user with this username", async () => {
    const user = new User(regularUser);
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "testFALSE",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.global.errors.no_such_user");
  });
  it("should return a 400 error status because the password is wrong", async () => {
    const user = new User(regularUser);
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "user",
      password: "Abcdef1@FALSE",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.auth.errors.invalid_credentials");
  });
  it("should return a 500 error status because of an internal error", async () => {
    vitest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "testPassword",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("GET /api/auth/logout", () => {
  it("should return a 200 status and clear the cookies", async () => {
    const user = new User(regularUser);
    await user.save();
    const response = await request(app)
      .get("/api/auth/logout")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("server.auth.messages.logout_success");
    expect(response.headers["set-cookie"][0].startsWith("__access__token=;")).toBe(true);
  });
  it("should return a 500 error status in case of an internal error", async () => {
    const error = new Error("Test error");
    const res = {
      clearCookie: vitest.fn(() => {
        throw error;
      }),
      status: vitest.fn().mockReturnThis(),
      json: vitest.fn(),
    };
    await logout({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

describe("GET /api/auth/me", () => {
  let user;
  beforeEach(async () => {
    user = new User(regularUser);
    await user.save();
  });

  it("should return a 200 status and the connected user infos", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id" && "username" && "email");
  });
  it("should return a 500 status in case of an internal error", async () => {
    vitest.spyOn(User, "findById").mockImplementationOnce(async () => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
