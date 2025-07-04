import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import sinon from "sinon";
import mongoose from "mongoose";
import { connectToDatabase } from "../../../src/database/connectToDB";

describe("connectToDatabase", () => {
  let connectStub;

  beforeEach(() => {
    connectStub = sinon.stub(mongoose, "connect");
  });

  afterEach(() => {
    connectStub.restore();
  });

  it("should log an error and exit if MONG_URI is not specified", async () => {
    delete process.env.MONG_URI;

    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`);
    });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(connectToDatabase()).rejects.toThrow("process.exit: 1");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Please specify the MongoDB URI in the .env file.");

    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should call mongoose.connect and log success message on successful connection", async () => {
    process.env.MONG_URI = "mongodb://testuri";
    connectStub.resolves();

    const consoleLogSpy = vi.spyOn(console, "log");

    await connectToDatabase();

    expect(connectStub.calledOnce).toBe(true);
    expect(connectStub.calledWith(process.env.MONG_URI)).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith("Connected to the database 🧰");

    consoleLogSpy.mockRestore();
  });

  it("should call mongoose.connect and log error message on connection failure", async () => {
    process.env.MONG_URI = "mongodb://testuri";
    const error = new Error("Connection error");
    connectStub.rejects(error);

    const consoleErrorSpy = vi.spyOn(console, "error");
    // Mock process.exit pour éviter qu'il kill le process et lancer une erreur à la place
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`);
    });

    // Vérifie que la fonction rejette l'erreur de process.exit
    await expect(connectToDatabase()).rejects.toThrow("process.exit: 1");

    expect(connectStub.calledOnce).toBe(true);
    expect(connectStub.calledWith(process.env.MONG_URI)).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to the database:", error);

    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
