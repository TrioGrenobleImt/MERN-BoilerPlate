import { beforeAll, afterAll, describe, it, expect, afterEach, vi } from "vitest";
import "dotenv/config";
import request from "supertest";
import fs from "fs";
import { User } from "../../../src/models/userModel.js";
import { Log } from "../../../src/models/logModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import { app } from "../../../src/app.js";
import { adminUser, pathAvatarOldTest, userAdminWithAvatar } from "../../fixtures/users.js";

describe("Tests uploads files", () => {
  it("should return an error if no file is provided", async () => {
    const user = await User.create(adminUser);

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`);

    expect(response.body.error).toBe("server.upload.errors.no_file");
    expect(response.statusCode).toBe(400);
  });

  it("should send an error if the file type isn't allowed", async () => {
    const user = await User.create(adminUser);

    const path = "./tests/src/controllers/hello-world.txt";
    fs.writeFileSync(path, "Hello, world!");

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .attach("avatar", path, "hello-world.txt");

    expect(response.body.error).toBe("server.upload.errors.invalid_file_type");
    expect(response.statusCode).toBe(400);

    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  });

  it("should return a 500 error if there is a server problem", async () => {
    const user = await User.create(userAdminWithAvatar);

    vi.spyOn(User, "findById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    fs.writeFileSync(pathNewAvatar, "Hello, world!");

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    expect(response.body.error).toBe("An unexpected error occurred during file upload");
    expect(response.statusCode).toBe(500);

    // Nettoyage des fichiers temporaires
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });

  it("should delete old profilePic if there is one and update the current", async () => {
    const user = await User.create(userAdminWithAvatar);

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    fs.writeFileSync(pathNewAvatar, "Hello, world!");

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    // Vérifie si l'ancien avatar a bien été supprimé
    expect(fs.existsSync(pathAvatarOldTest)).toBe(false);
    expect(fs.existsSync(pathNewAvatar)).toBe(true);
    expect(response.body.message).toBe("server.upload.messages.avatar_success");
    expect(response.statusCode).toBe(200);

    // Nettoyage des fichiers temporaires
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });

  it("should return an error if the file is too large", async () => {
    const user = await User.create(userAdminWithAvatar);

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    const fileSizeInBytes = 10 * 1024 * 1024;
    const data = "A".repeat(fileSizeInBytes); // Répéter "A" jusqu'à atteindre la taille du fichier
    fs.writeFileSync(pathNewAvatar, data);

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`server.upload.errors.limit`);

    // Nettoyage des fichiers temporaires
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });
});
