import { Request, Response } from "express";
import { User } from "../models/userModel.ts";
import { authTypes } from "../utils/enums/authTypes.ts";
import { userRoles } from "../utils/enums/userRoles.ts";
import { logLevels } from "../utils/enums/logLevels.ts";
import { generateAccessToken } from "../utils/generateAccessToken.ts";
import { Constants } from "../constants/constants.ts";
import { createLog } from "./logController.ts";
import { generateRandomAvatar } from "../utils/generateRandomAvatar.ts";
import { saveAvatarFromUrl } from "../utils/saveAvatarFromUrl.ts";
import bcrypt from "bcryptjs";

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
export const register = async (req: Request, res: Response) => {
  const { name, forename, email, username, photoURL, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword || !name || !forename) {
    res.status(422).json({ error: "server.global.errors.missing_fields" });
  }

  if (!Constants.REGEX_PASSWORD.test(password)) {
    res.status(400).json({ error: "server.auth.errors.regex" });
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: "server.auth.errors.password_no_match" });
  }

  try {
    const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
    if (existingEmailUser) {
      res.status(409).json({ error: "server.auth.errors.email_taken" });
    }

    const existingUsernameUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUsernameUser) {
      res.status(409).json({ error: "server.auth.errors.username_taken" });
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

    res.cookie("__access__token", accessToken, {
      maxAge: Constants.MAX_AGE,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    createLog({
      message: `New user ${user.username} registered successfully`,
      userId: user._id,
      level: logLevels.INFO,
    });

    // Delete password from user object before sending response
    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.register_success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// /**
//  * Logs in a user.
//  *
//  * @param {Object} credentials - Login credentials.
//  * @param {string} credentials.username - User's username.
//  * @param {string} credentials.password - User's password.
//  * @returns {Object} JSON response with user details or error message.
//  */
// export const login = async (req, res) => {
//   const { username, password, email } = req.body;

//   if (!password || (!username && !email)) {
//     return res.status(422).json({ error: "server.global.errors.missing_fields" });
//   }

//   try {
//     const user = await User.findOne({
//       $or: [...(username ? [{ username: username.toLowerCase() }] : []), ...(email ? [{ email: email.toLowerCase() }] : [])],
//     }).select("+password");

//     if (!user) {
//       return res.status(400).json({ error: "server.global.errors.no_such_user" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       createLog({
//         message: `Invalid credentials while trying to login`,
//         userId: user._id,
//         level: logLevels.ERROR,
//       });
//       return res.status(400).json({ error: "server.auth.errors.invalid_credentials" });
//     }

//     const accessToken = generateAccessToken(user._id);
//     res.cookie("__access__token", accessToken, {
//       maxAge: Constants.MAX_AGE,
//       httpOnly: true,
//       sameSite: "None",
//       secure: true,
//     });

//     const { password: userPassword, ...userWithoutPassword } = user._doc;

//     res.status(201).json({ user: userWithoutPassword, message: "server.auth.messages.login_success" });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// /**
//  * Logs out a user by clearing the access token cookie.
//  *
//  * @returns {Object} JSON response with success message.
//  */
// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("__access__token");
//     res.status(200).json({ message: "server.auth.messages.logout_success" });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// /**
//  * Retrieves the currently connected user's details.
//  *
//  * @param {string} userId - The ID of the connected user, extracted from the token.
//  * @returns {Object} JSON response with user details or error message.
//  */
// export const getConnectedUser = async (req, res) => {
//   const id = req.userId;

//   try {
//     const user = await User.findById(id);
//     res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// /**
//  * Signs in a user using Google OAuth.
//  *
//  * @param {Object} req - Request object containing user details from Google.
//  * @param {Object} res - Response object to send the result.
//  * @returns {Object} JSON response with user details or error message.
//  */
// export const signInWithGoogle = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(422).json({ error: "server.global.errors.missing_fields" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       // Do not change the error message, this is intentional to redirect to register
//       return res.status(404).json({ error: "User not found, lets register !" });
//     }

//     const accessToken = generateAccessToken(user._id);
//     res.cookie("__access__token", accessToken, {
//       maxAge: Constants.MAX_AGE,
//       httpOnly: true,
//       sameSite: "None",
//       secure: true,
//     });

//     return res.status(201).json({ user, message: "server.auth.messages.login_success" });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
