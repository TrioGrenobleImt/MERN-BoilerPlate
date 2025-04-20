import { Config } from "../models/configModel.js";

export const getConfig = async (req, res) => {
  try {
    const config = await Config.find();
    res.status(200).json({ config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createConfig = async (req, res) => {};

export const updateConfig = async (req, res) => {};

export const deleteConfig = async (req, res) => {};
