import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { authTypes } from "../utils/enums/authTypes.js";
import { userRoles } from "../utils/enums/userRoles.js";
import { logLevels } from "../utils/enums/logLevels.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { Constants } from "../constants/constants.js";
import { createLog } from "./logController.js";
import { generateRandomAvatar } from "../utils/generateRandomAvatar.js";
import { saveAvatarFromUrl } from "../utils/saveAvatarFromUrl.js";
import bcrypt from "bcryptjs";

/**
 * Registers a new user.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, forename, email, username, photoURL, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword || !name || !forename) {
    res.status(422).json({ error: "server.global.errors.missing_fields" });
    return;
  }

  if (!Constants.REGEX_PASSWORD.test(password)) {
    res.status(400).json({ error: "server.auth.errors.regex" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: "server.auth.errors.password_no_match" });
    return;
  }

  try {
    const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
    if (existingEmailUser) {
      res.status(409).json({ error: "server.auth.errors.email_taken" });
      return;
    }

    const existingUsernameUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUsernameUser) {
      res.status(409).json({ error: "server.auth.errors.username_taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
      forename,
      auth_type: photoURL ? authTypes.GOOGLE : authTypes.LOCAL,
    });

    if (photoURL) {
      try {
        const avatarPath = await saveAvatarFromUrl(photoURL, user._id);
        if (avatarPath) {
          user.avatar = `${req.protocol}://${req.get("host")}${avatarPath}`;
          await user.save();
        }
      } catch (err: any) {
        console.error("Failed to download avatar:", err.message);
      }
    } else {
      const avatarPath = await generateRandomAvatar(user._id);
      user.avatar = `${req.protocol}://${req.get("host")}${avatarPath}`;
      await user.save();
    }

    const userCount = await User.countDocuments();
    if (userCount === 1) {
      user.role = userRoles.ADMIN;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);

    createLog({
      message: `New user ${user.username} registered successfully`,
      userId: user._id,
      level: logLevels.INFO,
    });

    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.register_success", accessToken });
    return;
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return;
  }
};

/**
 * Logs in a user.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;

  if (!password || (!username && !email)) {
    res.status(422).json({ error: "server.global.errors.missing_fields" });
    return;
  }

  try {
    const user = await User.findOne({
      $or: [...(username ? [{ username: username.toLowerCase() }] : []), ...(email ? [{ email: email.toLowerCase() }] : [])],
    }).select("+password");

    if (!user) {
      res.status(400).json({ error: "server.global.errors.no_such_user" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createLog({
        message: `Invalid credentials while trying to login`,
        userId: user._id,
        level: logLevels.ERROR,
      });
      res.status(400).json({ error: "server.auth.errors.invalid_credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id);

    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.login_success", accessToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Logs out a user by clearing the access token cookie.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "server.auth.messages.logout_success" });
};

/**
 * Retrieves the currently connected user's details.
 */
export const getConnectedUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.userId;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Signs in a user using Google OAuth.
 */
export const signInWithGoogle = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(422).json({ error: "server.global.errors.missing_fields" });
    return;
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ error: "User not found, lets register !" });
      return;
    }

    const accessToken = generateAccessToken(user._id);

    res.status(201).json({ user, message: "server.auth.messages.login_success", accessToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
