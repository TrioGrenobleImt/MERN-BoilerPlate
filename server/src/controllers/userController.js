import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { userRoles } from "../utils/enums/userRoles.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevel.js";

import fs from "fs";
import path from "path";
import { generateRandomPassword } from "../utils/generateRandomPassword.js";
import { Constants } from "../../constants/constants.js";

/**
 * @function getUser
 * @description Retrieves a single user by ID.
 * @returns {Object} JSON response with user details or error message.
 */
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getUsers
 * @description Retrieves all users sorted by creation date.
 * @returns {Object} JSON response with a list of users or error message.
 */
export const getUsers = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);

  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size);

    const count = await User.countDocuments();

    res.status(200).json({ users, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function createUser
 * @description Creates a new user with the provided details.
 * @returns {Object} JSON response with user details or error message.
 */
export const createUser = async (req, res) => {
  const { name, forename, email, username, password, role } = req.body;
  const userId = req.userId;

  if (!email || !username || !password || !name || !forename) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail) return res.status(409).json({ error: "Email already taken" });
    if (existingUserByUsername) return res.status(409).json({ error: "Username already taken" });

    if (role && !Object.values(userRoles).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword, role, name, forename });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    createLog({
      message: `User '${username}' created successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    res.status(201).json({ user: userWithoutPassword, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function updateUser
 * @description Updates a user's details by ID.
 * @returns {Object} JSON response with updated user details or error message.
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, forename, email, username, password, role } = req.body;

  try {
    if (email) {
      const existingUserByEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingUserByEmail) return res.status(409).json({ error: "Email already taken" });
    }

    if (username) {
      const existingUserByUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUserByUsername) return res.status(409).json({ error: "Username already taken" });
    }

    const actionUser = await User.findById(userId);

    if (actionUser.role == userRoles.ADMIN) {
      if (role && !Object.values(userRoles).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
      }
    } else {
      delete req.body.role;
      delete req.body.password;
    }

    const user = await User.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!user) return res.status(404).json({ error: "No such user" });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({ user: userWithoutPassword, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteUser
 * @description Deletes a user by ID.
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) return res.status(400).json({ error: "No such user" });

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    res.status(200).json({ user, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function generateUserPassword
 * @description Generates a random password.
 * @returns {Object} JSON response with generated password.
 */
export const generateUserPassword = async (req, res) => {
  res.status(200).json({ message: "Password generated successfully", password: generateRandomPassword() });
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
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    const user = await User.findById(id).select("+password");
    if (!user) return res.status(400).json({ error: "No such user" });

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Actual password is incorrect" });

    if (!Constants.REGEX_PASSWORD.test(newPassword)) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters, including uppercase, lowercase letters, numbers, and special characters.",
      });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: id }, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteAccount
 * @description Deletes a user account by ID after verifying the password.
 * @param {string} req.body.password - The user's password for account deletion.
 * @returns {Object} JSON response with success or error message.
 */
export const deleteAccount = async (req, res) => {
  const userId = req.userId;
  const { password } = req.body;

  try {
    if (!password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findById(userId).select("+password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password is incorrect" });

    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("__access__token");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
