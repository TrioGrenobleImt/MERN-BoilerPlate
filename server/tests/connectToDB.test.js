import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import sinon from "sinon";
import mongoose from "mongoose";
import { connectToDatabase } from "../src/database/connectToDB";

describe("connectToDatabase", () => {
  let connectStub;

  beforeEach(() => {
    connectStub = sinon.stub(mongoose, "connect");
  });

  afterEach(() => {
    connectStub.restore();
  });

  it("should call mongoose.connect and log success message on successful connection", async () => {
    connectStub.resolves();

    const consoleLogSpy = vi.spyOn(console, "log");

    await connectToDatabase();

    expect(connectStub.calledOnce).toBe(true);
    expect(connectStub.calledWith(process.env.MONG_URI)).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith("Connected to the database 🧰");

    consoleLogSpy.mockRestore();
  });

  it("should call mongoose.connect and log error message on connection failure", async () => {
    const error = new Error("Connection error");
    connectStub.rejects(error);

    const consoleErrorSpy = vi.spyOn(console, "error");

    await connectToDatabase();

    expect(connectStub.calledOnce).toBe(true);
    expect(connectStub.calledWith(process.env.MONG_URI)).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    consoleErrorSpy.mockRestore();
  });
});
