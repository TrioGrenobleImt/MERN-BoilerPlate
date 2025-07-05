import { app } from "../../../src/app.js";
import { pathAvatarOldTest, userAdminWithAvatar } from "../../fixtures/index.js";
import { describe, it, expect } from "vitest";
import "dotenv/config";
import request from "supertest";
import fs from "fs";
import path from "path";
import { User } from "../../../src/models/userModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import { IUser } from "../../../src/interfaces/IUser.js";

describe("Tests uploads files", () => {
  it("should delete old profilePic if there is one and update the current", async () => {
    // Création utilisateur en base
    const user: IUser = await User.create(userAdminWithAvatar);

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    fs.writeFileSync(pathNewAvatar, "Hello, world!");

    // Requête upload avec auth et fichier attaché
    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    // Vérifie que l'ancien avatar a été supprimé
    expect(fs.existsSync(pathAvatarOldTest)).toBe(false);

    // Vérifie qu’il y a bien des fichiers dans le dossier avatars
    const uploadsDir = path.resolve(__dirname, "../../../uploads/users/avatars");
    const files = fs.readdirSync(uploadsDir);
    expect(files.length).toBeGreaterThan(0);

    // Vérifie le message et le status
    expect(response.body.message).toBe("server.upload.messages.avatar_success");
    expect(response.statusCode).toBe(200);

    // Nettoyage du fichier créé pour le test
    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });
});
