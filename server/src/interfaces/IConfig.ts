import mongoose, { Document } from "mongoose";

export interface IConfig extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}
