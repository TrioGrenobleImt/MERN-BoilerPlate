import express from "express";
import { updateUserAvatar } from "../controllers/uploadController.js";
import verifyToken from "../middlewares/verifyToken.js";
import uploadConfig from "../configuration/storageConfig.js";

const router = express.Router();

router.post("/avatar/:id", verifyToken(), uploadConfig.single("avatar"), updateUserAvatar);

export default router;
