import mongoose, { Model } from "mongoose";
import { IConfig } from "../interfaces/IConfig.js";

const configSchema = new mongoose.Schema<IConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Config: Model<IConfig> = mongoose.model<IConfig>("Config", configSchema);
