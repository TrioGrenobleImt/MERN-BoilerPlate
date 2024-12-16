import jwt from "jsonwebtoken";
import { Constants } from "./Constants.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: Constants.MAX_AGE / 1000 });
};
