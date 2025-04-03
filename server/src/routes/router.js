import express from "express";
import { authRouter } from "./authenticationRoutes.js";
import { logRouter } from "./logsRoutes.js";
import { userRouter } from "./usersRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = new express.Router();

//API routes
router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/logs", logRouter);

//UPLOADS routes
router.use("/api/uploads", uploadRouter);
router.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

/**
 * Healthcheck
 * @route GET /api/ping
 * @desc Check if the server is running
 * @access Public
 * @returns {object} Returns a JSON object with a message property indicating the server is running
 */
router.get("/api/ping", (req, res) => {
  return res.status(200).json({ message: "The server is running!" });
});

/**
 * Handle errors
 * @route ALL *
 * @desc Handle all other routes and return a 404 error
 * @access Public
 * @returns {object} Returns a JSON object with an error property indicating the route was not found
 */
router.use("/", (req, res) => {
  return res.status(404).json({ error: `The requested route ${req.originalUrl} was not found` });
});
