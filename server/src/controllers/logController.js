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

export { getLogs, createLog };
