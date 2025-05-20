import { User } from "../models/userModel.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import bcrypt from "bcryptjs";
import { Constants } from "../../constants/constants.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevel.js";

/**
 * Registers a new user.
 *
 * @param {Object} userData - Data for the user registration.
 * @param {string} userData.email - User's email address.
 * @param {string} userData.username - User's username.
 * @param {string} userData.password - User's password.
 * @param {string} userData.confirmPassword - Confirmation of user's password.
 * @returns {Object} JSON response with user details or error message.
 */
export const register = async (req, res) => {
  const { name, forename, email, username, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword || !name || !forename) {
    return res.status(422).json({ error: "server.global.errors.missing_fields" });
  }

  if (!Constants.REGEX_PASSWORD.test(password)) {
    return res.status(400).json({
      error: "server.auth.errors.regex",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "server.auth.errors.password_no_match" });
  }

  try {
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ error: "server.auth.errors.email_taken" });
    } else if (await User.findOne({ username: username.toLowerCase() })) {
      return res.status(409).json({ error: "server.auth.errors.username_taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
      forename,
    });


    const userCount = await User.countDocuments();
    if (userCount === 1) {
      user.role = "admin";
      await user.save();
    }    
    
    const accessToken = generateAccessToken(user._id);

    res.cookie("__access__token", accessToken, {
      maxAge: Constants.MAX_AGE,
      httpOnly: true,
    });

    createLog({
      message: `New user ${user.username} registered successfully`,
      userId: user._id,
      level: logLevels.INFO,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.register_success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Logs in a user.
 *
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.username - User's username.
 * @param {string} credentials.password - User's password.
 * @returns {Object} JSON response with user details or error message.
 */
export const login = async (req, res) => {
  const { username, password, email } = req.body;

  if (!password || (!username && !email)) {
    return res.status(422).json({ error: "server.global.errors.missing_fields" });
  }

  try {
    const user = await User.findOne({
      $or: [...(username ? [{ username: username.toLowerCase() }] : []), ...(email ? [{ email: email.toLowerCase() }] : [])],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "server.global.errors.no_such_user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createLog({
        message: `Invalid credentials while trying to login`,
        userId: user._id,
        level: logLevels.ERROR,
      });
      return res.status(400).json({ error: "server.auth.errors.invalid_credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie("__access__token", accessToken, {
      maxAge: Constants.MAX_AGE,
      httpOnly: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.login_success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Logs out a user by clearing the access token cookie.
 *
 * @returns {Object} JSON response with success message.
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("__access__token");
    res.status(200).json({ message: "server.auth.messages.logout_success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves the currently connected user's details.
 *
 * @param {string} userId - The ID of the connected user, extracted from the token.
 * @returns {Object} JSON response with user details or error message.
 */
export const getConnectedUser = async (req, res) => {
  const id = req.userId;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
