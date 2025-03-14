import express from "express";
import { deleteAllLogs, deleteLog, getLogs, getLoglevels } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @route GET /
 * @description Retrieves all logs.
 * @middleware verifyToken - Ensures the user is authenticated and has the 'admin' role.
 */
router.get("/", verifyToken({ role: "admin" }), getLogs);

/**
 * @route GET /log-levels
 * @description Retrieves all available log levels.
 * @middleware verifyToken - Ensures the user is authenticated and has the 'admin' role.
 */
router.get("/log-levels", verifyToken({ role: "admin" }), getLoglevels);

/**
 * @route DELETE /:id
 * @description Deletes a specific log by ID.
 * @middleware verifyToken - Ensures the user is authenticated and has the 'admin' role.
 */
router.delete("/:id", verifyToken({ role: "admin" }), deleteLog);

/**
 * @route DELETE /
 * @description Deletes all logs.
 * @middleware verifyToken - Ensures the user is authenticated and has the 'admin' role.
 */
router.delete("/", verifyToken({ role: "admin" }), deleteAllLogs);

export default router;
