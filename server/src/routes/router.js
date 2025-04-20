import express from "express";
import { authRouter } from "./authenticationRoutes.js";
import { logRouter } from "./logsRoutes.js";
import { userRouter } from "./usersRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import { configRouter } from "./configRoute.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = new express.Router();

// API routes
router.use("/api/users", userRouter); // User-related routes
router.use("/api/auth", authRouter); // Authentication routes
router.use("/api/logs", logRouter); // Logging routes
router.use("/api/config", configRouter); // Config routes

// UPLOADS routes
router.use("/api/uploads", uploadRouter); // File upload routes
router.use("/uploads", express.static(path.join(__dirname, "../../uploads"))); // Serve uploaded files

/**
 * @route GET /api/ping
 * @description Healthcheck to check if the server is running.
 * @access Public
 * @returns {object} Returns a JSON object with a message property indicating the server is running.
 */
router.get("/api/ping", (req, res) => {
  return res.status(200).json({ message: "The server is running!" });
});

/**
 * @route ALL *
 * @description Handles all other routes and returns a 404 error if the route is not found.
 * @access Public
 * @returns {object} Returns a JSON object with an error property indicating the route was not found.
 */
router.use("/", (req, res) => {
  return res.status(404).json({ error: `The requested route ${req.originalUrl} was not found` });
});
