import fs from "fs";
import path from "path";
import sharp from "sharp";

const getRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

export const generateRandomAvatar = async (userId) => {
  const size = 256;

  // Couleurs aléatoires
  const backgroundColor = getRandomHexColor();
  const primaryColor = getRandomHexColor();
  const secondaryColor = getRandomHexColor();

  // Crée une image SVG avec des formes géométriques variées
  const svgImage = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="20" fill="${backgroundColor}" />

      <!-- Ajoute un cercle -->
      <circle cx="${size / 2}" cy="${size / 3}" r="${size / 6}" fill="${primaryColor}" />

      <!-- Ajoute un polygone -->
      <polygon points="${size / 2},${size / 4} ${size / 1.5},${size / 1.8} ${size / 2.5},${size / 1.2}" fill="${secondaryColor}" />

      <!-- Ajoute une ligne brisée -->
      <polyline points="${size / 4},${size / 2} ${size / 2},${size / 2.5} ${size / 1.5},${size / 2}" stroke="${primaryColor}" stroke-width="4" fill="none" />

      <!-- Ajoute un rectangle arrondi -->
      <rect x="${size / 4}" y="${size / 1.5}" width="${size / 2}" height="${size / 6}" rx="10" fill="${secondaryColor}" />
    </svg>
  `;

  const svgBuffer = Buffer.from(svgImage);

  // Prépare les chemins
  const filename = `avatar_${userId}_${Date.now()}.png`;
  const folderPath = path.join(process.cwd(), "uploads", "users", "avatars");
  const fullPath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Convertit le SVG en PNG et sauvegarde le fichier
  await sharp(svgBuffer).toFile(fullPath);

  // Retourne le chemin relatif à partir de /uploads
  const relativePath = path.relative(path.join(process.cwd(), "uploads"), fullPath);
  return path.join("/uploads", relativePath);
};
