import express from "express";
import { getLogs } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/list", verifyToken({ role: "admin" }), getLogs);

export default router;
