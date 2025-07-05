import { describe, it, expect, vitest, beforeEach, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import { User } from "../../../src/models/userModel.js";
import { logout } from "../../../src/controllers/authenticationController.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";

//Import server and app
import { app } from "../../../src/app.js";
import {
  badConfirmPasswordRegisterUser,
  badPasswordRegisterUser,
  registerUser,
  regularUser,
  stablePhotoURL,
  userWithSameEmail,
  userWithSameUsername,
} from "../../fixtures/index.js";
import { authTypes } from "../../../src/utils/enums/authTypes.js";
import { Request, Response } from "express";

describe("POST /api/auth/register", () => {
  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    const response = await request(app).post("/api/auth/register").send(registerUser);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.register_success");
    expect(response.body.user.auth_type).toBe(authTypes.LOCAL);
    expect(response.body.password).toBe(undefined);
    expect(response.body.user.avatar).toContain("uploads/users/avatars/avatar_");
  });

  it("should return a 201 status, create an account and stock the token into the cookies with a photoURL", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...registerUser,
        photoURL: stablePhotoURL,
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.register_success");
    expect(response.body.user.auth_type).toBe(authTypes.GOOGLE);
    expect(response.body.password).toBe(undefined);
  });

  it("should attach the downloaded avatar to the user if photoURL is valid", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...registerUser,
        photoURL: stablePhotoURL,
      });
    expect(response.status).toBe(201);
    expect(response.body.user.avatar).toContain("uploads/users/avatars/avatar_");
    expect(response.body.user.avatar).toContain(".jpg");
  });

  it("should log an error if the avatar fails to be downloaded", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...registerUser,
        photoURL: "invalid-url",
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.register_success");
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
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 201 status when logging in with email", async () => {
    await request(app).post("/api/auth/register").send(registerUser);

    const response = await request(app).post("/api/auth/login").send({
      email: "user@gmail.com",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 201 status when logging in with username", async () => {
    await request(app).post("/api/auth/register").send(registerUser);

    const response = await request(app).post("/api/auth/login").send({
      username: "user",
      password: "Abcdef1@",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.login_success");
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

describe("GET /api/auth/login/google", () => {
  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ ...registerUser, photoURL: stablePhotoURL });
    const response = await request(app).post("/api/auth/login/google").send({
      email: "user@gmail.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("server.auth.messages.login_success");
    expect(response.body.password).toBe(undefined);
  });

  it("should return a 404 error status because the user does not exist", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ ...registerUser, photoURL: stablePhotoURL });
    const response = await request(app).post("/api/auth/login/google").send({
      email: "inconnu@gmail.com",
    });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found, lets register !");
  });

  it("should return a 422 error status because the email is missing", async () => {
    const response = await request(app).post("/api/auth/login/google").send({});
    expect(response.status).toBe(422);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
  });

  it("should return a 500 error status because of an internal error", async () => {
    vitest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).post("/api/auth/login/google").send({
      email: "user@gmail.com",
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
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("server.auth.messages.logout_success");
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
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
  });

  it("should return a 500 status in case of an internal error", async () => {
    vi.spyOn(User, "findById").mockRejectedValueOnce(new Error("Test error"));

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
