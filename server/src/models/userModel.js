import mongoose from "mongoose";
import { userRoles } from "../utils/enums/userRoles.js";

// Function to generate the default avatar URL
const getDefaultAvatar = (username) => {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;
};

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
      default: "", // Set an empty string initially
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
    this.avatar = getDefaultAvatar(this.username); // Set avatar based on username
  }
  next();
});

export default mongoose.model("User", UserSchema);
