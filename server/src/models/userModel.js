import mongoose from "mongoose";
import { userRoles } from "../utils/enums/userRoles.js";

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
      default: userRoles.USER,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", UserSchema);
