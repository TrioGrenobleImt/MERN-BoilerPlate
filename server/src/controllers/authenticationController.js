import User from "../models/userModel.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
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
    const user = await User.create({ email, username, password: hashedPassword });
    const accessToken = generateAccessToken(user._id);

    res.cookie("__access__token", accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(201).json({ user: user, message: "Registered succesfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

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
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie("__access__token", accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword, message: "Logged in succesfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("__access__token");
    res.status(200).json({ message: "Signed out succesfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getConnectedUser = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "The ID user is invalid" });
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
