import Log from "../models/logModel.js";

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("user", "-password");
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getLogs };
