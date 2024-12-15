import mongoose from "mongoose";
import { describe, it, beforeAll, afterAll, expect, afterEach, vitest, beforeEach, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import User from "../src/models/userModel.js";

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

describe("GET /api/users/list", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a 201 status, create an account and stock the token into the cookies", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "test" });
    const response = await request(app).get("/api/users/list");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toBe(user.username);
  });

  it("should return a 500 status if an error occurs", async () => {
    vitest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const response = await request(app).get("/api/users/list");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("GET /api/users/:id", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return the user with the given id", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "test" });
    const response = await request(app).get(`/api/users/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
  });

  it("should return an error if the user id is invalid", async () => {
    const response = await request(app).get("/api/users/8");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("The user ID is invalid");
  });

  it("should return an error if the user id is invalid", async () => {
    const falseId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/users/${falseId}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    vi.spyOn(User, "findById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const user = await User.create({ username: "test", email: "test@gmail.com", password: "test" });
    const response = await request(app).get(`/api/users/${user._id}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("POST /api/users/new", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should create a new user with valid data", async () => {
    const response = await request(app).post("/api/users/new").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword123",
    });

    // Vérification du statut de la réponse et des données de l'utilisateur créé
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe("testuser");
    expect(response.body.user.email).toBe("testuser@example.com");
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app).post("/api/users/new").send({ username: "invaliduser", email: "invaliduser@example.com" });

    // Vérification que la réponse indique une erreur pour les champs manquants
    expect(response.status).toBe(404); // Code d'erreur si des champs sont manquants
    expect(response.body.error).toBe("Missing fields");
  });

  it("should return a 500 status if there is an error during user creation", async () => {
    // Mock d'erreur lors de la création de l'utilisateur
    vi.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .post("/api/users/new")
      .send({ username: "erroruser", email: "erroruser@example.com", password: "errorpassword123" });

    // Vérification que l'erreur est bien gérée
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("PUT /api/users/:id", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should update a user's username", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "testPassword" });
    const response = await request(app).put(`/api/users/${user._id}`).send({ username: "newUsername" });

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe("newUsername");
    expect(response.body.user.password).toBe(undefined);
    expect(response.body.message).toBe("User updated successfully");
  });

  it("should update a user's password", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "testPassword" });
    const response = await request(app).put(`/api/users/${user._id}`).send({ password: "newPassword" });

    expect(response.status).toBe(200);
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.password).not.toBe(user.password); // Vérifie que le mot de passe a été mis à jour
  });

  it("should return an error if the user id is invalid", async () => {
    const response = await request(app).put("/api/users/invalidid").send({ username: "newUsername" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("The ID user is invalid");
  });

  it("should return an error if the user doesn't exist", async () => {
    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app).put(`/api/users/${newUserId}`).send({ username: "newUsername" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "testPassword" });
    vi.spyOn(User, "findOneAndUpdate").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).put(`/api/users/${user._id}`).send({ username: "newUsername" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("DELETE /api/users/:id", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it("should delete a user", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "testPassword" });
    const response = await request(app).delete(`/api/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body.user.username).toBe(user.username);
    expect(response.body.user.password).toBe(undefined);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull(); // L'utilisateur ne doit plus exister
  });

  it("should return an error if the user id is invalid", async () => {
    const response = await request(app).delete("/api/users/invalidid");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("The ID user is invalid");
  });

  it("should return an error if the user doesn't exist", async () => {
    const newUserId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/users/${newUserId}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No such user");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user = await User.create({ username: "test", email: "test@gmail.com", password: "testPassword" });

    vi.spyOn(User, "findOneAndDelete").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app).delete(`/api/users/${user._id}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
