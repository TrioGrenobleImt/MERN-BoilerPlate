import mongoose, { Document } from "mongoose";
import { logLevels } from "../utils/enums/logLevels.js";

export interface ILog extends Document {
  _id: mongoose.Types.ObjectId;
  message: string;
  user: mongoose.Types.ObjectId;
  level: logLevels;
  createdAt: Date;
  updatedAt: Date;
}
