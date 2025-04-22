import { Config } from "../models/configModel.js";

/**
 * Gets configuration settings based on provided keys.
 * @returns {Object} JSON response with configuration settings.
 */
export const getConfig = async (req, res) => {
  const keys = req.query.keys?.split(",") || [];

  try {
    const configItems = await Config.find({ key: { $in: keys } });

    res.json({ config: configItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const updatePromises = keys.map(async (key) => {
      if (config.hasOwnProperty(key)) {
        const updatedConfig = await Config.findOneAndUpdate({ key }, { value: config[key] }, { new: true, upsert: true });
        return updatedConfig;
      } else {
        console.warn(`Key ${key} not found in config object`);
        return null;
      }
    });

    const updatedConfigs = await Promise.all(updatePromises);

    const validUpdatedConfigs = updatedConfigs.filter((config) => config !== null);

    res.json({ message: "Configuration updated successfully", config: validUpdatedConfigs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
