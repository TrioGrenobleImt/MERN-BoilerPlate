import express from "express";
import { getDefaultAvatar, updateUserAvatar } from "../controllers/uploadController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/avatar/default", getDefaultAvatar);

router.put("/avatar/:id", verifyToken(), updateUserAvatar);

export default router;
