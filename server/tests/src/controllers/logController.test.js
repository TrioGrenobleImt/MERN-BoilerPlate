import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import User from "../../../src/models/userModel.js";
import Log from "../../../src/models/logModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";

//Import server and app
import app from "../../../src/app.js";
import { logLevels } from "../../../src/utils/enums/logLevel.js";

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
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "test", role: "admin" });

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
