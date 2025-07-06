import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { userRoles } from "../utils/enums/userRoles.js";
import { createLog } from "./logController.js";
import fs from "fs";
import path from "path";
import { generateRandomPassword } from "../utils/generateRandomPassword.js";
import { authTypes } from "../utils/enums/authTypes.js";
import { generateRandomAvatar } from "../utils/generateRandomAvatar.js";
import { logLevels } from "../utils/enums/logLevels.js";
import { Constants } from "../constants/constants.js";

/**
 * @function getUsers
 * @description Retrieves all users sorted by creation date.
 * @returns {Object} JSON response with a list of users or error message.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const size = parseInt(req.query.size as string);
  const page = parseInt(req.query.page as string);

  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size);

    const count = await User.countDocuments();

    res.status(200).json({ users, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function createUser
 * @description Creates a new user with the provided details.
 * @returns {Object} JSON response with user details or error message.
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, forename, email, username, password, role } = req.body;
  const userId = req.userId;

  if (!email || !username || !password || !name || !forename) {
    res.status(400).json({ error: "server.global.errors.missing_fields" });
    return;
  }

  try {
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    const existingUserByUsername = await User.findOne({ username: username.toLowerCase() });

    if (existingUserByEmail) {
      res.status(409).json({ error: "server.users.errors.email_taken" });
      return;
    }
    if (existingUserByUsername) {
      res.status(409).json({ error: "server.users.errors.username_taken" });
      return;
    }

    if (role && !Object.values(userRoles).includes(role)) {
      res.status(400).json({ error: "server.users.errors.invalid_role" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      role,
      name,
      forename,
    });

    const avatarPath = await generateRandomAvatar(user._id);
    user.avatar = `${req.protocol}://${req.get("host")}${avatarPath}`;
    await user.save();

    const userObj = user.toObject();
    const { password: _password, ...userWithoutPassword } = userObj;

    createLog({
      message: `User '${username}' created successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    res.status(201).json({ user: userWithoutPassword, message: "server.users.messages.user_created" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function updateUser
 * @description Updates a user's details by ID.
 * @returns {Object} JSON response with updated user details or error message.
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, forename, email, username, password, role } = req.body;

  try {
    if (email) {
      const existingUserByEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
      console.log(email.toLowerCase());
      if (existingUserByEmail) {
        res.status(409).json({ error: "server.users.errors.email_taken" });
        return;
      }
    }

    if (username) {
      const existingUserByUsername = await User.findOne({ username: username.toLowerCase(), _id: { $ne: id } });
      if (existingUserByUsername) {
        res.status(409).json({ error: "server.users.errors.username_taken" });
        return;
      }
    }

    const actionUser = await User.findById(userId);

    if (actionUser.role == userRoles.ADMIN) {
      if (role && !Object.values(userRoles).includes(role)) {
        res.status(400).json({ error: "server.users.errors.invalid_role" });
        return;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
      }

      createLog({
        message: `User '${username}' updated successfully`,
        userId: userId,
        level: logLevels.INFO,
      });
    } else {
      delete req.body.role;
      delete req.body.password;
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
        ...(req.body.email && { email: req.body.email.toLowerCase() }),
        ...(req.body.username && { username: req.body.username.toLowerCase() }),
      },
      { new: true },
    );
    if (!user) {
      res.status(404).json({ error: "server.global.errors.no_such_user" });
      return;
    }

    const userObj = user.toObject();
    const { password: _password, ...userWithoutPassword } = userObj;

    res.status(200).json({ user: userWithoutPassword, message: "server.users.messages.user_updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteUser
 * @description Deletes a user by ID.
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      res.status(400).json({ error: "server.global.errors.no_such_user" });
      return;
    }

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    createLog({
      message: `User '${user.username}' deleted successfully`,
      userId: req.userId,
      level: logLevels.INFO,
    });

    res.status(200).json({ user, message: "server.users.messages.user_deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function generateUserPassword
 * @description Generates a random password.
 * @returns {Object} JSON response with generated password.
 */
export const generateUserPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "pages.admin.users_page.form.password_generated", password: generateRandomPassword() });
};

/**
 * @function updatePassword
 * @description Updates the password of a user by ID.
 * @param {string} req.params.id - The ID of the user whose password is being updated.
 * @param {string} req.body.currentPassword - The user's current password.
 * @param {string} req.body.newPassword - The new password.
 * @param {string} req.body.newPasswordConfirm - Confirmation of the new password.
 * @returns {Object} JSON response with success message or error message.
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    const user = await User.findById(id).select("+password");
    if (!user) {
      res.status(400).json({ error: "server.global.errors.no_such_user" });
      return;
    }

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      res.status(400).json({ error: "server.global.errors.missing_fields" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "server.users.errors.actual_password_incorrect" });
      return;
    }

    if (!Constants.REGEX_PASSWORD.test(newPassword)) {
      res.status(400).json({
        error: "server.users.errors.regex_error",
      });
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      res.status(400).json({ error: "server.users.errors.passwords_do_not_match" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: id }, { password: hashedPassword });

    res.status(200).json({ message: "server.users.messages.password_updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteAccount
 * @description Deletes a user account by ID after verifying the password.
 * @param {string} req.body.password - The user's password for account deletion.
 * @returns {Object} JSON response with success or error message.
 */
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { password } = req.body;

  try {
    if (!password) {
      res.status(400).json({ error: "server.global.errors.missing_fields" });
      return;
    }

    const user = await User.findById(userId).select("+password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "server.users.errors.password_incorrect" });
      return;
    }

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    createLog({
      message: `User '${user.username}' deleted their account`,
      userId: userId,
      level: logLevels.INFO,
    });

    await User.findByIdAndDelete(userId);
    res.clearCookie("__access__token");

    res.status(200).json({ message: "server.users.messages.user_deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/** * @function getAuthTypesStat
 * @description Retrieves statistics on the number of users per authentication type.
 * @returns {Object} JSON response with statistics formatted for chart display.
 */
export const getAuthTypesStat = async (req: Request, res: Response): Promise<void> => {
  const validAuthTypes = Object.values(authTypes);

  try {
    const users = await User.find({ auth_type: { $in: validAuthTypes } });

    // Intitialize stats object with valid auth types
    const stats = {};
    validAuthTypes.forEach((type) => {
      stats[type] = 0;
    });

    // Count users per auth type
    users.forEach((user) => {
      stats[user.auth_type]++;
    });

    // Transform stats into chart data format
    const chartData = {
      data: Object.entries(stats).map(([type, count]) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
      })),
    };

    res.status(200).json(chartData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
