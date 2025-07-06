import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { createLog } from "../controllers/logController.js";
import { logLevels } from "../utils/enums/logLevels.js";
import mongoose from "mongoose";

interface TokenPayload extends JwtPayload {
  id: string;
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
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "global.expired_session" });
      return;
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as string) as TokenPayload;

      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        res.status(400).json({ error: "No such user" });
        return;
      }

      req.userId = new mongoose.Types.ObjectId(decoded.id);

      if (role && user.role !== role) {
        await createLog({
          message: `User ${user.username} attempted to access a restricted route`,
          userId: user._id,
          level: logLevels.ERROR,
        });
        res.status(403).json({ error: "Access restricted" });
        return;
      }

      next();
    } catch (err: any) {
      if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        res.status(403).json({ error: "Access Token is invalid" });
        return;
      }
      res.status(500).json({ error: err.message });
    }
  };
};
