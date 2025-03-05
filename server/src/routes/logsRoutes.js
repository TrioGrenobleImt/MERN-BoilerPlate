import express from "express";
import { deleteAllLogs, deleteLog, getLogs } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken({ role: "admin" }), getLogs);

router.delete("/:id", verifyToken({ role: "admin" }), deleteLog);

router.delete("/", verifyToken({ role: "admin" }), deleteAllLogs);

export default router;
