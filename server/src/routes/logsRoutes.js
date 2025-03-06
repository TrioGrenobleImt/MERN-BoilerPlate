import express from "express";
import { deleteAllLogs, deleteLog, getLogs } from "../controllers/logController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { logLevels } from "../utils/enums/logLevel.js";

const router = express.Router();

router.get("/", verifyToken({ role: "admin" }), getLogs);

router.get("/log-levels", verifyToken({ role: "admin" }), (req, res) => {
  res.send(logLevels);
});

router.delete("/:id", verifyToken({ role: "admin" }), deleteLog);

router.delete("/", verifyToken({ role: "admin" }), deleteAllLogs);

export default router;
