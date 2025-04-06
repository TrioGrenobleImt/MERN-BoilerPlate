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
 * Retrieves a single user by ID.
 *
 * @param {Object} req - The request object containing user ID in params.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the user to retrieve.
 * @param {Object} res - The response object for sending results or errors.
 * @returns {Object} JSON response with user details or error message.
 */
const getUser = async (req, res) => {
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
 * Retrieves all users sorted by creation date.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object for sending results or errors.
 * @returns {Object} JSON response with a list of users or error message.
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new user with the provided details.
 *
 * @param {Object} req - The request object containing user data in body.
 * @param {Object} req.body - Request body containing user details.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.name - User's name.
 * @param {string} req.body.forename - User's forename.
 * @param {string} req.body.username - User's username.
 * @param {string} req.body.password - User's password.
 * @param {string} [req.body.role] - Optional. User's role.
 * @param {Object} res - The response object for sending results or errors.
 * @returns {Object} JSON response with user details or error message.
 */
const createUser = async (req, res) => {
  const { name, forename, email, username, password, role } = req.body;
  const userId = req.userId;

  // Check for missing fields
  if (!email || !username || !password || !name || !forename) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Check if email or username is already taken
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail) {
      return res.status(409).json({ error: "Email already taken" });
    }

    if (existingUserByUsername) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Validate role
    if (role && !Object.values(userRoles).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({ email, username, password: hashedPassword, role, name, forename });

    // Remove password from the response
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
 * Updates a user's details by ID.
 *
 * @param {Object} req - The request object containing user ID in params and updated data in body.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} req.body - Request body containing updated user details.
 * @param {string} [req.body.email] - Updated email address.
 * @param {string} [req.body.name] - Updated name.
 * @param {string} [req.body.forename] - Updated forename.
 * @param {string} [req.body.username] - Updated username.
 * @param {string} [req.body.password] - Updated password.
 * @param {string} [req.body.role] - Updated role.
 * @param {Object} res - The response object for sending results or errors.
 * @returns {Object} JSON response with updated user details or error message.
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, forename, email, username, password, role } = req.body;

  try {
    // Check if email or username is already taken by another user
    if (email) {
      const existingUserByEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingUserByEmail) {
        return res.status(409).json({ error: "Email already taken" });
      }
    }

    if (username) {
      const existingUserByUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUserByUsername) {
        return res.status(409).json({ error: "Username already taken" });
      }
    }

    const actionUser = await User.findById(userId);

    if (actionUser.role == userRoles.ADMIN) {
      // Validate role
      if (role && !Object.values(userRoles).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Hash the password if it's being updated
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
      }
    } else {
      delete req.body.role;
      delete req.body.password;
    }

    // Update the user
    const user = await User.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }

    // Remove password from the response
    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({ user: userWithoutPassword, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes a user by ID.
 *
 * @param {Object} req - The request object containing user ID in params.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} res - The response object for sending results or errors.
 * @returns {Object} JSON response with success message or error message.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    //Delete avatar if exists
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

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

const generateUserPassword = async (req, res) => {
  res.status(200).json({ message: "Password generated successfully", password: generateRandomPassword() });
};

const updatePassword = async (req, res) => {
  const { id } = req.params;

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    console.log(id);
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Actual password is incorrect" });
    }

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

const deleteAccount = async (req, res) => {
  const userId = req.userId;
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findById(userId).select("+password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    await User.findByIdAndDelete(userId);

    //Delete avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "users", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    res.clearCookie("__access__token");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createUser, getUsers, getUser, updateUser, deleteUser, generateUserPassword, updatePassword, deleteAccount };
