import mongoose from "mongoose";
import { logLevels } from "../../src/utils/enums/logLevels";

export const basicLog = {
  message: "Log message",
  userId: new mongoose.Types.ObjectId(),
  level: logLevels.INFO,
};
