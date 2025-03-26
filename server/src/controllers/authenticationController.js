import User from "../models/userModel.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Constants } from "../../constants/constants.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevel.js";

/**
 * Registers a new user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user details.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.username - User's username.
 * @param {string} req.body.password - User's password.
 * @param {string} req.body.confirmPassword - Confirmation of user's password.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with user details or error message.
 */
const register = async (req, res) => {
  const { name, forename, email, username, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword || !name || !forename) {
    return res.status(422).json({ error: "Missing fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: "This email is already taken" });
    } else if (await User.findOne({ username })) {
      return res.status(409).json({ error: "This username is already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword, name, forename });
    const accessToken = generateAccessToken(user._id);

    res.cookie("__access__token", accessToken, {
      maxAge: Constants.MAX_AGE,
      httpOnly: true,
    });

    createLog({
      message: `New user registered successfully`,
      userId: user._id,
      level: logLevels.INFO,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword, message: "Registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Logs in a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login details.
 * @param {string} req.body.username - User's username.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with user details or error message.
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ error: "Missing fields" });
  }

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createLog({
        message: `Invalid credentials while trying to login`,
        userId: user._id,
        level: logLevels.ERROR,
      });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie("__access__token", accessToken, {
      maxAge: Constants.MAX_AGE,
      httpOnly: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    createLog({
      message: `User logged in successfully`,
      userId: user._id,
      level: logLevels.INFO,
    });

    res.status(201).json({ user: userWithoutPassword, message: "Logged in successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Logs out a user by clearing the access token cookie.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success message.
 */
const logout = async (req, res) => {
  try {
    res.clearCookie("__access__token");
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves the currently connected user's details.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.userId - User ID extracted from the token.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with user details or error message.
 */
const getConnectedUser = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "The user ID is invalid" });
  }

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { login, register, logout, getConnectedUser };
