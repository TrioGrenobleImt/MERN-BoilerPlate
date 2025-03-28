import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import User from "../../../src/models/userModel.js";
import Log from "../../../src/models/logModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import fs from "fs";

//Import server and app
import app from "../../../src/app.js";

beforeAll(async () => {
  //Connect to database
  await mongoose.connect(process.env.MONG_URI_TEST);
  await User.deleteMany();
});

afterAll(async () => {
  //Disconnect from database
  await Log.deleteMany();
  await mongoose.disconnect();
});

describe("GET /api/users/", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 200 status and list all the users, ", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .get("/api/users/")
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].username).toBe(user.username);
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "test",
    });

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
  afterEach(async () => {
    await User.deleteMany();
  });

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
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const falseId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/users/${falseId}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      role: "admin",
      name: "test",
      forename: "test",
    });

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
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should create a new user with valid data", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .post("/api/users/")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword123",
        name: "test",
        forename: "test",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    // Vérification du statut de la réponse et des données de l'utilisateur créé
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe("testuser");
    expect(response.body.user.email).toBe("testuser@example.com");
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return an error if required fields are missing", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .post("/api/users/")
      .send({ username: "invaliduser", email: "invaliduser@example.com" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing fields");
  });

  it("should return an error if the email already exist", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .post("/api/users/")
      .send({
        username: "userTes",
        email: "test@gmail.com",
        password: "testpassword123",
        role: "bouffonduroi",
        name: "test",
        forename: "test",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email already taken");
  });

  it("should return an error if the username already exist", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .post("/api/users/")
      .send({
        username: "test",
        email: "testuser@example.com",
        password: "testpassword123",
        role: "bouffonduroi",
        name: "test",
        forename: "test",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username already taken");
  });

  it("should return an error if the role isnt valid", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .post("/api/users/")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword123",
        role: "bouffonduroi",
        name: "test",
        forename: "test",
      })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid role");
  });

  it("should return a 500 status if there is an error during user creation", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testmdp",
      role: "admin",
      name: "test",
      forename: "test",
    });

    vi.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .post("/api/users/")
      .send({ username: "erroruser", email: "erroruser@example.com", password: "errorpassword123", name: "test", forename: "test" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("PUT /api/users/:id", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should update a user's username", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "user",
      name: "test",
      forename: "test",
    });
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: "newUsername" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe("newUsername");
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("User updated successfully");
  });

  it("should update a user's password", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ password: "newPassword" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.password).not.toBe(user.password);
  });

  it("should delete password and role from body if the user isn't admin", async () => {
    // Créer un utilisateur avec le rôle 'user'
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "user",
      name: "test",
      forename: "test",
    });

    // Créer un token d'accès pour l'utilisateur
    const token = generateAccessToken(user._id);

    // Effectuer la requête PUT avec un mot de passe et un rôle 'admin'
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ password: "newPassword", role: "admin" })
      .set("Cookie", `__access__token=${token}`);

    // Vérifier que la réponse a un code HTTP 200 (succès)
    expect(response.status).toBe(200);

    // Récupérer l'utilisateur mis à jour depuis la base de données
    const updatedUser = await User.findById(user._id);

    // Vérifier que le mot de passe et le rôle ont été supprimés du corps de la requête
    expect(updatedUser.password).not.toBe("newPassword"); // Le mot de passe ne doit pas avoir été modifié
    expect(updatedUser.role).toBe("user"); // Le rôle doit être resté 'user' et non pas changé en 'admin'

    // Vérifier que le mot de passe et le rôle n'ont pas été envoyés dans la réponse du corps de la requête
    expect(response.body.password).toBeUndefined(); // Assurer que le mot de passe n'est pas dans la réponse
    expect(response.body.role).toBeUndefined(); // Assurer que le rôle n'est pas dans la réponse
  });

  it("should return an error if the email already exists", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });
    const user2 = await User.create({
      username: "test2",
      email: "test2@gmail.com",
      password: "testPassword",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ email: "test2@gmail.com" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email already taken");
  });

  it("should return an error if the username already exists", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });
    const user2 = await User.create({
      username: "test2",
      email: "test2@gmail.com",
      password: "testPassword",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ username: "test2" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username already taken");
  });

  it("should return an error if the user doesn't exist", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/users/${newUserId}`)
      .send({ username: "newUsername" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No such user");
  });

  it("should return an error if the role is invalid", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ role: "roleInexistant" })
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid role");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });
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
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should delete a user", async () => {
    const pathAvatarOld = "./uploads/users/avatars/hello-world.png";
    fs.writeFileSync(pathAvatarOld, "Hello, world!");

    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
      avatar: pathAvatarOld,
    });

    const response = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(fs.existsSync(pathAvatarOld)).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body.user.username).toBe(user.username);
    expect(response.body.user.password).toBe(undefined);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull(); // L'utilisateur ne doit plus exister
  });

  it("should return an error if the user doesn't exist", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });

    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/users/${newUserId}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "testPassword",
      role: "admin",
      name: "test",
      forename: "test",
    });

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
