import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Assurez-vous que le modèle User est importé
import { userRoles } from "../utils/enums/userRoles.js";

/**
 * Middleware to verify JWT token and, if specified, check the user's role.
 *
 * @param {Object} options - Options for the middleware.
 * @param {string} [options.role] - Required role to access the route (e.g., "admin").
 * @returns {Function} Express middleware function.
 */
const verifyToken = ({ role } = {}) => {
  return async (req, res, next) => {
    const token = req.cookies["__access__token"];

    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
      if (err) return res.status(403).json({ message: "Access Token is invalid" });

      req.userId = payload.id;

      if (role === userRoles.ADMIN) {
        try {
          const user = await User.findOne({ _id: payload.id });

          if (!user) return res.status(400).json({ message: "No such user" });
          if (user.role !== userRoles.ADMIN) {
            return res.status(403).json({ message: "Access restricted to administrators" });
          }
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }

      next();
    });
  };
};

export default verifyToken;
