import { describe, expect, it, vi } from "vitest";
import { saveAvatarFromUrl } from "../../../src/utils/saveAvatarFromUrl";
import fs from "fs";
import https from "https";
import { stablePhotoURL } from "../../fixtures/users";
import { PassThrough } from "stream";

describe("Saving avatar from an url", () => {
  it("should save the avatar from a valid URL", async () => {
    const userId = "123456";

    const mockResponse = new PassThrough();
    mockResponse.statusCode = 200;

    vi.spyOn(https, "get").mockImplementation((_url, cb) => {
      cb(mockResponse);
      // Simule un peu de contenu binaire
      mockResponse.write("fake image content");
      mockResponse.end();
      return {
        on: () => {},
      };
    });

    vi.spyOn(fs, "createWriteStream").mockImplementation(() => {
      const fakeStream = new PassThrough();
      fakeStream.close = () => {};
      return fakeStream;
    });

    const result = await saveAvatarFromUrl("https://fakeurl.com/avatar.jpg", userId);

    expect(result).toContain(`/uploads/users/avatars/avatar_${userId}_`);
  });

  it("should throw an error for an invalid URL", async () => {
    const photoURL = "invalid-url";
    const userId = "12345";

    await expect(saveAvatarFromUrl(photoURL, userId)).rejects.toThrow();
    await expect(saveAvatarFromUrl(photoURL, userId)).rejects.toThrow("Invalid URL");
  });

  it("should handle network errors gracefully", async () => {
    const userId = "12345";

    const mockResponse = new PassThrough();
    mockResponse.statusCode = 404;

    vi.spyOn(https, "get").mockImplementation((_url, cb) => {
      cb(mockResponse);
      mockResponse.end();
      return { on: () => {} };
    });

    await expect(saveAvatarFromUrl("https://fakeurl.com/image.jpg", userId)).rejects.toThrow("Failed to get image, status code: 404");
  });

  it("should handle https.get errors (connection failure)", async () => {
    const userId = "12345";

    vi.spyOn(fs, "unlink").mockImplementation((_path, cb) => {
      if (cb) cb(null);
    });

    vi.spyOn(https, "get").mockImplementation((_url, _cb) => {
      const emitter = {
        on: (event, handler) => {
          if (event === "error") {
            handler(new Error("Network failure"));
          }
          return emitter;
        },
      };
      return emitter;
    });

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Network failure");
    expect(fs.unlink).toHaveBeenCalled();
  });
});
