import { describe, it, expect, beforeEach, afterEach, vi, test } from "vitest";
import { Server } from "socket.io";
import { createServer } from "http";
import { initSockets } from "../../../src/sockets/socket";
import { io as clientIO } from "socket.io-client";

describe("Socket Server", () => {
  let httpServer;
  let io;
  let clientSocket;

  beforeEach(() => {
    httpServer = createServer();
    initSockets(httpServer);
    io = new Server(httpServer);
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.close();
    }
    httpServer.close();
  });

  it("should add user to userSocketMap on connection with userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`, {
      query: { userId: "testUserId" },
    });

    clientSocket.on("connect", () => {
      expect(io.sockets.sockets.get(clientSocket.id)).toBeDefined();
      expect(io.sockets.sockets.get(clientSocket.id).handshake.query.userId).toBe("testUserId");
      done();
    });
  });

  it("should emit 'getOnlineUsers' when a user connects", (done) => {
    if (!clientSocket) {
      console.error("Client socket is not initialized in test");
      done(new Error("Client socket is not initialized"));
      return;
    }

    clientSocket.on("getOnlineUsers", (onlineUsers) => {
      console.log("Received online users:", onlineUsers);
      try {
        expect(onlineUsers).toContain("testUser"); // Check that 'testUser' is in the list of online users
        done(); // Signal that the test has finished
      } catch (error) {
        done(error);
      }
    });

    // Ensure the client socket is connected
    if (clientSocket.connected) {
      // If already connected, manually trigger the getOnlineUsers event for testing purposes
      clientSocket.emit("getOnlineUsers");
    } else {
      clientSocket.connect();
    }
  }, 10000); // Set a timeout of 10 seconds for this test

  it("should not add user to userSocketMap on connection without userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`);

    clientSocket.on("connect", () => {
      expect(io.sockets.sockets.get(clientSocket.id)).toBeDefined();
      expect(io.sockets.sockets.get(clientSocket.id).handshake.query.userId).toBeUndefined();
      done();
    });
  });

  it("should not emit getOnlineUsers on connection without userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`);

    clientSocket.on("getOnlineUsers", () => {
      done(new Error("getOnlineUsers should not be emitted"));
    });

    clientSocket.on("connect", () => {
      setTimeout(() => {
        done();
      }, 100);
    });
  });

  it("should remove user from userSocketMap on disconnect with userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`, {
      query: { userId: "testUserId" },
    });

    clientSocket.on("connect", () => {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(io.sockets.sockets.get(clientSocket.id)).toBeUndefined();
        done();
      }, 100);
    });
  });

  it("should emit getOnlineUsers with correct users on disconnect with userId", (done) => {
    clientSocket = clientIO(`http://localhost:${process.env.PORT}`, {
      query: { userId: "testUserId" },
    });

    clientSocket.on("connect", () => {
      clientSocket.on("getOnlineUsers", (users) => {
        expect(users).not.toContain("testUserId");
        done();
      });
      clientSocket.disconnect();
    });
  });
});
