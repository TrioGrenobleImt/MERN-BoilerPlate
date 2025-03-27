import express from "express";
import UsersRoutes from "./usersRoutes.js";
import AuthenticationRoutes from "./authenticationRoutes.js";
import LogsRoutes from "./logsRoutes.js";
import UploadRoutes from "./uploadRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

//API routes
router.use("/api/users", UsersRoutes);
router.use("/api/auth", AuthenticationRoutes);
router.use("/api/logs", LogsRoutes);

//UPLOADS routes
router.use("/api/uploads", UploadRoutes);
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

export default router;
