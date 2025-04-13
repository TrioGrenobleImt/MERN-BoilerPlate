import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { createLog } from "../controllers/logController.js";
import { logLevels } from "../utils/enums/logLevel.js";

/**
 * Middleware to verify JWT token and, if specified, check the user's role.
 * This middleware verifies the access token from the cookie and ensures the user has the required role (if provided).
 *
 * @param {Object} options - Options for the middleware.
 * @param {string} [options.role] - Required role to access the route (e.g., "admin").
 * @returns {Function} Express middleware function that verifies the token and checks the user's role.
 */
export const verifyToken = ({ role } = {}) => {
  return async (req, res, next) => {
    const token = req.cookies["__access__token"];
    if (!token) return res.status(401).json({ error: "Not Authenticated" });

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
      if (err) return res.status(403).json({ error: "Access Token is invalid" });

      try {
        const user = await User.findOne({ _id: payload.id });
        if (!user) return res.status(400).json({ error: "No such user" });

        req.userId = payload.id;

        if (role && user.role !== role) {
          createLog({
            message: `User ${user.username} attempted to access a restricted route`,
            userId: user._id,
            level: logLevels.ERROR,
          });
          return res.status(403).json({ error: "Access restricted" });
        }
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      next();
    });
  };
};
