import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createServer } from "http";
import { io as clientIO } from "socket.io-client";
import { app } from "../../../src/app";
import { initSockets } from "../../../src/sockets/socket";

describe("Socket Server", () => {
  let httpServer;
  let io;
  let clientSocket;
  const PORT = 4000;

  beforeEach(async () => {
    httpServer = createServer(app);
    io = initSockets(httpServer);

    await new Promise((resolve) => httpServer.listen(PORT, resolve));
    console.log(`Test server started on port ${PORT}`);
  });

  afterEach(async () => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    io.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  it("should add user to userSocketMap on connection with userId", async () => {
    clientSocket = clientIO(`http://localhost:${PORT}`, {
      transports: ["websocket"], // Force WebSocket
      query: { userId: "testUserId" },
    });

    await new Promise<void>((resolve, reject) => {
      clientSocket.on("connect", () => {
        expect(clientSocket.connected).toBe(true);
        resolve();
      });

      clientSocket.on("connect_error", (err) => {
        reject(err);
      });
    });
  });
});
