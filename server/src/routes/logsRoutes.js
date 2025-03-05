import express from "express";
import { createLog, getLogs } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/list", verifyToken({ role: "admin" }), getLogs);

router.post("/new", verifyToken({ role: "admin" }), createLog);

export default router;
