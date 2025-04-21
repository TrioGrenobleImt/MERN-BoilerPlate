import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Config = mongoose.model("Config", configSchema);
