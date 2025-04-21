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
