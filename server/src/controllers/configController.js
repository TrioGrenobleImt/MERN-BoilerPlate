import { Config } from "../models/configModel.js";
import { logLevels } from "../utils/enums/logLevel.js";
import { createLog } from "./logController.js";

/**
 * Gets configuration settings based on provided keys.
 * @returns {Object} JSON response with configuration settings.
 */
export const getConfig = async (req, res) => {
  const keys = req.query.keys?.split(",") || [];

  try {
    const configItems = await Config.find({ key: { $in: keys } });

    res.status(200).json({ config: configItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates configuration settings based on provided keys and values.
 * @returns {Object} JSON response with updated configuration settings.
 */
export const updateConfig = async (req, res) => {
  const { keys, config } = req.body;

  if (!Array.isArray(keys) || typeof config !== "object" || config === null) {
    return res.status(400).json({ message: "Invalid input format" });
  }

  try {
    for (const key of keys) {
      if (config.hasOwnProperty(key)) {
        await Config.findOneAndUpdate({ key }, { value: config[key] }, { new: true, upsert: true });
        createLog({
          level: logLevels.INFO,
          message: `Configuration updated for key : ${key}`,
          userId: req.userId,
        });
      } else {
        createLog({
          level: logLevels.ERROR,
          message: `Key ${key} not found in config object`,
          userId: req.userId,
        });
        return res.status(400).json({ message: `Key ${key} not found in config object` });
      }
    }

    res.json({ message: "Configuration updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
