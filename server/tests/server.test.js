import { vi, expect, beforeEach, afterEach, describe, test } from "vitest";
import app from "../src/app.js";
import { connectToDatabase } from "../src/database/connectToDB.js";

// Mocking connectToDatabase pour éviter de se connecter à une vraie base de données
vi.mock("../src/database/connectToDB.js", () => ({
  connectToDatabase: vi.fn(),
}));

let viSpyConsole;

beforeEach(() => {
  viSpyConsole = vi.spyOn(console, "log").mockImplementation(vi.fn());
});

describe("Server startup", () => {
  let server;

  beforeEach(() => {
    server = {
      listen: vi.fn((port, callback) => {
        // Simulez un démarrage du serveur qui appelle la fonction de callback immédiatement
        callback();
      }),
    };

    app.listen = server.listen;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should connect to the database and start the server", async () => {
    // Importer le fichier serveur après avoir mocké tout ce qui est nécessaire
    await import("../src/server.js");

    // Vérifier que la fonction connectToDatabase a été appelée
    expect(connectToDatabase).toHaveBeenCalledTimes(1);

    // Vérifier que `app.listen` a été appelée avec le bon port
    expect(server.listen).toHaveBeenCalledWith(process.env.PORT, expect.any(Function));

    // Vérifier que le bon message a été loggé
    expect(viSpyConsole).toHaveBeenCalledWith("Server listening on port", process.env.PORT, "🚀");
  });
});
