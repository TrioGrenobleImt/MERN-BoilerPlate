import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { createLog } from "../controllers/logController.js";
import { logLevels } from "../utils/enums/logLevels.ts";
import mongoose from "mongoose";

interface TokenPayload extends JwtPayload {
  id: string;
}

// Étends Request pour ajouter userId custom
interface AuthRequest extends Request {
  userId?: mongoose.Types.ObjectId;
}

interface VerifyTokenOptions {
  role?: string;
}

/**
 * Middleware to verify JWT token and optionally check user role.
 * @param options - Options including required role.
 * @returns Express middleware function.
 */
export const verifyToken = ({ role }: VerifyTokenOptions = {}) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies["__access__token"];
    if (!token) return res.status(401).json({ error: "global.expired_session" });

    try {
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as string) as TokenPayload;

      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).json({ error: "No such user" });

      req.userId = new mongoose.Types.ObjectId(decoded.id);

      if (role && user.role !== role) {
        await createLog({
          message: `User ${user.username} attempted to access a restricted route`,
          userId: user._id,
          level: logLevels.ERROR,
        });
        return res.status(403).json({ error: "Access restricted" });
      }

      next();
    } catch (error: any) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Access Token is invalid" });
      }
      return res.status(500).json({ error: error.message });
    }
  };
};
