import mongoose from "mongoose";
import { roles } from "../utils/enums/roles.js";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: roles.USER,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", UserSchema);
