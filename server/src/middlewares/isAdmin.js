import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { roles } from "../utils/enums/roles.js";

export const isAdmin = async (req, res, next) => {
  const token = req.cookies["__access__token"];

  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  const { id } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
  const user = await User.findById({ _id: id });

  if (!user) return res.status(400).json({ message: "No such user" });

  if (user.role !== roles.ADMIN) return res.status(403).json({ message: "This route is only authorized for administrator" });

  next();
};

export default isAdmin;
