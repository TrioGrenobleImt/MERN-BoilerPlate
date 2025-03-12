import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { userRoles } from "../utils/enums/userRoles.js";

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
  const { email, username, password, role } = req.body;

  // Check for missing fields
  if (!email || !username || !password) {
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
    const user = await User.create({ email, username, password: hashedPassword, role });

    // Remove password from the response
    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Updates a user's details by ID.
 * @param {Object} req - The request object containing user ID in params and updated data in body.
 * @param {Object} res - The response object for sending results or errors.
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, role } = req.body;

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

    // Validate role
    if (role && !Object.values(userRoles).includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash the password if it's being updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
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
    res.status(500).json({ error: "Internal Server Error" });
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
