// vitest.setup.ts
import fs from "fs";
import path from "path";
import { afterAll } from "vitest";

// Utiliser un chemin absolu basé sur __dirname
const uploadsDir = path.resolve(__dirname, "uploads/users/avatars");

afterAll(() => {
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach((file) => {
      if (file !== ".gitkeep") {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
    });
  }
});
