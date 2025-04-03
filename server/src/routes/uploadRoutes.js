import express from "express";
import { updateUserAvatar } from "../controllers/uploadController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadConfig } from "../configuration/storageConfig.js";

export const uploadRouter = new express.Router();

uploadRouter.post("/avatar/:id", verifyToken(), uploadConfig.single("avatar"), updateUserAvatar);
