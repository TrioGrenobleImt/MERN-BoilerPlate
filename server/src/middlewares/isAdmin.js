import User, { userRoles } from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (user.role !== userRoles.ADMIN) return res.status(403).json({ message: "You are not authorized to do this" });

  next();
};

export default isAdmin;
