import { Log } from "../models/logModel.js";
import { logLevels } from "../utils/enums/logLevel.js";

/**
 * Retrieves logs from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing log retrieval details.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with logs or error message.
 */
const getLogs = async (req, res) => {
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
const createLog = async ({ message, userId, level }) => {
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
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The ID of the log to delete.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success message or error message.
 */
const deleteLog = async (req, res) => {
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
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success message or error message.
 */
const deleteAllLogs = async (req, res) => {
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
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with log levels.
 */
const getLoglevels = (req, res) => {
  res.status(200).json({ logLevels: Object.values(logLevels) });
};

export { getLogs, createLog, deleteLog, deleteAllLogs, getLoglevels };
