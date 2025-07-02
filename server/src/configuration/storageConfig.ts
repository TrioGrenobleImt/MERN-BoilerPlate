import multer from "multer";
import { Request } from "express";
import path from "path";
import mongoose from "mongoose";

interface MulterRequest extends Request {
  userId: mongoose.Types.ObjectId;
}

// Configuration for Multer to handle file uploads
const storageConfig = multer.diskStorage({
  destination: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "./uploads/users/avatars");
  },

  filename: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const extension = path.extname(file.originalname);
    const userIdPart = req.userId;
    cb(null, `avatar_${userIdPart}_${Date.now()}${extension}`);
  },
});

// Middleware Multer to handle file uploads
export const uploadConfig = multer({
  storage: storageConfig,
});
