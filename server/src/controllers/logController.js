import Log from "../models/logModel.js";
import { logLevels } from "../utils/enums/logLevel.js";

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("user", "-password");
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLog = async (req, res) => {
  const { message, userId, level } = req.body;
  if (!message || !userId || !level) {
    return res.status(404).json({ error: "Missing fields" });
  }

  if (!Object.values(logLevels).includes(level)) {
    return res.status(404).json({ error: "Invalid log level" });
  }

  try {
    const log = await Log.create({ message, user: userId, level });
    res.status(200).json({ log, message: "Log created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getLogs, createLog };
