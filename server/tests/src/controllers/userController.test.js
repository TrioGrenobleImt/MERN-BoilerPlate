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

describe("GET /api/users/", () => {
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

describe("GET /api/users/:id", () => {
  it("should return the user with the given id", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "test",
    });
    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
  });

  it("should return an error if the user id is invalid", async () => {
    const user = await User.create(adminUser);

    const falseId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/users/${falseId}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create(adminUser);

    vi.spyOn(User, "findById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("POST /api/users/", () => {
  it("should create a new user with valid data", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post("/api/users/")
      .send(regularUser)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    // Vérification du statut de la réponse et des données de l'utilisateur créé
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(regularUser.username);
    expect(response.body.user.email).toBe(regularUser.email);
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return an error if required fields are missing", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post("/api/users/")
      .send({ username: "invaliduser", email: "invaliduser@example.com" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing fields");
  });

  it("should return an error if the email already exist", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post("/api/users/")
      .send(userWithSameEmail)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email already taken");
  });

  it("should return an error if the username already exist", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post("/api/users/")
      .send(userWithSameUsername)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username already taken");
  });

  it("should return an error if the role isnt valid", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post("/api/users/")
      .send(invalidRoleUser)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid role");
  });

  it("should return a 500 status if there is an error during user creation", async () => {
    const user = await User.create(adminUser);

    vi.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .post("/api/users/")
      .send(regularUser)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("PUT /api/users/:id", () => {
  it("should update a user's username", async () => {
    const user = await User.create(adminUser);
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: "newusername" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe("newusername");
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("server.users.messages.user_updated");
  });

  it("should update a user's email and set it in lowercase", async () => {
    const user = await User.create(adminUser);
    const newEmail = "NEWEMAIL@gmail.com";
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ email: newEmail })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(newEmail.toLowerCase());
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("server.users.messages.user_updated");
  });

  it("should update a user's password", async () => {
    const user = await User.create(adminUser);
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ password: "newPassword" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("server.users.messages.user_updated");
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.password).not.toBe(user.password);
  });

  it("should delete password and role from body if the user isn't admin", async () => {
    const user = await User.create(regularUser);

    const token = generateAccessToken(user._id);

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ password: "newPassword", role: "admin" })
      .set("Cookie", `__access__token=${token}`);

    expect(response.status).toBe(200);

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.password).not.toBe("newPassword");
    expect(updatedUser.role).toBe("user");

    expect(response.body.password).toBeUndefined();
    expect(response.body.role).toBeUndefined();
  });

  it("should return an error if the email already exists", async () => {
    const user = await User.create(adminUser);
    await User.create(regularUser);

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ email: "user@gmail.com" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("server.users.errors.email_taken");
  });

  it("should return an error if the username already exists", async () => {
    const user = await User.create(adminUser);
    await User.create(regularUser);

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: "user" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("server.users.errors.username_taken");
  });

  it("should return an error if the user doesn't exist", async () => {
    const user = await User.create(adminUser);

    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/users/${newUserId}`)
      .send({ username: "newUsername" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("server.global.errors.no_such_user");
  });

  it("should return an error if the role is invalid", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ role: "roleInexistant" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.users.errors.invalid_role");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create(adminUser);
    vi.spyOn(User, "findOneAndUpdate").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: "newUsername" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("DELETE /api/users/:id", () => {
  it("should delete a user", async () => {
    const user = await User.create(userAdminWithAvatar);

    const response = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(fs.existsSync(pathAvatarOldTest)).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body.user.username).toBe(user.username);
    expect(response.body.user.password).toBe(undefined);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull(); // L'utilisateur ne doit plus exister
  });

  it("should return an error if the user doesn't exist", async () => {
    const user = await User.create(adminUser);

    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/users/${newUserId}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create(adminUser);

    vi.spyOn(User, "findOneAndDelete").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("GET /api/users/generatePassword", () => {
  it("should return a 200 status and a generated password", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .get(`/api/users/utils/generatePassword`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password generated successfully");
    expect(response.body.password).toBeDefined();
  });
});

describe("PUT /api/users/:id/password", () => {
  let user;

  beforeEach(async () => {
    user = new User(userWithHashPassword);
    await user.save();
  });

  it("should return a 200 status and update the password successfully", async () => {
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "NewPass1@",
        newPasswordConfirm: "NewPass1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("server.users.messages.password_updated");

    const updatedUser = await User.findById(user._id).select("+password");
    const isMatch = await bcrypt.compare("NewPass1@", updatedUser.password);
    expect(isMatch).toBe(true);
  });

  it("should return a 400 status error for missing fields", async () => {
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "NewPass1@",
        // Missing newPasswordConfirm
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
  });

  it("should return a 400 status error for incorrect current password", async () => {
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "WrongPassword", // Incorrect password
        newPassword: "NewPass1@",
        newPasswordConfirm: "NewPass1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.users.errors.actual_password_incorrect");
  });

  it("should return a 400 status error for weak new password", async () => {
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "weakpass", // Does not meet regex
        newPasswordConfirm: "weakpass",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.users.errors.regex_error");
  });

  it("should return a 400 status error for passwords that do not match", async () => {
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "NewPass1@",
        newPasswordConfirm: "DifferentPass1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.users.errors.passwords_do_not_match");
  });

  it("should return a 400 status error if user does not exist", async () => {
    const falseId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/api/users/${falseId}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "NewPass1@",
        newPasswordConfirm: "NewPass1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.global.errors.no_such_user");
  });

  it("should return a 500 status error due to internal server error", async () => {
    vitest.spyOn(User, "findById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .send({
        currentPassword: "Abcdef1@",
        newPassword: "NewPass1@",
        newPasswordConfirm: "NewPass1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("DELETE /api/users/delete/account", () => {
  it("should delete the current user's account", async () => {
    fs.mkdirSync(path.dirname(pathAvatarOldTest), { recursive: true });
    fs.writeFileSync(pathAvatarOldTest, "fake image content");

    const user = await User.create({
      ...userWithAvatarAndHashPassword,
      avatar: `/uploads/users/avatars/${path.basename(pathAvatarOldTest)}`,
    });

    const response = await request(app)
      .delete("/api/users/delete/account")
      .send({
        password: "Abcdef1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(fs.existsSync(pathAvatarOldTest)).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("server.users.messages.user_deleted");
    expect(response.body.user).toBe(undefined);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create(userWithHashPassword);

    vi.spyOn(User, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .delete("/api/users/delete/account")
      .send({
        password: "Abcdef1@",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });

  it("should return a 400 status if password is missing", async () => {
    const user = await User.create(userWithHashPassword);

    const response = await request(app)
      .delete("/api/users/delete/account")
      .send({
        password: "",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.global.errors.missing_fields");
  });

  it("should return a 400 status if password is incorrect", async () => {
    const user = await User.create(userWithHashPassword);

    const response = await request(app)
      .delete("/api/users/delete/account")
      .send({
        password: "wrongPassword",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("server.users.errors.password_incorrect");
  });
});
