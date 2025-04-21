import { Config } from "../models/configModel.js";

export const getConfig = async (req, res) => {
  try {
    const config = await Config.find();
    res.status(200).json({ config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createConfig = async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const config = await Config.create({ key, value });

    res.status(201).json({ config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateConfig = async (req, res) => {};

export const deleteConfig = async (req, res) => {};
