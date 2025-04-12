import { Log } from "../models/logModel.js";
import { logLevels } from "../utils/enums/logLevel.js";

/**
 * Retrieves logs from the database.
 *
 * @returns {Object} JSON response with logs or error message.
 */
export const getLogs = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);

  try {
    const logs = await Log.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .skip(page * size)
      .limit(size);

    const count = await Log.countDocuments();

    res.status(200).json({ logs, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new log entry.
 *
 * @param {Object} logData - Data for the log entry.
 * @param {string} logData.message - The log message.
 * @param {string} logData.userId - The ID of the user associated with the log.
 * @param {string} logData.level - The log level (e.g., INFO, ERROR).
 */
export const createLog = async ({ message, userId, level }) => {
  if (!message || !userId || !level) {
    console.error("createLog: Missing parameters", { message, userId, level });
    return;
  }

  if (!Object.values(logLevels).includes(level)) {
    console.error("createLog: Invalid log level", { message, userId, level });
    return;
  }

  try {
    await Log.create({ message, user: userId, level });
  } catch (err) {
    console.error("createLog: Error creating log", err);
  }
};

/**
 * Deletes a specific log entry by ID.
 *
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteLog = async (req, res) => {
  const { id } = req.params;

  try {
    const log = await Log.findByIdAndDelete(id);
    if (!log) {
      return res.status(400).json({ error: "No such log" });
    }
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes all log entries from the database.
 *
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteAllLogs = async (req, res) => {
  try {
    await Log.deleteMany();
    res.status(200).json({ message: "All logs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all available log levels.
 *
 * @returns {Object} JSON response with log levels.
 */
export const getLoglevels = (req, res) => {
  res.status(200).json({ logLevels: Object.values(logLevels) });
};
