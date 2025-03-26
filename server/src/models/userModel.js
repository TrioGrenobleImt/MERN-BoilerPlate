import mongoose from "mongoose";
import { userRoles } from "../utils/enums/userRoles.js";
import { generateRandomAvatar } from "../utils/generateRandomAvatar.js";

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
      default: "",
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

UserSchema.pre("save", function (next) {
  if (!this.avatar && this.username) {
    this.avatar = generateRandomAvatar(this.username);
  }
  next();
});

export default mongoose.model("User", UserSchema);
