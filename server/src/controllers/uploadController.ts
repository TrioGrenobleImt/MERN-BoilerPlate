import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../models/userModel";
import { Constants } from "../constants/constants";

/**
 * @function updateUserAvatar
 * @description Updates the avatar of a user by uploading a new file, validating the file type and size,
 * and replacing the old avatar if it exists.
 * @param {string} req.params.id - The ID of the user whose avatar is being updated.
 * @param {Object} req.file - The uploaded file containing the user's new avatar.
 * @returns {Object} JSON response with success or error message.
 */
export const updateUserAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({ error: "server.global.errors.no_such_user" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "server.upload.errors.no_file" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({ error: "server.upload.errors.invalid_file_type" });
      return;
    }

    if (req.file.size > Constants.AVATAR_MAX_SIZE) {
      res.status(400).json({ error: `server.upload.errors.limit` });
      return;
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
