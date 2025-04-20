import { app } from "../../../src/app.js";
import { pathAvatarOldTest, userAdminWithAvatar } from "../../fixtures/users.js";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import "dotenv/config";
import request from "supertest";
import fs from "fs";
import { User } from "../../../src/models/userModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import path from "path";

describe("Tests uploads files", () => {
  it("should delete old profilePic if there is one and update the current", async () => {
    const user = await User.create(userAdminWithAvatar);

    const pathNewAvatar = "./tests/src/controllers/hello-world.png";
    fs.writeFileSync(pathNewAvatar, "Hello, world!");

    const response = await request(app)
      .post(`/api/uploads/avatar/${user._id}`)
      .set("Cookie", `__access__token=${generateAccessToken(user._id)}`)
      .attach("avatar", pathNewAvatar, "hello-world.png");

    expect(fs.existsSync(pathAvatarOldTest)).toBe(false);

    const uploadsDir = path.resolve(__dirname, "../../../uploads/users/avatars");
    const files = fs.readdirSync(uploadsDir);
    expect(files.length).toBeGreaterThan(0);

    expect(response.body.message).toBe("server.upload.messages.avatar_success");
    expect(response.statusCode).toBe(200);

    if (fs.existsSync(pathNewAvatar)) {
      fs.unlinkSync(pathNewAvatar);
    }
  });
});
