import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { userRoles } from "../utils/enums/userRoles.js";

/**
 * Middleware to verify JWT token and, if specified, check the user's role.
 *
 * @param {Object} options - Options for the middleware.
 * @param {string} [options.role] - Required role to access the route (e.g., "admin").
 * @returns {Function} Express middleware function.
 */
export const verifyToken =
  ({ role } = {}) =>
  async (req, res, next) => {
    try {
      const token = req.cookies["__access__token"];
      if (!token) return res.status(401).json({ message: "Not Authenticated" });

      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
      req.userId = payload.id;

      const user = await User.findById(payload.id);
      if (!user) return res.status(400).json({ message: "No such user" });

      if (role && user.role !== role) {
        return res.status(403).json({ message: "Access restricted" });
      }

      return next();
    } catch (error) {
      return res.status(error.name === "JsonWebTokenError" ? 403 : 500).json({ message: error.message });
    }
  };
