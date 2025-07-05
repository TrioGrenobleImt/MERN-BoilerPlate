import { describe, it, expect, vi, vitest } from "vitest";
import "dotenv/config";
import request from "supertest";
import fs from "fs";
import { User } from "../../../src/models/userModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import { app } from "../../../src/app.js";
import { adminUser, pathAvatarOldTest, userAdminWithAvatar } from "../../fixtures/index.js";
import path from "path";
import mongoose from "mongoose";
import { IUser } from "../../../src/interfaces/IUser.js";

describe("Tests uploads files", () => {
  it("should return an error if no file is provided", async () => {
    const user: IUser = await User.create(adminUser);

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);

    expect(response.body.error).toBe("server.upload.errors.no_file");
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if no user is found", async () => {
    const user: IUser = await User.create(adminUser);

    const response = await request(app)
      .post(`/api/uploads/avatar/${new mongoose.Types.ObjectId()}`) // ID invalide
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);

    expect(response.body.error).toBe("server.global.errors.no_such_user");
    expect(response.statusCode).toBe(400);
  });

  it("should send an error if the file type isn't allowed", async () => {
    const user: IUser = await User.create(adminUser);

    const path = "./tests/src/controllers/hello-world.txt";
    fs.writeFileSync(path, "Hello, world!");

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .attach("avatar", path, "hello-world.txt");

    expect(response.body.error).toBe("server.upload.errors.invalid_file_type");
    expect(response.statusCode).toBe(400);

    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  });

  it("should return a 500 error if there is a server problem", async () => {
    const user: IUser = await User.create(userAdminWithAvatar);

    vitest.spyOn(User, "findById").mockRejectedValueOnce(new Error("Test error"));

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);

    expect(response.body.error).toBe("Test error");
    expect(response.statusCode).toBe(500);
  });

  it("should delete old profilePic if there is one and update the current", async () => {
    // Construire le chemin local attendu de l'ancien avatar
    const oldAvatarFileName = "old-avatar.png";
    const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", oldAvatarFileName);

    // Crée le fichier ancien avatar s'il n'existe pas
    if (!fs.existsSync(oldAvatarPath)) {
      fs.writeFileSync(oldAvatarPath, "fake old avatar content");
    }

    // Crée user avec avatar URL qui pointe vers ce fichier
    const userWithAvatar = {
      ...userAdminWithAvatar,
      avatar: `http://localhost:3000/uploads/users/avatars/${oldAvatarFileName}`,
    };

    const user: IUser = await User.create(userWithAvatar);

    // Nouveau fichier avatar à uploader
    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    fs.writeFileSync(pathNewAvatar, "Hello, world!");

    // Appel à ta route upload
    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    // Check que l'ancien avatar a bien été supprimé
    expect(fs.existsSync(oldAvatarPath)).toBe(false);

    // Check que le nouveau avatar existe (le fichier que tu as uploadé)
    expect(fs.existsSync(pathNewAvatar)).toBe(true);

    expect(response.body.message).toBe("server.upload.messages.avatar_success");
    expect(response.statusCode).toBe(200);

    // Nettoyage du nouveau fichier
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });

  it("should return an error if the file is too large", async () => {
    const user: IUser = await User.create(userAdminWithAvatar);

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    const fileSizeInBytes = 10 * 1024 * 1024;
    const data = "A".repeat(fileSizeInBytes); // Répéter "A" jusqu'à atteindre la taille du fichier
    fs.writeFileSync(pathNewAvatar, data);

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`server.upload.errors.limit`);

    // Nettoyage des fichiers temporaires
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });
});
