import express, { Router } from "express";
import { getConnectedUser, login, logout, register, signInWithGoogle } from "../controllers/authenticationController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authRouter: Router = express.Router();
/**
 * @route POST /login
 * @description Authenticates a user with their credentials (e.g., email and password).
 */
authRouter.post("/login", login);

/**
 * @route POST /google
 * @description Authenticates a user using Google OAuth.
 * @body {Object} - Contains user details like name, email, and photoURL.
 */
authRouter.post("/login/google", signInWithGoogle);

/**
 * @route POST /register
 * @description Registers a new user with the provided details.
 */
authRouter.post("/register", register);

/**
 * @route GET /logout
 * @description Logs out the currently authenticated user.
 * @middleware verifyToken() - Ensures the user is authenticated before logging out.
 */
authRouter.get("/logout", verifyToken(), logout);

/**
 * @route GET /me
 * @description Fetches the currently authenticated user's information.
 * @middleware verifyToken() - Ensures the user is authenticated by validating the JWT token.
 */
authRouter.get("/me", verifyToken(), getConnectedUser);
