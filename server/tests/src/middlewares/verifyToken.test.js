import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, vi, afterEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import { User } from "../../../src/models/userModel";
import jwt from "jsonwebtoken";
import { app } from "../../../src/app";
import { generateAccessToken } from "../../../src/utils/generateAccessToken";
import { regularUser } from "../../fixtures/users";

describe("verifyToken Middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/users/").send();

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not Authenticated");
  });

  it("should return 403 if the token is invalid", async () => {
    const res = await request(app).get("/api/users/").set("Cookie", "__access__token=invalidtoken").send();

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Access Token is invalid");
  });

  it("should call next middleware if the token is valid and no role is required", async () => {
    const user = { id: "userId123" };
    const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);

    const res = await request(app).get("/api/auth/me/").set("Cookie", `__access__token=${token}`).send();

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(403);
  });

  it("should return 400 if the user does not exist", async () => {
    const nonExistentUserId = { id: new mongoose.Types.ObjectId() };
    const token = jwt.sign(nonExistentUserId, process.env.SECRET_ACCESS_TOKEN);

    const res = await request(app).get("/api/users").set("Cookie", `__access__token=${token}`).send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No such user");
  });

  it("should return 403 if the user is not admin for admin routes", async () => {
    const user = await User.create(regularUser);

    const res = await request(app)
      .get("/api/users/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    // Vérifiez que l'accès est restreint
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Access restricted");
  });

  it("should return a 500 status error when there is a database error", async () => {
    const user = { id: "userId123" };
    const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);

    const findByIdMock = vi.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/api/users/").set("Cookie", `__access__token=${token}`).send();

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Database error");

    findByIdMock.mockRestore();
  });
});
