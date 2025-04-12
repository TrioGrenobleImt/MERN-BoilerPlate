import express from "express";
import { deleteAllLogs, deleteLog, getLogs, getLoglevels } from "../controllers/logController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const logRouter = new express.Router();

/**
 * @route GET /
 * @description Retrieves all logs.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user is authenticated and has the 'admin' role.
 */
logRouter.get("/", verifyToken({ role: "admin" }), getLogs);

/**
 * @route GET /log-levels
 * @description Retrieves all available log levels.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user is authenticated and has the 'admin' role.
 */
logRouter.get("/log-levels", verifyToken({ role: "admin" }), getLoglevels);

/**
 * @route DELETE /:id
 * @description Deletes a specific log by ID.
 * @param {string} id - The ID of the log to delete.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user is authenticated and has the 'admin' role.
 */
logRouter.delete("/:id", verifyToken({ role: "admin" }), deleteLog);

/**
 * @route DELETE /
 * @description Deletes all logs.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user is authenticated and has the 'admin' role.
 */
logRouter.delete("/", verifyToken({ role: "admin" }), deleteAllLogs);
