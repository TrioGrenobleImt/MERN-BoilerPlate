import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import sharp from "sharp";

const getRandomHexColor = (): string => {
  const min = 0; // min = sombre (0 = noir)
  const max = 225; // max = clair (255 = blanc)

  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

export const generateRandomAvatar = async (userId: mongoose.Types.ObjectId): Promise<string> => {
  const size = 256;
  const gridSize = 5;
  const squareSize = size / gridSize;

  const backgroundColor = "#ffffff";
  const primaryColor = getRandomHexColor();

  // Génère la moitié gauche de la grille
  const grid: number[][] = [];
  for (let row = 0; row < gridSize; row++) {
    const rowData: number[] = [];
    for (let col = 0; col < Math.ceil(gridSize / 2); col++) {
      rowData.push(Math.random() > 0.5 ? 1 : 0);
    }
    grid.push(rowData);
  }

  // Génère le SVG avec miroir droite
  let squares = "";
  grid.forEach((rowData, row) => {
    // Crée la ligne complète avec miroir
    const fullRow = [...rowData, ...rowData.slice(0, Math.floor(gridSize / 2)).reverse()];
    fullRow.forEach((cell, col) => {
      if (cell) {
        squares += `
          <rect 
            x="${col * squareSize}" 
            y="${row * squareSize}" 
            width="${squareSize}" 
            height="${squareSize}" 
            fill="${primaryColor}" />
        `;
      }
    });
  });

  const svgImage = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" />
      ${squares}
    </svg>
  `;

  const svgBuffer = Buffer.from(svgImage);

  // Chemin
  const filename = `avatar_${userId}_${Date.now()}.png`;
  const folderPath = path.join(process.cwd(), "uploads", "users", "avatars");
  const fullPath = path.join(folderPath, filename);

  fs.mkdirSync(folderPath, { recursive: true });
  await sharp(svgBuffer).png().toFile(fullPath);

  // Chemin relatif pour url
  const relativePath = path.relative(path.join(process.cwd(), "uploads"), fullPath);
  return path.join("/uploads", relativePath).replace(/\\/g, "/"); // Windows-proof
};
