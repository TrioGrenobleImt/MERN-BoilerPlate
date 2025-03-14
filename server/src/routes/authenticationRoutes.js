import express from "express";
import { getConnectedUser, login, logout, register } from "../controllers/authenticationController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @route POST /login
 * @description Authenticates a user with their credentials (e.g., email and password).
 */
router.post("/login", login);

/**
 * @route POST /register
 * @description Registers a new user with the provided details.
 */
router.post("/register", register);

/**
 * @route GET /logout
 * @description Logs out the currently authenticated user.
 */
router.get("/logout", logout);

/**
 * @route GET /me
 * @description Fetches the currently authenticated user's information.
 * @middleware verifyToken - Ensures the user is authenticated by validating the JWT token.
 */
router.get("/me", verifyToken(), getConnectedUser);

export default router;
