import express, { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  generateUserPassword,
  updatePassword,
  deleteAccount,
  getAuthTypesStat,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const userRouter: Router = express.Router();

/**
 * @route GET /
 * @description Retrieves a list of all users.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
userRouter.get("/", verifyToken({ role: "admin" }), getUsers);

/**
 * @route POST /
 * @description Creates a new user with the provided data.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
userRouter.post("/", verifyToken({ role: "admin" }), createUser);

/**
 * @route PUT /:id
 * @description Updates an existing user by their ID.
 * @param {string} id - The ID of the user to update.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
userRouter.put("/:id", verifyToken(), updateUser);

/**
 * @route DELETE /:id
 * @description Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
userRouter.delete("/:id", verifyToken({ role: "admin" }), deleteUser);

/**
 * @route GET /utils/generatePassword
 * @description Generates a random password for the user.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
userRouter.get("/utils/generatePassword", verifyToken({ role: "admin" }), generateUserPassword);

/**
 * @route PUT /:id/password
 * @description Updates the password of the user by their ID.
 * @param {string} id - The ID of the user to update the password for.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
userRouter.put("/:id/password", verifyToken(), updatePassword);

/**
 * @route DELETE /delete/account
 * @description Deletes the account of the currently authenticated user.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
userRouter.delete("/delete/account", verifyToken(), deleteAccount);

/** * @route GET /stats/authTypes
 * @description Retrieves statistics about the different authentication types used by users.
 * @middleware verifyToken("admin") - Ensures the user has an admin role to access this route.
 */
userRouter.get("/stats/authTypes", verifyToken({ role: "admin" }), getAuthTypesStat);
