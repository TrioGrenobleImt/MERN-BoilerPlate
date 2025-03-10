import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @route GET /:id
 * @description Retrieves a single user by their ID.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.get("/:id", verifyToken({ role: "admin" }), getUser);

/**
 * @route GET /
 * @description Retrieves a list of all users.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.get("/", verifyToken({ role: "admin" }), getUsers);

/**
 * @route POST /
 * @description Creates a new user with the provided data.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.post("/", verifyToken({ role: "admin" }), createUser);

/**
 * @route PUT /:id
 * @description Updates an existing user by their ID.
 * @param {string} id - The ID of the user to update.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.put("/:id", verifyToken({ role: "admin" }), updateUser);

/**
 * @route DELETE /:id
 * @description Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.delete("/:id", verifyToken({ role: "admin" }), deleteUser);

export default router;
