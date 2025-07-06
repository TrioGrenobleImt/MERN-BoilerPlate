import { Request, Response } from "express";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevels.js";
import { Config } from "../models/configModel.js";

/**
 * Gets configuration settings based on provided keys.
 * @returns {Object} JSON response with configuration settings.
 */
export const getConfig = async (req: Request, res: Response): Promise<void> => {
  const raw = req.query.keys as string | string[] | undefined;
  const keys = Array.isArray(raw) ? raw.flatMap((k) => k.split(",")) : (raw?.split(",") ?? []);

  try {
    const configItems = await Config.find({ key: { $in: keys } });
    res.status(200).json({ config: configItems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Updates configuration settings based on provided keys and values.
 * @returns {Object} JSON response with updated configuration settings.
 */
export const updateConfig = async (req: Request, res: Response): Promise<void> => {
  const { keys, config } = req.body;

  if (!Array.isArray(keys) || typeof config !== "object" || config === null) {
    createLog({
      level: logLevels.ERROR,
      message: "Invalid configuration update request",
      userId: req.userId,
    });
    res.status(400).json({ message: "invalid_config" });
    return;
  }

  try {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
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
        res.status(400).json({ message: `config_not_found` });
        return;
      }
    }

    res.json({ message: "config_updated" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
