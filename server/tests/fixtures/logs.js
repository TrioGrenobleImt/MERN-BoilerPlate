import { logLevels } from "../../src/utils/enums/logLevel";

export const basicLog = {
  message: "Log message",
  userId: "userId",
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
