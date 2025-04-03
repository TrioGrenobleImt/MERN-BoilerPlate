import mongoose from "mongoose";
import { logLevels } from "../utils/enums/logLevel.js";

const LogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    level: {
      type: Object.values(logLevels),
      required: true,
      default: logLevels.INFO,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Log = mongoose.model("Log", LogSchema);
