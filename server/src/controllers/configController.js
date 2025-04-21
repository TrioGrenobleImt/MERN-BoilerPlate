import { Config } from "../models/configModel.js";

// Express + Mongoose controller
export const getConfig = async (req, res) => {
  const keys = req.query.keys?.split(",") || [];

  try {
    const configItems = await Config.find({ key: { $in: keys } });

    res.json({ config: configItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  const { keys } = req.body;

  if (!keys || Object.keys(keys).length === 0) {
    return res.status(400).json({ message: "No keys to update" });
  }

  try {
    const updatePromises = Object.keys(keys).map(async (key) => {
      const updatedConfig = await Config.findOneAndUpdate({ key }, { value: keys[key] }, { new: true });
      return updatedConfig;
    });

    const updatedConfigs = await Promise.all(updatePromises);

    res.json({ message: "Configuration updated successfully", config: updatedConfigs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
