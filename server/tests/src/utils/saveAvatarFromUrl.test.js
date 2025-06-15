import { describe, expect, it, vi } from "vitest";
import { saveAvatarFromUrl } from "../../../src/utils/saveAvatarFromUrl";
import fs from "fs";
import https from "https";
import { stablePhotoURL } from "../../fixtures/users";

describe("Saving avatar from an url", () => {
  it("should save the avatar from a valid URL", async () => {
    const userId = "12345";
    const expectedPath = `/uploads/users/avatars/avatar_${userId}_*.jpg`;

    const result = await saveAvatarFromUrl(stablePhotoURL, userId);
    expect(result).toMatch(new RegExp(expectedPath.replace("*", "\\d+")));
  });

  it("should throw an error for an invalid URL", async () => {
    const photoURL = "invalid-url";
    const userId = "12345";

    await expect(saveAvatarFromUrl(photoURL, userId)).rejects.toThrow();
    await expect(saveAvatarFromUrl(photoURL, userId)).rejects.toThrow("Invalid URL");
  });

  it("should handle network errors gracefully", async () => {
    const photoURL = "https://example.com/nonexistent-image.jpg";
    const userId = "12345";
    await expect(saveAvatarFromUrl(photoURL, userId)).rejects.toThrow("Failed to get image, status code: 404");
  });

  it("should create the directory if it does not exist", async () => {
    const userId = "12345";
    const result = await saveAvatarFromUrl(stablePhotoURL, userId);
    expect(result).toContain(`/uploads/users/avatars/avatar_${userId}_`);
  });

  it("should handle https.get errors (connection failure)", async () => {
    const userId = "12345";
    const error = new Error("Network failure");

    vi.spyOn(fs, "unlink").mockImplementation((_, cb) => cb());

    vi.spyOn(https, "get").mockReturnValue({
      on: (event, handler) => {
        if (event === "error") {
          handler(error);
        }
        return this;
      },
    });

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Network failure");
    expect(fs.unlink).toHaveBeenCalled();
  });
});
