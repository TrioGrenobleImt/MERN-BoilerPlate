import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/IUser.ts";
import { userRoles } from "../utils/enums/userRoles.ts";
import { authTypes } from "../utils/enums/authTypes.ts";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, uppercase: true },
    forename: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: userRoles.USER },
    avatar: { type: String, default: "" },
    auth_type: { type: String, default: authTypes.LOCAL },
  },
  { timestamps: true },
);

UserSchema.virtual("fullname").get(function (this: IUser) {
  const formattedForename = this.forename.charAt(0).toUpperCase() + this.forename.slice(1).toLowerCase();
  return `${this.name} ${formattedForename}`;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export const User = model<IUser>("User", UserSchema);
