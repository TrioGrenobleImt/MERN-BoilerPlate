import User from "../models/userModel.js";
import bcrypt from "bcrypt";

/**
 * Retrieves a single user by ID.
 * @param {Object} req - The request object containing user ID in params.
 * @param {Object} res - The response object for sending results or errors.
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
    console.log("zebni");
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all users sorted by creation date.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object for sending results or errors.
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
 * @param {Object} req - The request object containing user data in body.
 * @param {Object} res - The response object for sending results or errors.
 */
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

/**
 * Updates a user's details by ID.
 * @param {Object} req - The request object containing user ID in params and updated data in body.
 * @param {Object} res - The response object for sending results or errors.
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
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

/**
 * Deletes a user by ID.
 * @param {Object} req - The request object containing user ID in params.
 * @param {Object} res - The response object for sending results or errors.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;
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

export { createUser, getUsers, getUser, updateUser, deleteUser };
