import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { IncomingMessage, ClientRequest, RequestOptions } from "http";
import https from "https";
import fs, { WriteStream } from "fs";
import path from "path";
import mongoose from "mongoose";
import { EventEmitter } from "events";
import { PassThrough, Writable } from "stream";
import { saveAvatarFromUrl } from "../../../src/utils/saveAvatarFromUrl.js";
import { stablePhotoURL } from "../../fixtures/index.js";

// Créer un mock pour IncomingMessage
const createMockIncomingMessage = (statusCode: number): IncomingMessage => {
  const mockMessage = new PassThrough() as unknown as IncomingMessage;
  mockMessage.statusCode = statusCode;
  mockMessage.headers = {};
  mockMessage.rawHeaders = [];
  mockMessage.httpVersion = "1.1";
  mockMessage.httpVersionMajor = 1;
  mockMessage.httpVersionMinor = 1;
  mockMessage.rawTrailers = [];
  mockMessage.trailers = {};
  mockMessage.aborted = false;
  mockMessage.complete = true;

  mockMessage.connection = mockMessage.socket;
  mockMessage.destroy = vi.fn();
  mockMessage.setTimeout = vi.fn();
  return mockMessage;
};

describe("saveAvatarFromUrl", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Assurez-vous que le répertoire existe avant de commencer les tests
    const folderPath = path.join(process.cwd(), "uploads", "users", "avatars");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should reject if URL is invalid", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    await expect(saveAvatarFromUrl("not-a-url", userId)).rejects.toThrow("Invalid URL");
  });

  it("should save the image successfully", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    const fakeRes: IncomingMessage = createMockIncomingMessage(200);

    vi.spyOn(https, "get").mockImplementation(
      (
        url: string | URL | RequestOptions,
        optionsOrCb?: RequestOptions | ((res: IncomingMessage) => void),
        cb?: (res: IncomingMessage) => void,
      ): ClientRequest => {
        const req = new EventEmitter() as ClientRequest;

        if (typeof url === "string" || url instanceof URL) {
          if (typeof optionsOrCb === "function") {
            process.nextTick(() => optionsOrCb(fakeRes));
          } else if (cb) {
            process.nextTick(() => cb(fakeRes));
          }
        } else if (typeof optionsOrCb === "function") {
          process.nextTick(() => optionsOrCb(fakeRes));
        } else if (cb) {
          process.nextTick(() => cb(fakeRes));
        }

        process.nextTick(() => fakeRes.emit("data", "fake image content"));
        process.nextTick(() => fakeRes.emit("end"));
        return req;
      },
    );

    const result: string = await saveAvatarFromUrl(stablePhotoURL, userId);
    expect(result).toMatch(/uploads\/users\/avatars\/avatar_/);
  });

  it("should reject if the HTTP request fails", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    vi.spyOn(https, "get").mockImplementation(
      (
        url: string | URL | RequestOptions,
        optionsOrCb?: RequestOptions | ((res: IncomingMessage) => void),
        cb?: (res: IncomingMessage) => void,
      ): ClientRequest => {
        const req = new EventEmitter() as ClientRequest;
        process.nextTick(() => req.emit("error", new Error("Request failed")));
        return req;
      },
    );

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Request failed");
  });

  it("should reject if the status code is not 200", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    const fakeRes: IncomingMessage = createMockIncomingMessage(404);

    vi.spyOn(https, "get").mockImplementation(
      (
        url: string | URL | RequestOptions,
        optionsOrCb?: RequestOptions | ((res: IncomingMessage) => void),
        cb?: (res: IncomingMessage) => void,
      ): ClientRequest => {
        const req = new EventEmitter() as ClientRequest;

        if (typeof url === "string" || url instanceof URL) {
          if (typeof optionsOrCb === "function") {
            process.nextTick(() => optionsOrCb(fakeRes));
          } else if (cb) {
            process.nextTick(() => cb(fakeRes));
          }
        } else if (typeof optionsOrCb === "function") {
          process.nextTick(() => optionsOrCb(fakeRes));
        } else if (cb) {
          process.nextTick(() => cb(fakeRes));
        }

        process.nextTick(() => fakeRes.emit("end"));
        return req;
      },
    );

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Failed to get image, status code: 404");
  });

  it("should handle file write errors", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    const fakeRes: IncomingMessage = createMockIncomingMessage(200);

    vi.spyOn(https, "get").mockImplementation(
      (
        url: string | URL | RequestOptions,
        optionsOrCb?: RequestOptions | ((res: IncomingMessage) => void),
        cb?: (res: IncomingMessage) => void,
      ): ClientRequest => {
        const req = new EventEmitter() as ClientRequest;

        if (typeof url === "string" || url instanceof URL) {
          if (typeof optionsOrCb === "function") {
            process.nextTick(() => optionsOrCb(fakeRes));
          } else if (cb) {
            process.nextTick(() => cb(fakeRes));
          }
        } else if (typeof optionsOrCb === "function") {
          process.nextTick(() => optionsOrCb(fakeRes));
        } else if (cb) {
          process.nextTick(() => cb(fakeRes));
        }

        process.nextTick(() => fakeRes.emit("data", "fake image content"));
        process.nextTick(() => fakeRes.emit("end"));
        return req;
      },
    );

    const mockWriteStream = new Writable({
      write(chunk, encoding, callback) {
        callback(new Error("Write error"));
      },
    }) as unknown as WriteStream;

    mockWriteStream.close = vi.fn();
    mockWriteStream.bytesWritten = 0;
    mockWriteStream.path = "mockPath";
    mockWriteStream.pending = false;

    const createWriteStreamSpy = vi.spyOn(fs, "createWriteStream").mockReturnValue(mockWriteStream);

    await expect(saveAvatarFromUrl(stablePhotoURL, userId)).rejects.toThrow("Write error");
    createWriteStreamSpy.mockRestore();
  });

  it("should save the image with a different extension", async () => {
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    const fakeRes: IncomingMessage = createMockIncomingMessage(200);

    vi.spyOn(https, "get").mockImplementation(
      (
        url: string | URL | RequestOptions,
        optionsOrCb?: RequestOptions | ((res: IncomingMessage) => void),
        cb?: (res: IncomingMessage) => void,
      ): ClientRequest => {
        const req = new EventEmitter() as ClientRequest;

        if (typeof url === "string" || url instanceof URL) {
          if (typeof optionsOrCb === "function") {
            process.nextTick(() => optionsOrCb(fakeRes));
          } else if (cb) {
            process.nextTick(() => cb(fakeRes));
          }
        } else if (typeof optionsOrCb === "function") {
          process.nextTick(() => optionsOrCb(fakeRes));
        } else if (cb) {
          process.nextTick(() => cb(fakeRes));
        }

        process.nextTick(() => fakeRes.emit("data", "fake image content"));
        process.nextTick(() => fakeRes.emit("end"));
        return req;
      },
    );

    const result: string = await saveAvatarFromUrl(stablePhotoURL, userId, "png");
    expect(result).toMatch(/uploads\/users\/avatars\/avatar_.*.png/);
  });
});
