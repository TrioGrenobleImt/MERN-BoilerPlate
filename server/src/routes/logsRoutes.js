import express from "express";
import { deleteAllLogs, deleteLog, getLogs, getLoglevels } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken({ role: "admin" }), getLogs);

router.get("/log-levels", verifyToken({ role: "admin" }), getLoglevels);

router.delete("/:id", verifyToken({ role: "admin" }), deleteLog);

router.delete("/", verifyToken({ role: "admin" }), deleteAllLogs);

export default router;
