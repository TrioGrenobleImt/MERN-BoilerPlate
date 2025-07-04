import mongoose from "mongoose";
import { logLevels } from "../../src/utils/enums/logLevels";

export const basicLog = {
  message: "Log message",
  userId: new mongoose.Types.ObjectId(),
  level: logLevels.INFO,
};

export const logWithMissingParams = {
  message: "Log message",
  userId: null,
  level: logLevels.INFO,
};

export const logInvalidLevel = {
  message: "Log message",
  userId: "test",
  level: "invalidLevel",
};
