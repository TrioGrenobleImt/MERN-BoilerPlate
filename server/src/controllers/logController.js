import Log from "../models/logModel.js";
import { logLevels } from "../utils/enums/logLevel.js";

const getLogs = async (req, res) => {
  const { size } = req.body;
  try {
    const query = Log.find({}).populate("user", "-password").sort({ createdAt: -1 });

    if (size && !isNaN(size)) {
      query.limit(Number(size));
    }

    const logs = await query;

    res.status(200).json({ logs, message: "Logs retrieved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const deleteAllLogs = async (req, res) => {
  try {
    await Log.deleteMany();
    res.status(200).json({ message: "All logs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLoglevels = (req, res) => {
  res.status(200).json({ logLevels: Object.values(logLevels) });
};

export { getLogs, createLog, deleteLog, deleteAllLogs, getLoglevels };
