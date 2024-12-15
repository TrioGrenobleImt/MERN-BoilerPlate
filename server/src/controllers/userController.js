import User from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Get a single user
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "The user ID is invalid" });
  }
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

//Get all the users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a user
const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(404).json({ error: "Missing fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email: email, username: username, password: hashedPassword });

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(200).json({ user: userWithoutPassword, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "The ID user is invalid" });
  }
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }
    res.status(200).json({ user, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "The ID user is invalid" });
  }
  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const user = await User.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }
    res.status(200).json({ user, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
