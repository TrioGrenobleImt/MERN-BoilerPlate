import mongoose from "mongoose";
import { userRoles } from "../utils/enums/userRoles.js";
import { getRandomColor } from "../utils/getRandomColors.js";

function defaultAvatarUrl() {
  const color = getRandomColor();
  return `http://localhost:3000/api/uploads/avatar/default?color=${encodeURIComponent(color)}`;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    forename: {
      type: String,
      required: true,
      trim: true,
    },
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
    avatar: {
      type: String,
      default: defaultAvatarUrl(),
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual("fullname").get(function () {
  const formattedforename = this.forename.charAt(0).toUpperCase() + this.forename.slice(1).toLowerCase();
  return `${this.name} ${formattedforename}`;
});

export default mongoose.model("User", UserSchema);
