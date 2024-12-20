import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @route GET /list
 * @description Retrieves a list of all users.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.get("/list", verifyToken({ role: "admin" }), getUsers);

/**
 * @route GET /:id
 * @description Retrieves a single user by their ID.
 */
router.get("/:id", getUser);

/**
 * @route POST /new
 * @description Creates a new user with the provided data.
 */
router.post("/new", createUser);

/**
 * @route PUT /:id
 * @description Updates an existing user by their ID.
 * @param {string} id - The ID of the user to update.
 */
router.put("/:id", updateUser);

/**
 * @route DELETE /:id
 * @description Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 */
router.delete("/:id", deleteUser);

export default router;
