import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import User from "../../../src/models/userModel.js";
import Log from "../../../src/models/logModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";

//Import server and app
import app from "../../../src/app.js";
import { logLevels } from "../../../src/utils/enums/logLevel.js";
import { createLog } from "../../../src/controllers/logController.js";

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST);
});

afterAll(async () => {
  //Disconnect from database
  await mongoose.disconnect();
});

describe("GET api/logs/", () => {
  afterEach(async () => {
    await User.deleteMany();
    await Log.deleteMany();
  });

  it("should return a 200 success status and the list of the logs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    await Log.create({
      message: "test",
      level: logLevels.INFO,
      user: user._id,
    });

    const res = await request(app)
      .get("/api/logs/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logs retrieved successfully");
    expect(res.body.logs.length).toBe(1);
    expect(res.body.logs[0].message).toBe("test");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    vitest.spyOn(Log, "find").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get("/api/logs/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("createLog", () => {
  it("should log an error if parameters are missing", async () => {
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    await createLog({ message: "Test log", userId: null, level: logLevels.INFO });

    expect(consoleErrorMock).toHaveBeenCalledWith("createLog: Missing parameters", {
      message: "Test log",
      userId: null,
      level: logLevels.INFO,
    });

    consoleErrorMock.mockRestore();
  });

  it("should log an error if level is invalid", async () => {
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    await createLog({ message: "Test log", userId: "user123", level: "INVALID_LEVEL" });

    expect(consoleErrorMock).toHaveBeenCalledWith("createLog: Invalid log level", {
      message: "Test log",
      userId: "user123",
      level: "INVALID_LEVEL",
    });

    consoleErrorMock.mockRestore();
  });

  it("should create a log when valid parameters are provided", async () => {
    const createMock = vi.spyOn(Log, "create").mockResolvedValue({});
    await createLog({ message: "Valid log", userId: "user123", level: logLevels.INFO });

    expect(createMock).toHaveBeenCalledWith({
      message: "Valid log",
      user: "user123",
      level: logLevels.INFO,
    });

    createMock.mockRestore();
  });

  it("should log an error if Log.create throws an error", async () => {
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    const logCreateMock = vi.spyOn(Log, "create").mockRejectedValue(new Error("Database error"));

    await createLog({ message: "DB Error Log", userId: "user123", level: logLevels.ERROR });

    expect(consoleErrorMock).toHaveBeenCalledWith("createLog: Error creating log", expect.any(Error));

    consoleErrorMock.mockRestore();
    logCreateMock.mockRestore();
  });
});

describe("DELETE api/logs/", () => {
  afterEach(async () => {
    await User.deleteMany();
    await Log.deleteMany();
  });

  it("should return a 200 success status and delete all the logs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    await Log.create({
      message: "test",
      level: logLevels.INFO,
      user: user._id,
    });

    const res = await request(app)
      .delete("/api/logs/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("All logs deleted successfully");
    expect(res.body.logs).toBe(undefined);
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    vitest.spyOn(Log, "deleteMany").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .delete("/api/logs/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("DELETE api/logs/:id", () => {
  afterEach(async () => {
    await User.deleteMany();
    await Log.deleteMany();
  });

  it("should return a 200 success status and delete all the logs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    const log = await Log.create({
      message: "test",
      level: logLevels.INFO,
      user: user._id,
    });

    const res = await request(app)
      .delete(`/api/logs/${log._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .send();

    expect(res.body.message).toBe("Log deleted successfully");
    expect(res.status).toBe(200);
    expect(res.body.log).toBe(undefined);
  });

  it("should return a 400 error if there is no such log", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    const res = await request(app)
      .delete(`/api/logs/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No such log");
    expect(res.body.log).toBe(undefined);
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    vitest.spyOn(Log, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const log = await Log.create({
      message: "test",
      level: logLevels.INFO,
      user: user._id,
    });

    const response = await request(app)
      .delete(`/api/logs/${log._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("GET api/logs/log-levels/", () => {
  afterEach(async () => {
    await User.deleteMany();
    await Log.deleteMany();
  });

  it("should return a 200 success status and the list of the logs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "Test",
    });

    const res = await request(app)
      .get("/api/logs/log-levels/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.logLevels).toEqual(Object.values(logLevels));
  });
});
