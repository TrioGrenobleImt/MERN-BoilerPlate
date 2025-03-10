import express from "express";
import { deleteAllLogs, deleteLog, getLogs, getLoglevels } from "../controllers/logController.js";

const router = express.Router();

router.get("/", getLogs);

router.get("/log-levels", getLoglevels);

router.delete("/:id", deleteLog);

router.delete("/", deleteAllLogs);

export default router;
