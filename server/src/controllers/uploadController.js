import { User } from "../models/userModel.js";
import fs from "fs";
import path from "path";
import { Constants } from "../../constants/constants.js";

/**
 * @function updateUserAvatar
 * @description Updates the avatar of a user by uploading a new file, validating the file type and size,
 * and replacing the old avatar if it exists.
 * @param {string} req.params.id - The ID of the user whose avatar is being updated.
 * @param {Object} req.file - The uploaded file containing the user's new avatar.
 * @returns {Object} JSON response with success or error message.
 */
export const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!req.file) {
      return res.status(400).json({ error: "server.upload.errors.no_file" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "server.upload.errors.invalid_file_type" });
    }

    if (req.file.size > Constants.AVATAR_MAX_SIZE) {
      return res.status(400).json({ error: `server.upload.errors.limit` });
    }

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const newAvatarUrl = `${req.protocol}://${req.get("host")}/uploads/users/avatars/${req.file.filename}`;

    user.avatar = newAvatarUrl;
    await user.save();

    res.status(200).json({
      message: "server.upload.messages.avatar_success",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred during file upload" });
  }
};
