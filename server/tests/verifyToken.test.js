import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import jwt from "jsonwebtoken";

// Import server, app, and mock User model
import app from "../src/app";
import User from "../src/models/userModel.js";
import { roles } from "../src/utils/enums/roles.js";

vi.mock("../src/models/userModel.js"); // Mock le modèle User

beforeAll(async () => {
  // Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST);
});

afterAll(async () => {
  // Disconnect from database
  await mongoose.disconnect();
});

describe("verifyToken Middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/users/list").send();

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not Authenticated");
  });

  it("should return 403 if the token is invalid", async () => {
    const res = await request(app).get("/api/users/list").set("Cookie", "__access__token=invalidtoken").send();

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access Token is invalid");
  });

  it("should call next middleware if the token is valid and no role is required", async () => {
    const user = { id: "userId123" };
    const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);

    const res = await request(app).get("/api/users/list").set("Cookie", `__access__token=${token}`).send();

    expect(res.status).toBe(400);
  });

  it("should return 403 if the user is not admin for admin routes", async () => {
    User.findById.mockResolvedValue({ _id: "userId123", role: "user" });

    const validToken = jwt.sign({ id: "userId123" }, process.env.SECRET_ACCESS_TOKEN);
    const res = await request(app).get("/api/users/list").set("Cookie", `__access__token=${validToken}`).send();

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access restricted to administrators");
  });

  it("should return a 500 status error when there is a database error", async () => {
    const user = { id: "userId123" };
    const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);

    const findByIdMock = vi.spyOn(User, "findById").mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/api/users/list").set("Cookie", `__access__token=${token}`).send();

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");

    findByIdMock.mockRestore();
  });
});
