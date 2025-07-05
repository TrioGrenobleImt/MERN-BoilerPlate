import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createServer } from "http";
import { app } from "../src/app.js";
import { initServer } from "../src/server.js";
import { connectToDatabase } from "../src/database/connectToDB.js";

// Mock the database connection function
vi.mock("../src/database/connectToDB.js", () => ({
  connectToDatabase: vi.fn(),
}));

describe("Server Tests", () => {
  let httpServer;

  beforeEach(() => {
    httpServer = createServer(app);
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.PORT;
    httpServer.close();
  });

  it("should connect to the database on server start", () => {
    expect(connectToDatabase).toHaveBeenCalled();
  });

  it("should log an error and exit if PORT is not specified", () => {
    delete process.env.PORT;

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("fake exit");
    });
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      initServer();
    }).toThrow("fake exit");

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Please specify the port number for the HTTP server"));
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    logSpy.mockRestore();
  });
});
