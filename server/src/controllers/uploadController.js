import { User } from "../models/userModel.js";
import fs from "fs";
import path from "path";
import { Constants } from "../../constants/constants.js";

const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    // On récupère l'utilisateur
    const user = await User.findById(userId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type. Only jpg, jpeg, png, gif, and svg are allowed" });
    }

    if (req.file.size > Constants.AVATAR_MAX_SIZE) {
      return res.status(400).json({ error: `File size exceeds the limit of ${Constants.AVATAR_MAX_SIZE / 1024 / 1024} MB` });
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
    res.status(500).json({ error: "An unexpected error occurred during file upload" });
  }
};

export { updateUserAvatar };
