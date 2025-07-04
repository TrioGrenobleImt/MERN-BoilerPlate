import { describe, expect, it, vi } from "vitest";
import { generateAccessToken } from "../../../src/utils/generateAccessToken";
import mongoose from "mongoose";

describe("Generate access token method", () => {
  it("should return an error if the access token secret is not specified", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation({} as any);
    const consoleErrorSpy = vi.spyOn(console, "error");

    delete process.env.SECRET_ACCESS_TOKEN;

    generateAccessToken(new mongoose.Types.ObjectId());

    expect(consoleErrorSpy).toHaveBeenCalledWith("Please specify the access token secret in the .env file.");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
