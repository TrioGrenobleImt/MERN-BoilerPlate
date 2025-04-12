import express from "express";
import { updateUserAvatar } from "../controllers/uploadController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadConfig } from "../configuration/storageConfig.js";

export const uploadRouter = new express.Router();

/**
 * @route POST /avatar/:id
 * @description Updates the avatar of a user by their ID.
 * @param {string} id - The ID of the user whose avatar is being updated.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 * @middleware uploadConfig.single("avatar") - Handles the file upload for the "avatar" field.
 */
uploadRouter.post("/avatar/:id", verifyToken(), uploadConfig.single("avatar"), updateUserAvatar);
