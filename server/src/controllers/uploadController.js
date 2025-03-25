import User from "../models/userModel.js";

import fs from "fs";
import path from "path";

const getDefaultAvatar = async (req, res) => {
  const color = decodeURIComponent(req.query.color);
  const svg = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}" />
      <circle cx="50" cy="40" r="15" fill="white" />
      <rect x="30" y="60" width="40" height="25" rx="10" fill="white" />
      </svg>
      `;
  res.set("Content-Type", "image/svg+xml");
  res.send(svg);
};

const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // On récupère l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Supprimer l'ancienne image si elle existe
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // On enregistre la nouvelle URL de l'avatar
    const newAvatarUrl = `${req.protocol}://${req.get("host")}/uploads/users/avatars/${req.file.filename}`;

    user.avatar = newAvatarUrl;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred during file upload." });
  }
};

export { getDefaultAvatar, updateUserAvatar };
