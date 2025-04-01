import { describe, it, expect, beforeEach, afterEach, vi, test } from "vitest";
import { createServer } from "http";
import { initSockets } from "../../../src/sockets/socket";
import { io as clientIO } from "socket.io-client";
import app from "../../../src/app";

describe("Socket Server", () => {
  let httpServer;
  let clientSocket;

  beforeEach(() => {
    httpServer = createServer(app);
    initSockets(httpServer);
  });

  afterEach(() => {
    httpServer.close();
  });

  it("should add user to userSocketMap on connection with userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`, {
      query: { userId: "testUserId" },
    });

    clientSocket.on("connect", () => {
      console.log("Client connected!");
    });

    clientSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    clientSocket.on("connection", () => {
      expect(io.sockets.sockets.get(clientSocket.id)).toBeDefined();
      expect(io.sockets.sockets.get(clientSocket.id).handshake.query.userId).toBe("testUserId2");
      done();
    });
  });
});
