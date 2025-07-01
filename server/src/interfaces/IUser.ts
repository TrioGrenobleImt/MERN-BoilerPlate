import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  forename: string;
  email: string;
  username: string;
  password: string;
  role: string;
  avatar: string;
  auth_type: string;
  fullname?: string; // virtual
}
