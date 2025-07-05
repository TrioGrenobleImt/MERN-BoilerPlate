import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import https, { IncomingMessage } from "http";
import fs from "fs";
import mongoose from "mongoose";
import { EventEmitter } from "events";
import { PassThrough } from "stream";
import { saveAvatarFromUrl } from "../../../src/utils/saveAvatarFromUrl";
import { stablePhotoURL } from "../../fixtures/users";

describe("saveAvatarFromUrl", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should reject if URL is invalid", async () => {
    const userId = new mongoose.Types.ObjectId();
    await expect(saveAvatarFromUrl("not-a-url", userId)).rejects.toThrow("Invalid URL");
  });

  it("should reject if status code is not 200", async () => {
    const userId = new mongoose.Types.ObjectId();

    vi.spyOn(https, "get").mockImplementation((_url: any, cb: any) => {
      const fakeRes = new PassThrough() as unknown as IncomingMessage & NodeJS.WritableStream;
      fakeRes.statusCode = 404;
      cb(fakeRes);
      return new EventEmitter() as unknown as https.ClientRequest;
    });

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Failed to get image");
  });

  it("should handle https.get errors (connection failure)", async () => {
    const userId = new mongoose.Types.ObjectId();

    vi.spyOn(fs, "unlink").mockImplementation((_path, cb) => {
      if (cb) cb(null);
    });

    vi.spyOn(https, "get").mockImplementation((_url: any, _cb: any): https.ClientRequest => {
      const fakeReq = new EventEmitter() as unknown as https.ClientRequest;

      (fakeReq as any).on = (event: string, handler: (...args: any[]) => void) => {
        if (event === "error") {
          handler(new Error("Network failure"));
        }
        return fakeReq;
      };

      return fakeReq;
    });

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Network failure");
    expect(fs.unlink).toHaveBeenCalled();
  });

  it("should reject if status code is not 200", async () => {
    const userId = new mongoose.Types.ObjectId();

    vi.spyOn(https, "get").mockImplementation((_url: any, cb: any) => {
      const fakeRes = new PassThrough() as unknown as IncomingMessage;
      fakeRes.statusCode = 404;
      cb(fakeRes);
      return new EventEmitter() as unknown as https.ClientRequest;
    });

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Failed to get image");
  });

  it("should save the image successfully", async () => {
    const userId = new mongoose.Types.ObjectId();

    const fakeRes = new PassThrough() as unknown as IncomingMessage & NodeJS.WritableStream;

    vi.spyOn(https, "get").mockImplementation((_url: any, cb: any) => {
      cb(fakeRes);
      fakeRes.statusCode = 200;
      process.nextTick(() => {
        fakeRes.write("fake image content");
        fakeRes.end();
      });
      return new EventEmitter() as unknown as https.ClientRequest;
    });

    const unlinkSpy = vi.spyOn(fs, "unlink").mockImplementation((_path, cb) => {
      if (cb) cb(null);
    });

    const result = await saveAvatarFromUrl(stablePhotoURL, userId);
    expect(result).toMatch(/uploads\/users\/avatars\/avatar_/);
    expect(unlinkSpy).not.toHaveBeenCalled();
  });
});
