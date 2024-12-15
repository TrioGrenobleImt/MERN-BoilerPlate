import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import User from "../src/models/userModel.js";
import { logout } from "../src/controllers/authenticationController.js";
import { generateAccessToken } from "../src/utils/generateAccessToken.js";

//Import server and app
import app from "../src/app.js";

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST);
});

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect();
});

describe("POST /api/auth/register", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      confirmPassword: "test",
    });
    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("Registered succesfully");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 400 status error because the passwords do not match", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      confirmPassword: "test2",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Passwords do not match");
  });
  it("should return a 409 status error because the email is already taken", async () => {
    await User.create({ username: "test", email: "test@gmail.com", password: "test" });
    const response = await request(app).post("/api/auth/register").send({
      username: "test2",
      email: "test@gmail.com",
      password: "test",
      confirmPassword: "test",
    });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("This email is already taken");
  });
  it("should return a 409 status error because the username is already taken", async () => {
    await User.create({ username: "test", email: "test@gmail.com", password: "test" });
    const response = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test2@gmail.com",
      password: "test",
      confirmPassword: "test",
    });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("This username is already taken");
  });
  it("should return a 422 status error because of missing fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test",
      password: "test",
      confirmPassword: "test",
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Missing fields");
  });
  it("should return a 500 status error because of an internal error", async () => {
    vitest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      confirmPassword: "test",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("POST /api/auth/login", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      confirmPassword: "test",
    });
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "test",
    });

    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"][0].startsWith("__access__token=")).toBe(true);
    expect(response.body.message).toBe("Logged in succesfully");
    expect(response.body.user).toHaveProperty("_id" && "username" && "email");
    expect(response.body.password).toBe(undefined);
  });
  it("should return a 422 error status because one of the fields is missing", async () => {
    const user = new User({ username: "test", email: "test@gmail.com", password: "testPassword" });
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
    });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Missing fields");
  });
  it("should return a 400 error status because there is no user with this username", async () => {
    const user = new User({ username: "test", email: "test@gmail.com", password: "testPassword" });
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "testFALSE",
      password: "testPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });
  it("should return a 400 error status because the password is wrong", async () => {
    const user = new User({ username: "test", email: "test@gmail.com", password: "testPassword" });
    await user.save();
    const response = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "testPasswordFalse",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid credentials");
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
    const response = await request(app).get("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Signed out succesfully");
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
    user = new User({ username: "test", email: "test@gmail.com", password: "testPassword" });
    await user.save();
  });
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 200 status and the connected user infos", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id" && "username" && "email");
  });
  it("should return a 404 status if the user ID is invalid", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(user.username)}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("The ID user is invalid");
  });
  it("should return a 400 status if the user does not exist", async () => {
    const unknownId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(unknownId)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });
  it("should return a 500 status in case of an internal error", async () => {
    vitest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("GET /api/auth/check", () => {
  it("should return a 200 status if the user is authenticated", async () => {
    const response = await request(app).get("/api/auth/check").set("Cookie", "__access__token=test");
    expect(response.status).toBe(200);
    expect(response.body.authenticated).toBe(true);
  });
  it("should return a 200 status if the user is not authenticated", async () => {
    const response = await request(app).get("/api/auth/check").set("Cookie", "__access__token=;");
    expect(response.status).toBe(200);
    expect(response.body.authenticated).toBe(false);
  });
});
