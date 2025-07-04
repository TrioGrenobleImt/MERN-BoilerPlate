import { Request, Response } from "express";
import mongoose from "mongoose";
import { Log } from "../models/logModel.js";
import { logLevels } from "../utils/enums/logLevels.js";

/**
 * Retrieves logs from the database.
 *
 * @returns {Object} JSON response with logs or error message.
 */
export const getLogs = async (req: Request, res: Response): Promise<void> => {
  const size = parseInt(req.query.size as string);
  const page = parseInt(req.query.page as string);

  try {
    const logs = await Log.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .skip(page * size)
      .limit(size);

    const count = await Log.countDocuments();

    res.status(200).json({ logs, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

interface CreateLogParams {
  message: string;
  userId: mongoose.Types.ObjectId;
  level: logLevels;
}

/**
 * Creates a new log entry.
 *
 * @param {Object} logData - Data for the log entry.
 * @param {string} logData.message - The log message.
 * @param {string} logData.userId - The ID of the user associated with the log.
 * @param {string} logData.level - The log level (e.g., INFO, ERROR).
 */
export const createLog = async ({ message, userId, level }: CreateLogParams): Promise<void> => {
  try {
    await Log.create({ message, user: userId, level });
  } catch (err: any) {
    console.error("createLog: Error creating log", err);
  }
};

/**
 * Deletes a specific log entry by ID.
 *
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteLog = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const log = await Log.findByIdAndDelete(id);
    if (!log) {
      res.status(400).json({ error: "server.admin.errors.log_not_found" });
      return;
    }
    res.status(200).json({ message: "server.admin.messages.log_deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes all log entries from the database.
 *
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteAllLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    await Log.deleteMany();
    res.status(200).json({ message: "server.admin.messages.logs_cleared" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all available log levels.
 *
 * @returns {Object} JSON response with log levels.
 */
export const getLoglevels = (req: Request, res: Response) => {
  res.status(200).json({ logLevels: Object.values(logLevels) });
};
